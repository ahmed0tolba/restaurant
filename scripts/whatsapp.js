(function () {
  const phoneNumber = "201008152996"; // international format, no +
  const message = "Hello, I need more information.";
  const delayMs = 3000;

  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
    .wa-float {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 56px;
      height: 56px;
      background: #25D366;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 18px rgba(0,0,0,0.3);
      cursor: pointer;
      z-index: 9999;
      opacity: 0;
      transform: scale(0.6);
      transition:
        opacity 0.4s ease,
        transform 0.4s ease,
        box-shadow 0.3s ease;
    }

    .wa-float.show {
      opacity: 1;
      transform: scale(1);
    }

    .wa-float:hover {
      transform: scale(1.12);
      box-shadow: 0 10px 26px rgba(0,0,0,0.4);
    }

    .wa-float svg {
      width: 28px;
      height: 28px;
      fill: white;
    }

    /* Mobile: slightly bigger tap target */
    @media (max-width: 768px) {
      .wa-float {
        width: 62px;
        height: 62px;
      }
    }
  `;
  document.head.appendChild(style);

  // Create button
  const wa = document.createElement("a");
  wa.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  wa.target = "_blank";
  wa.rel = "noopener noreferrer";
  wa.className = "wa-float";
  wa.setAttribute("aria-label", "Chat on WhatsApp");

  wa.innerHTML = `
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 2.9C8.8 2.9 3 8.6 3 15.7c0 2.8.8 5.4 2.3 7.7L3 29l5.8-2.2c2.2 1.2 4.6 1.8 7.2 1.8 7.2 0 13-5.8 13-12.9C29 8.6 23.2 2.9 16 2.9zm7.5 18.3c-.3.9-1.7 1.6-2.4 1.7-.6.1-1.3.2-2.1-.1-.5-.2-1.1-.4-1.9-.8-3.4-1.5-5.6-5.1-5.8-5.3-.2-.2-1.4-1.9-1.4-3.6s.9-2.5 1.2-2.9c.3-.4.6-.5.8-.5h.6c.2 0 .5 0 .7.5.3.7 1 2.5 1.1 2.7.1.2.1.4 0 .6-.1.2-.2.4-.3.5-.2.2-.4.4-.6.6-.2.2-.4.4-.2.7.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.4 1.6.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.7-.1.3.1 2 .9 2.3 1.1.3.2.6.3.7.5.1.2.1.9-.2 1.8z"/>
    </svg>
  `;

  // Delay appearance
  setTimeout(() => {
    document.body.appendChild(wa);
    requestAnimationFrame(() => wa.classList.add("show"));
  }, delayMs);

})();
