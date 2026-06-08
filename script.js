"use strict";

// Remplace cette adresse par ton email professionnel pour activer FormSubmit.
const CONTACT_EMAIL = "spierrelouis45@gmail.com";
const EMAIL_IS_CONFIGURED = Boolean(CONTACT_EMAIL);
const EMAIL_ENDPOINT = EMAIL_IS_CONFIGURED
  ? `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`
  : "";

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const backToTop = document.querySelector("[data-back-to-top]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const cursorGlow = document.querySelector(".cursor-glow");
const canvas = document.querySelector("[data-particles]");

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

document.querySelectorAll("[data-email-link]").forEach((link) => {
  link.setAttribute("href", `mailto:${CONTACT_EMAIL}`);
});

document.querySelectorAll("[data-email-label]").forEach((label) => {
  label.textContent = EMAIL_IS_CONFIGURED ? CONTACT_EMAIL : "Via le formulaire";
});

function onScroll() {
  const scrolled = window.scrollY > 18;
  header?.classList.toggle("is-scrolled", scrolled);
  backToTop?.classList.toggle("is-visible", window.scrollY > 420);
}

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

function closeMobileNav() {
  navToggle?.setAttribute("aria-expanded", "false");
  navLinks?.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

navToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

navLinks?.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("click", () => {
  if (navToggle?.getAttribute("aria-expanded") === "true") {
    closeMobileNav();
  }
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileNav();
  });
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -40px 0px" },
);

document.querySelectorAll(".reveal, .skill-card").forEach((el) => revealObserver.observe(el));

function setupProjectCarousels() {
  const projectsSection = document.querySelector("#projets");
  const carousels = Array.from(document.querySelectorAll("[data-project-carousel]")).map((carousel) => {
    const slidesWrap = carousel.querySelector(".project-slides");
    const dotsWrap = carousel.querySelector(".project-dots");
    if (!slidesWrap || !dotsWrap) return { start() {}, stop() {} };

    const images = Array.from(slidesWrap?.querySelectorAll("img") || []).slice(0, 3);
    Array.from(slidesWrap?.querySelectorAll("img") || [])
      .slice(3)
      .forEach((image) => image.remove());

    let index = 0;
    let intervalId = 0;

    images.forEach((image, imageIndex) => {
      image.loading = image.loading || "lazy";
      image.decoding = image.decoding || "async";
      image.classList.toggle("is-active", imageIndex === 0);
    });

    dotsWrap.innerHTML = "";
    images.forEach((_, imageIndex) => {
      const dot = document.createElement("i");
      dot.classList.toggle("is-active", imageIndex === 0);
      dotsWrap.append(dot);
    });

    carousel.classList.toggle("has-images", images.length > 0);
    carousel.classList.toggle("has-single-image", images.length === 1);

    function goTo(nextIndex) {
      if (images.length < 2) return;
      index = (nextIndex + images.length) % images.length;
      images.forEach((image, imageIndex) => image.classList.toggle("is-active", imageIndex === index));
      Array.from(dotsWrap.children).forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      if (images.length < 2 || intervalId) return;
      intervalId = window.setInterval(() => goTo(index + 1), 3200);
    }

    function stop() {
      window.clearInterval(intervalId);
      intervalId = 0;
    }

    return { start, stop };
  });

  if (!projectsSection || carousels.length === 0) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const setRunning = (running) => {
    carousels.forEach((carousel) => {
      if (running && !document.hidden) carousel.start();
      else carousel.stop();
    });
  };

  const projectObserver = new IntersectionObserver(
    ([entry]) => setRunning(entry.isIntersecting),
    { threshold: 0.28 },
  );

  projectObserver.observe(projectsSection);
  document.addEventListener("visibilitychange", () => {
    const rect = projectsSection.getBoundingClientRect();
    setRunning(!document.hidden && rect.top < window.innerHeight && rect.bottom > 0);
  });
}

setupProjectCarousels();

if (cursorGlow && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x;
  let ty = y;

  window.addEventListener(
    "mousemove",
    (event) => {
      tx = event.clientX;
      ty = event.clientY;
    },
    { passive: true },
  );

  function moveGlow() {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    cursorGlow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(moveGlow);
  }

  moveGlow();
}

function setupParticles() {
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  let raf = 0;

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(74, Math.max(28, Math.floor((width * height) / 22000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.6 + 0.5,
    }));
  }

  function draw() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    context.clearRect(0, 0, width, height);

    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fillStyle = "rgba(208, 233, 255, 0.58)";
      context.fill();
    }

    const maxDistance = 125;
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          context.strokeStyle = `rgba(56, 214, 230, ${(1 - distance / maxDistance) * 0.16})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }
    }

    raf = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      draw();
    }
  });
}

setupParticles();

function clearErrors(form) {
  form.querySelectorAll("[data-error-for]").forEach((el) => {
    el.textContent = "";
  });
}

function setError(form, fieldName, message) {
  const error = form.querySelector(`[data-error-for="${fieldName}"]`);
  if (error) error.textContent = message;
}

function validateForm(form) {
  clearErrors(form);
  const data = Object.fromEntries(new FormData(form).entries());
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!String(data.name || "").trim()) errors.name = "Votre nom est requis.";
  if (!emailRegex.test(String(data.email || ""))) errors.email = "Email invalide.";
  if (!String(data.projectType || "").trim()) errors.projectType = "Sélectionnez un type.";
  if (!String(data.budget || "").trim()) errors.budget = "Sélectionnez un budget.";
  if (String(data.phone || "").trim() && String(data.phone).replace(/[^\d+]/g, "").length < 7) {
    errors.phone = "Téléphone trop court.";
  }
  if (String(data.message || "").trim().length < 20) {
    errors.message = "Détaillez votre besoin en au moins 20 caractères.";
  }

  Object.entries(errors).forEach(([field, message]) => setError(form, field, message));
  return { isValid: Object.keys(errors).length === 0, data };
}

function buildMailto(data) {
  const subject = encodeURIComponent(`Nouveau projet - ${data.projectType || "Portfolio"}`);
  const body = encodeURIComponent(
    [
      `Nom: ${data.name}`,
      `Email: ${data.email}`,
      `Téléphone: ${data.phone || "Non précisé"}`,
      `Type de projet: ${data.projectType}`,
      `Budget: ${data.budget}`,
      "",
      "Message:",
      data.message,
    ].join("\n"),
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

async function sendWithFormSubmit(data) {
  const payload = {
    name: data.name,
    email: data.email,
    telephone: data.phone,
    type_de_projet: data.projectType,
    budget: data.budget,
    message: data.message,
    _subject: `Nouveau projet depuis le portfolio - ${data.projectType}`,
    _template: "table",
  };

  const response = await fetch(EMAIL_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Le service email n'a pas confirme l'envoi.");
  }

  return response.json();
}

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const { isValid, data } = validateForm(form);

  if (!isValid) {
    formStatus.textContent = "Vérifiez les champs indiqués.";
    formStatus.className = "form-status error";
    return;
  }

  if (data._honey) return;

  const submitButton = form.querySelector(".form-submit");
  submitButton.disabled = true;
  formStatus.textContent = EMAIL_IS_CONFIGURED ? "Envoi en cours..." : "Ouverture de votre client email...";
  formStatus.className = "form-status";

  try {
    if (EMAIL_IS_CONFIGURED) {
      await sendWithFormSubmit(data);
      form.reset();
      formStatus.textContent = "Message envoyé. Merci, je reviens vers vous rapidement.";
      formStatus.className = "form-status success";
    } else {
      window.location.href = buildMailto(data);
      formStatus.textContent =
        "Email non configuré dans script.js: le message a été préparé via votre client email.";
      formStatus.className = "form-status error";
    }
  } catch (error) {
    window.location.href = buildMailto(data);
    formStatus.textContent =
      "Le service d'envoi est indisponible. Le message a été préparé via votre client email.";
    formStatus.className = "form-status error";
  } finally {
    submitButton.disabled = false;
  }
});
