const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const classFilters = document.querySelectorAll(".class-filter");
const memberPanels = document.querySelectorAll(".member-panel");
const currentYear = document.querySelector("#current-year");
const revealTargets = document.querySelectorAll(".section-kicker, .section-topline, .values-strip, .organization-block, .activity-card, .timeline-item, .achievement-carousel, .practice-schedule, .contact-link");

if (currentYear) currentYear.textContent = new Date().getFullYear();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });

  revealTargets.forEach((target) => {
    target.classList.add("reveal-on-scroll");
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Buka navigasi" : "Tutup navigasi");
    navigation.classList.toggle("open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Buka navigasi");
      navigation.classList.remove("open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Buka navigasi");
      navigation.classList.remove("open");
      menuButton.focus();
    }
  });
}

classFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const selectedClass = filter.dataset.class;
    classFilters.forEach((button) => {
      const isActive = button === filter;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    memberPanels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== selectedClass;
    });
  });
});

const achievementCarousel = document.querySelector("[data-achievement-carousel]");

if (achievementCarousel) {
  const achievementSlides = achievementCarousel.querySelectorAll("[data-achievement-slide]");
  const achievementPages = achievementCarousel.querySelectorAll("[data-achievement-page]");
  const achievementCounter = achievementCarousel.querySelector("[data-achievement-counter]");
  let activeAchievement = 0;

  const showAchievement = (index) => {
    activeAchievement = (index + achievementSlides.length) % achievementSlides.length;
    achievementSlides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== activeAchievement;
    });
    achievementPages.forEach((page, pageIndex) => {
      const isActive = pageIndex === activeAchievement;
      page.classList.toggle("active", isActive);
      page.setAttribute("aria-pressed", String(isActive));
    });
    if (achievementCounter) {
      const separator = document.createElement("span");
      separator.textContent = "/";
      achievementCounter.replaceChildren(
        String(activeAchievement + 1).padStart(2, "0"),
        " ",
        separator,
        " ",
        String(achievementSlides.length).padStart(2, "0")
      );
    }
  };

  achievementPages.forEach((page) => {
    page.addEventListener("click", () => showAchievement(Number(page.dataset.achievementPage)));
  });
  achievementCarousel.querySelector("[data-achievement-previous]").addEventListener("click", () => {
    showAchievement(activeAchievement - 1);
  });
  achievementCarousel.querySelector("[data-achievement-next]").addEventListener("click", () => {
    showAchievement(activeAchievement + 1);
  });
  achievementCarousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showAchievement(activeAchievement - 1);
    if (event.key === "ArrowRight") showAchievement(activeAchievement + 1);
  });

  const lightboxImages = Array.from(document.querySelectorAll(".achievement-gallery img, .activity-photo"));
  const lightbox = document.querySelector("[data-achievement-lightbox]");

  if (lightbox && lightboxImages.length) {
    const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
    const lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
    const lightboxCounter = lightbox.querySelector("[data-lightbox-counter]");
    let activeImageIndex = 0;
    let focusedImage = null;

    const showLightboxImage = (index) => {
      activeImageIndex = (index + lightboxImages.length) % lightboxImages.length;
      const image = lightboxImages[activeImageIndex];
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = image.alt;
      lightboxCounter.textContent = `${String(activeImageIndex + 1).padStart(2, "0")} / ${String(lightboxImages.length).padStart(2, "0")}`;
    };

    const openLightbox = (image) => {
      focusedImage = image;
      showLightboxImage(lightboxImages.indexOf(image));
      lightbox.showModal();
    };

    lightboxImages.forEach((image) => {
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-haspopup", "dialog");
      image.setAttribute("aria-label", `Perbesar foto: ${image.alt}`);
      image.addEventListener("click", () => openLightbox(image));
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(image);
        }
      });
    });

    lightbox.querySelector("[data-lightbox-close]").addEventListener("click", () => lightbox.close());
    lightbox.querySelector("[data-lightbox-previous]").addEventListener("click", () => {
      showLightboxImage(activeImageIndex - 1);
    });
    lightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => {
      showLightboxImage(activeImageIndex + 1);
    });
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("cancel", (event) => {
      event.preventDefault();
      lightbox.close();
    });
    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        lightbox.close();
        return;
      }
      if (event.key === "ArrowLeft") showLightboxImage(activeImageIndex - 1);
      if (event.key === "ArrowRight") showLightboxImage(activeImageIndex + 1);
    });
    lightbox.addEventListener("close", () => {
      if (focusedImage) window.setTimeout(() => focusedImage.focus(), 0);
    });
  }
}

document.querySelectorAll(".placeholder-link").forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});