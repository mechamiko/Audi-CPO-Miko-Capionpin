"use strict";

// Shared animation settings.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const activeAnimations = new Set();
const animationSettings = {
  duration: 650,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  dialogOpenDuration: 360,
  dialogCloseDuration: 180,
  staggerDelay: 75,
};

function animateElement(element, keyframes, options = {}) {
  if (reducedMotion.matches || !element?.animate) {
    return null;
  }

  const animation = element.animate(keyframes, {
    duration: animationSettings.duration,
    easing: animationSettings.easing,
    ...options,
  });

  activeAnimations.add(animation);
  animation.finished
    .catch(() => {})
    .finally(() => activeAnimations.delete(animation));

  return animation;
}

reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) {
    activeAnimations.forEach((animation) => animation.cancel());
  }
});

// Inquiry drafts are downloaded locally; no information is sent to a dealer.
function downloadInquiry(text) {
  const file = new Blob([text], { type: "text/plain;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = "audi-inquiry.txt";
  document.body.append(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

function initializeInquiryDialog() {
  const dialog = document.querySelector("#request-dialog");
  const form = document.querySelector("#request-form");

  if (!dialog || !form) {
    return;
  }

  const title = dialog.querySelector("#request-title");
  const status = dialog.querySelector(".form-status");
  const tradeField = dialog.querySelector("#trade-field");
  const closeButton = dialog.querySelector(".dialog-close");
  const tradeRequest = "Value your trade";

  let requestType = "Get a quote";
  let opener = null;

  function openDialog(button) {
    opener = button;
    requestType = button.dataset.request;

    form.reset();
    title.textContent = requestType;
    status.textContent = "";
    tradeField.hidden = requestType !== tradeRequest;

    if (button.dataset.category) {
      form.elements.vehicle.value = button.dataset.category.replace(
        /^New /,
        "",
      );
    }

    dialog.showModal();
    document.body.classList.add("modal-open");

    animateElement(
      dialog,
      [
        { opacity: 0, transform: "translateY(18px) scale(.985)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      { duration: animationSettings.dialogOpenDuration },
    );
  }

  function closeDialog() {
    if (!dialog.open || dialog.classList.contains("is-closing")) {
      return;
    }

    dialog.classList.add("is-closing");

    const animation = animateElement(
      dialog,
      [
        { opacity: 1, transform: "translateY(0) scale(1)" },
        { opacity: 0, transform: "translateY(10px) scale(.99)" },
      ],
      {
        duration: animationSettings.dialogCloseDuration,
        easing: "ease-in",
      },
    );

    if (animation) {
      animation.finished.catch(() => {}).then(() => dialog.close());
    } else {
      dialog.close();
    }
  }

  document.querySelectorAll("[data-request]").forEach((button) => {
    button.addEventListener("click", () => openDialog(button));
  });

  closeButton.addEventListener("click", closeDialog);

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) {
      return;
    }

    const bounds = dialog.getBoundingClientRect();
    const clickedOutside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (clickedOutside) {
      closeDialog();
    }
  });

  dialog.addEventListener("close", () => {
    dialog.classList.remove("is-closing");
    document.body.classList.remove("modal-open");
    opener?.focus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const lines = [
      "Audi Stuart — inquiry draft",
      "",
      `Request: ${requestType}`,
      `Vehicle: ${data.get("vehicle")}`,
    ];

    if (requestType === tradeRequest && data.get("trade")) {
      lines.push(`Current vehicle: ${data.get("trade")}`);
    }

    lines.push(
      `Notes: ${data.get("notes") || "None"}`,
      "",
      "This inquiry has not been sent. Contact your dealership to discuss availability and next steps.",
    );

    downloadInquiry(lines.join("\n"));
    status.textContent =
      "Inquiry downloaded. Nothing has been sent to a dealership.";
  });
}

// Content stays visible if observation or animations are unavailable.
function initializeScrollAnimations() {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  const revealSelectors = [
    ".section-heading",
    ".wide-image",
    ".benefit-row",
    ".match-image",
    ".match-copy",
    ".resource-copy",
    ".lineup > h2",
    ".lineup-row",
    ".vehicle-rail .card-content",
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) {
          return;
        }

        observer.unobserve(target);

        if (target.matches(".match-image")) {
          animateElement(
            target.querySelector("img"),
            [
              { opacity: 0.7, transform: "scale(1.035)" },
              { opacity: 1, transform: "scale(1)" },
            ],
            { duration: 1400 },
          );
          return;
        }

        const elements = target.matches(".section-heading")
          ? [...target.children]
          : [target];

        elements.forEach((element, index) => {
          animateElement(
            element,
            [
              { opacity: 0, transform: "translateY(22px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              delay: index * animationSettings.staggerDelay,
              fill: "backwards",
            },
          );
        });
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(revealSelectors.join(", ")).forEach((element) => {
    observer.observe(element);
  });
}

function initializeVehicleCarousel() {
  const rail = document.querySelector(".vehicle-rail");

  if (!rail || !rail.firstElementChild) {
    return;
  }

  const carousel = rail.closest(".vehicle-carousel");
  const range = carousel.querySelector("#rail-range");
  const firstCard = rail.firstElementChild;

  function getCardStep() {
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    return cardWidth + gap;
  }

  function updatePosition() {
    const visibleCount = Number(
      getComputedStyle(rail).getPropertyValue("--visible-cards"),
    );
    const firstVisible = Math.min(
      Math.round(rail.scrollLeft / getCardStep()) + 1,
      rail.children.length - visibleCount + 1,
    );
    const lastVisible = Math.min(
      firstVisible + visibleCount - 1,
      rail.children.length,
    );

    if (range) {
      const start = String(firstVisible).padStart(2, "0");
      const end = String(lastVisible).padStart(2, "0");
      range.textContent = start === end ? start : `${start}–${end}`;
    }
  }

  function scrollToNextCard(direction) {
    rail.scrollBy({
      left: direction * getCardStep(),
      behavior: reducedMotion.matches ? "instant" : "smooth",
    });
  }

  rail.addEventListener("keydown", (event) => {
    const isArrowKey = ["ArrowLeft", "ArrowRight"].includes(event.key);

    if (event.target !== rail || !isArrowKey) {
      return;
    }

    event.preventDefault();
    scrollToNextCard(event.key === "ArrowRight" ? 1 : -1);
  });

  rail.addEventListener("scroll", updatePosition, { passive: true });
  new ResizeObserver(updatePosition).observe(rail);
  updatePosition();
}

// The script is deferred, so the page elements are ready at this point.
initializeInquiryDialog();
initializeScrollAnimations();
initializeVehicleCarousel();
