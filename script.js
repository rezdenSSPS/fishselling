/**
 * Fin & Gill — Interactive JavaScript
 * Features:
 *  1. Mobile hamburger menu toggle
 *  2. Product category filter (All / Fish / Shellfish)
 *  3. Shopping cart (add, remove, count, total)
 *  4. Cart sidebar modal
 *  5. Newsletter form with email validation
 *  6. Toast notifications
 *  7. Scroll-triggered product card animations
 *  8. Close mobile menu when clicking a link
 */

document.addEventListener("DOMContentLoaded", () => {

  // ─── STATE ───
  const cart = [];

  // ─── DOM REFERENCES ───
  const hamburgerBtn    = document.getElementById("hamburger-btn");
  const hamburgerIcon   = document.getElementById("hamburger-icon");
  const mobileMenu      = document.getElementById("mobile-menu");
  const cartBtn         = document.getElementById("cart-btn");
  const cartCountEl     = document.getElementById("cart-count");
  const cartOverlay     = document.getElementById("cart-overlay");
  const cartPanel       = document.getElementById("cart-panel");
  const cartCloseBtn    = document.getElementById("cart-close-btn");
  const cartItemsEl     = document.getElementById("cart-items");
  const cartEmptyMsg    = document.getElementById("cart-empty-msg");
  const cartFooter      = document.getElementById("cart-footer");
  const cartTotalEl     = document.getElementById("cart-total");
  const filterBtns      = document.querySelectorAll(".filter-btn");
  const productCards    = document.querySelectorAll(".product-card");
  const addToCartBtns   = document.querySelectorAll(".add-to-cart-btn");
  const newsletterForm  = document.getElementById("newsletter-form");
  const emailInput      = document.getElementById("email-input");
  const emailError      = document.getElementById("email-error");
  const newsletterSuccess = document.getElementById("newsletter-success");
  const toastContainer  = document.getElementById("toast-container");


  // ═══════════════════════════════════════════════
  // 1. MOBILE HAMBURGER MENU
  // ═══════════════════════════════════════════════
  hamburgerBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburgerBtn.setAttribute("aria-expanded", isOpen);
    hamburgerIcon.textContent = isOpen ? "close" : "menu";
  });

  // Close menu when clicking a link
  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      hamburgerIcon.textContent = "menu";
    });
  });


  // ═══════════════════════════════════════════════
  // 2. PRODUCT CATEGORY FILTER
  // ═══════════════════════════════════════════════
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Update active button styles
      filterBtns.forEach(b => {
        b.classList.remove("bg-primary-fixed", "text-on-primary-fixed");
        b.classList.add("bg-surface-container-highest", "text-on-surface-variant");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.remove("bg-surface-container-highest", "text-on-surface-variant");
      btn.classList.add("bg-primary-fixed", "text-on-primary-fixed");
      btn.setAttribute("aria-selected", "true");

      const filter = btn.dataset.filter;

      // Show/hide cards with animation
      productCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === "all" || category === filter) {
          card.style.display = "";
          // Re-trigger entrance animation
          card.classList.remove("visible");
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.classList.add("visible");
            });
          });
        } else {
          card.classList.remove("visible");
          card.style.display = "none";
        }
      });
    });
  });


  // ═══════════════════════════════════════════════
  // 3. SHOPPING CART — ADD ITEMS
  // ═══════════════════════════════════════════════
  addToCartBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const name  = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);

      // Check if item already in cart
      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      updateCartUI();
      showToast(`${name} added to cart!`);

      // Button feedback animation
      btn.classList.add("scale-125");
      setTimeout(() => btn.classList.remove("scale-125"), 200);
    });
  });


  // ═══════════════════════════════════════════════
  // 4. CART SIDEBAR MODAL
  // ═══════════════════════════════════════════════
  function openCart() {
    cartOverlay.classList.remove("hidden");
    cartOverlay.setAttribute("aria-hidden", "false");
    cartPanel.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    cartCloseBtn.focus();
  }

  function closeCart() {
    cartOverlay.classList.add("hidden");
    cartOverlay.setAttribute("aria-hidden", "true");
    cartPanel.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    cartBtn.focus();
  }

  cartBtn.addEventListener("click", openCart);
  cartCloseBtn.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartPanel.classList.contains("open")) {
      closeCart();
    }
  });


  // ═══════════════════════════════════════════════
  // 5. CART UI UPDATE
  // ═══════════════════════════════════════════════
  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Update badge
    if (totalCount > 0) {
      cartCountEl.textContent = totalCount;
      cartCountEl.classList.remove("hidden");
    } else {
      cartCountEl.classList.add("hidden");
    }

    // Update cart panel contents
    if (cart.length === 0) {
      cartEmptyMsg.classList.remove("hidden");
      cartFooter.classList.add("hidden");
      cartItemsEl.innerHTML = "";
      cartItemsEl.appendChild(cartEmptyMsg);
    } else {
      cartEmptyMsg.classList.add("hidden");
      cartFooter.classList.remove("hidden");
      cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;

      // Rebuild items list
      cartItemsEl.innerHTML = "";
      cart.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "flex justify-between items-center py-4 border-b border-outline-variant/20";
        row.innerHTML = `
          <div class="flex-1">
            <h4 class="font-bold text-on-surface text-sm">${item.name}</h4>
            <p class="text-on-surface-variant text-xs">$${item.price.toFixed(2)} × ${item.qty}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-primary">$${(item.price * item.qty).toFixed(2)}</span>
            <button
              class="cart-remove-btn text-on-surface-variant hover:text-error p-1 rounded-full hover:bg-error-container transition-colors"
              data-index="${index}"
              aria-label="Remove ${item.name} from cart"
            >
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        `;
        cartItemsEl.appendChild(row);
      });

      // Attach remove handlers
      cartItemsEl.querySelectorAll(".cart-remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.index);
          const removedName = cart[idx].name;
          cart.splice(idx, 1);
          updateCartUI();
          showToast(`${removedName} removed from cart.`);
        });
      });
    }
  }


  // ═══════════════════════════════════════════════
  // 6. NEWSLETTER FORM VALIDATION
  // ═══════════════════════════════════════════════
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Reset state
    emailError.classList.add("hidden");
    emailError.textContent = "";
    newsletterSuccess.classList.add("hidden");
    emailInput.classList.remove("border-error");

    if (!email) {
      showEmailError("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(email)) {
      showEmailError("Please enter a valid email address.");
      return;
    }

    // Success
    newsletterSuccess.textContent = `🎉 Welcome aboard! We'll send updates to ${email}.`;
    newsletterSuccess.classList.remove("hidden");
    emailInput.value = "";
    showToast("Successfully subscribed!");
  });

  function showEmailError(message) {
    emailError.textContent = message;
    emailError.classList.remove("hidden");
    emailInput.classList.add("border-error");
    emailInput.focus();
  }


  // ═══════════════════════════════════════════════
  // 7. TOAST NOTIFICATIONS
  // ═══════════════════════════════════════════════
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast bg-surface-container-lowest text-on-surface px-6 py-3 rounded-full shadow-xl text-sm font-medium border border-outline-variant/20 flex items-center gap-2";
    toast.setAttribute("role", "status");
    toast.innerHTML = `
      <span class="material-symbols-outlined text-primary text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
      ${message}
    `;
    toastContainer.appendChild(toast);

    // Auto-remove after animation ends
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 2500);
  }


  // ═══════════════════════════════════════════════
  // 8. SCROLL-TRIGGERED CARD ANIMATIONS
  // ═══════════════════════════════════════════════
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  productCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 100}ms`;
    observer.observe(card);
  });

});
