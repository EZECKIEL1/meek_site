document.addEventListener("DOMContentLoaded", () => {
  // Custom cursor (desktop only — disabled on touch via CSS)
  const cursor = document.getElementById("cursor");
  const cursorRing = document.getElementById("cursorRing");
  if (cursor && cursorRing && window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
      setTimeout(() => {
        cursorRing.style.left = e.clientX + "px";
        cursorRing.style.top = e.clientY + "px";
      }, 80);
    });
    document
      .querySelectorAll("a, button, .product-card, .collection-card")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursorRing.style.transform = "translate(-50%, -50%) scale(1.8)";
          cursorRing.style.borderColor = "var(--gold-light)";
        });
        el.addEventListener("mouseleave", () => {
          cursorRing.style.transform = "translate(-50%, -50%) scale(1)";
          cursorRing.style.borderColor = "var(--gold)";
        });
      });
  }

  // Navbar scroll
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 60);
    });
  }

  // Scroll reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), i * 100);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // Newsletter form — sends via FormSubmit, no backend required
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = document.getElementById("newsletterEmail");
      const msg = document.getElementById("newsletterMsg");
      const email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = "Merci de saisir une adresse e-mail valide.";
        return;
      }
      msg.textContent = "Envoi en cours...";
      try {
        const res = await fetch(newsletterForm.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(newsletterForm),
        });
        if (res.ok) {
          msg.textContent = "Merci ! Vous êtes inscrit(e) à l'univers MËËK.";
          newsletterForm.reset();
        } else {
          msg.textContent = "Une erreur est survenue, réessayez plus tard.";
        }
      } catch (err) {
        msg.textContent = "Une erreur est survenue, réessayez plus tard.";
      }
    });
  }
});
