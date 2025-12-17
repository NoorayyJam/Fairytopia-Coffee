
// menu.js - carousel, add-to-cart (qty), cart modal, per your requests

document.addEventListener('DOMContentLoaded', () => {
  /* ===== HERO CAROUSEL ===== */
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const dotsWrap = document.getElementById('heroDots');
  let index = 0;
  const intervalMs = 3000; // 3 seconds
  let timer = null;
  const total = slides.length;

  // create dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = i === 0 ? 'active' : '';
    btn.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(btn);
  });
  const dots = Array.from(dotsWrap.children);

  function setActive(i) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[i].classList.add('active');
    dots[i].classList.add('active');
  }

  function goTo(i) {
    index = (i + total) % total;
    setActive(index);
    resetTimer();
  }
  function nextSlide() { goTo(index + 1); }
  function prevSlide() { goTo(index - 1); }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  function startTimer(){ timer = setInterval(nextSlide, intervalMs); }
  function resetTimer(){ if (timer) clearInterval(timer); startTimer(); }

  // pause on hover to improve UX
  const hero = document.querySelector('.hero');
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', () => resetTimer());

  setActive(0);
  startTimer();

  /* ===== MENU CARD: Add to Cart + Qty Controls ===== */
  const cart = []; // items: { name, price, img, qty }
  const cartCountEl = document.getElementById('cartCount');
  const openCartBtn = document.getElementById('openCart');
  const cartModal = document.getElementById('cartModal');
  const closeCartBtn = document.getElementById('closeCart');
  const cartItemsWrap = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const clearCartBtn = document.getElementById('clearCart');
  const proceedBtn = document.getElementById('proceedOrder');

  // helper: find item index
  function findIndexByName(name) {
    return cart.findIndex(i => i.name === name);
  }

  // update cart UI (count + list)
  function updateCartUI() {
    const totalQty = cart.reduce((s, it) => s + it.qty, 0);
    cartCountEl.textContent = totalQty;
    cartItemsWrap.innerHTML = '';
    cart.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="ci-thumb"><img src="${it.img}" alt=""></div>
        <div class="ci-info">
          <h5>${it.name}</h5>
          <small>PKR ${it.price} × ${it.qty}</small>
        </div>
        <div class="ci-right">
          <div><strong>PKR ${it.price * it.qty}</strong></div>
          <button class="remove" data-i="${idx}">Remove</button>
        </div>
      `;
      cartItemsWrap.appendChild(row);
    });
    const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
    cartTotalEl.textContent = `PKR ${total}`;
  }

  // add item to cart (or increase qty)
  function addToCart(name, price, img) {
    const idx = findIndexByName(name);
    if (idx >= 0) {
      cart[idx].qty += 1;
    } else {
      cart.push({ name, price, img, qty: 1 });
    }
    updateCartUI();
  }

  // reduce qty or remove
  function reduceFromCart(name) {
    const idx = findIndexByName(name);
    if (idx === -1) return;
    if (cart[idx].qty > 1) cart[idx].qty -= 1;
    else cart.splice(idx, 1);
    updateCartUI();
  }

  // remove by index
  function removeAtIndex(i) {
    cart.splice(i, 1);
    updateCartUI();
  }

  // wire up add buttons & card qty controls
  document.querySelectorAll('.menu-card').forEach(card => {
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price, 10);
    const img = card.dataset.img || card.querySelector('.thumb img').src;
    const addBtn = card.querySelector('.add-btn');
    const qtyControls = card.querySelector('.qty-controls');
    const qtySpan = card.querySelector('.qty');
    const plus = card.querySelector('.qty-plus');
    const minus = card.querySelector('.qty-minus');

    addBtn.addEventListener('click', () => {
      // add to cart
      addToCart(name, price, img);
      // show qty controls, hide add button
      addBtn.style.display = 'none';
      qtyControls.style.display = 'flex';
      qtySpan.textContent = 1;
    });

    plus.addEventListener('click', () => {
      addToCart(name, price, img);
      // update qty shown on card (sync with cart)
      const idx = findIndexByName(name);
      const qty = idx >= 0 ? cart[idx].qty : 1;
      qtySpan.textContent = qty;
    });

    minus.addEventListener('click', () => {
      reduceFromCart(name);
      const idx = findIndexByName(name);
      if (idx >= 0) qtySpan.textContent = cart[idx].qty;
      else {
        // removed from cart entirely, show add button again
        qtyControls.style.display = 'none';
        addBtn.style.display = '';
      }
    });
  });

  // open cart
  openCartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
    cartModal.setAttribute('aria-hidden', 'false');
    updateCartUI();
  });

  // close cart
  closeCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('active');
    cartModal.setAttribute('aria-hidden', 'true');
  });

  // remove inside modal (delegate)
  cartItemsWrap.addEventListener('click', (e) => {
    if (e.target.matches('.remove')) {
      const i = parseInt(e.target.dataset.i, 10);
      // find name in cart, remove
      const name = cart[i].name;
      removeAtIndex(i);
      // also reset card controls for that item if present on page
      document.querySelectorAll('.menu-card').forEach(card => {
        if (card.dataset.name === name) {
          card.querySelector('.qty-controls').style.display = 'none';
          card.querySelector('.add-btn').style.display = '';
        }
      });
    }
  });

  // clear cart
  clearCartBtn.addEventListener('click', () => {
    // reset all qty controls on cards
    document.querySelectorAll('.menu-card').forEach(card => {
      card.querySelector('.qty-controls').style.display = 'none';
      card.querySelector('.add-btn').style.display = '';
    });
    cart.length = 0;
    updateCartUI();
  });

  // proceed order (simple simulation)
  proceedBtn.addEventListener('click', () => {
    if (cart.length === 0) { alert('Your cart is empty!'); return; }
    const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
    const confirmMsg = `Confirm order of ${cart.reduce((s, it) => s + it.qty, 0)} item(s)\nTotal: PKR ${total}\n\nClick OK to place order.`;
    if (confirm(confirmMsg)) {
      alert('Order placed successfully! We will contact you for pickup/delivery.');
      // clear
      document.querySelectorAll('.menu-card').forEach(card => {
        card.querySelector('.qty-controls').style.display = 'none';
        card.querySelector('.add-btn').style.display = '';
      });
      cart.length = 0;
      updateCartUI();
      cartModal.classList.remove('active');
    }
  });

});
