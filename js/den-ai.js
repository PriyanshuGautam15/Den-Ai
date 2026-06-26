/* DEN-AI — Shared JavaScript */

(function () {
  "use strict";

  /* ---- UTC Clock ---- */
  var clockEl = document.getElementById("utcClock");
  if (clockEl) {
    function updateClock() {
      var n = new Date();
      clockEl.textContent =
        String(n.getUTCHours()).padStart(2, "0") +
        ":" +
        String(n.getUTCMinutes()).padStart(2, "0") +
        ":" +
        String(n.getUTCSeconds()).padStart(2, "0") +
        " UTC";
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ---- Mobile Nav Toggle ---- */
  var burger = document.getElementById("headerBurger");
  var nav = document.getElementById("headerNav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", isOpen);
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Scroll Reveal with stagger ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    var revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var siblings =
              entry.target.parentElement.querySelectorAll(".reveal");
            var idx = Array.from(siblings).indexOf(entry.target);
            entry.target.style.transitionDelay = idx * 0.08 + "s";
            entry.target.classList.add("visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
    );

    /* Fallback for slow connections / iframes */
    setTimeout(function () {
      reveals.forEach(function (el) {
        if (!el.classList.contains("visible")) el.classList.add("visible");
      });
    }, 3000);

    reveals.forEach(function (el) {
      revealObs.observe(el);
    });
  }

  /* ---- Bar Fill on Scroll ---- */
  document.querySelectorAll(".bar-track__fill").forEach(function (bar) {
    var target = bar.style.width;
    bar.style.width = "0%";
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              bar.style.width = target;
            }, 250);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(bar);
  });

  /* ---- Back to Top ---- */
  var backTop = document.getElementById("backToTop");
  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- Contact form submit via free email relay ---- */
  var form = document.getElementById("contactForm");
  if (form) {
    var statusEl = document.getElementById("formStatus");

    function setStatus(message, type) {
      if (!statusEl) return;
      statusEl.textContent = message || "";
      statusEl.classList.remove("form-status--success", "form-status--error");
      if (type === "success") statusEl.classList.add("form-status--success");
      if (type === "error") statusEl.classList.add("form-status--error");
    }

    function setButtonState(button, isLoading) {
      if (!button) return;
      button.disabled = !!isLoading;
      button.textContent = isLoading ? "Sending..." : "Send Message —";
    }

    function clean(value) {
      return (value || "").trim();
    }

    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var btn = form.querySelector(".btn--primary");
      var honeyPot = clean((form.website || {}).value);
      if (honeyPot) {
        setStatus(
          "Message sent. We will respond within 2 business days.",
          "success",
        );
        form.reset();
        return;
      }

      var payload = {
        firstName: clean((form.fname || {}).value),
        lastName: clean((form.lname || {}).value),
        email: clean((form.email || {}).value),
        company: clean((form.company || {}).value),
        subject: clean((form.subject || {}).value),
        message: clean((form.message || {}).value),
      };

      if (
        !payload.firstName ||
        !payload.lastName ||
        !payload.email ||
        !payload.message
      ) {
        setStatus("Please fill all required fields before sending.", "error");
        return;
      }

      setStatus("Sending your message...", "");
      setButtonState(btn, true);

      var formData = new FormData(form);
      formData.set("first_name", payload.firstName);
      formData.set("last_name", payload.lastName);
      formData.set("email", payload.email);
      formData.set("company", payload.company);
      formData.set("subject", payload.subject || "General Inquiry");
      formData.set("message", payload.message);
      formData.set("_replyto", payload.email);

      fetch(form.action, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Submission failed");
          }
          return response.json().catch(function () {
            return {};
          });
        })
        .then(function () {
          setStatus(
            "Message sent. We will respond within 2 business days.",
            "success",
          );
          form.reset();
        })
        .catch(function () {
          var fallbackRecipient = "contact@den-ai.in";
          var mailtoLink =
            "mailto:" +
            encodeURIComponent(fallbackRecipient) +
            "?subject=" +
            encodeURIComponent(
              "New DEN-AI Contact: " + (payload.subject || "General Inquiry"),
            ) +
            "&body=" +
            encodeURIComponent(
              [
                "First Name: " + payload.firstName,
                "Last Name: " + payload.lastName,
                "Email: " + payload.email,
                "Company: " + (payload.company || "N/A"),
                "Inquiry Type: " + (payload.subject || "General Inquiry"),
                "",
                "Message:",
                payload.message,
              ].join("\n"),
            );

          window.location.href = mailtoLink;
          setStatus(
            "Your email app opened as a fallback. Send the message there if the web form did not submit.",
            "success",
          );
        })
        .finally(function () {
          setButtonState(btn, false);
        });
    });
  }
})();
