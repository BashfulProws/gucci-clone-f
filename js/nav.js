/* ================================================
   SHARED NAVIGATION — Flat list, no subcategories
   Identical on every page
   ================================================ */

(function() {
  const navHTML = `
    <div class="mobile-nav-overlay"></div>
    <div class="mobile-nav-drawer">
      <div class="mobile-nav-header">
        <button class="mobile-nav-close" aria-label="Close menu">&times;</button>
      </div>
      <div class="mobile-nav-links">
        <div class="mobile-nav-link-item"><a href="handbag.html">Handbags</a></div>
        <div class="mobile-nav-link-item"><a href="women.html">Women</a></div>
        <div class="mobile-nav-link-item"><a href="men.html">Men</a></div>
        <div class="mobile-nav-link-item"><a href="children.html">Children</a></div>
        <div class="mobile-nav-link-item"><a href="travel.html">Travel</a></div>
        <div class="mobile-nav-link-item"><a href="jewelry.html">Jewelry &amp; Watches</a></div>
        <div class="mobile-nav-link-item"><a href="decor.html">D&eacute;cor &amp; Lifestyle</a></div>
        <div class="mobile-nav-link-item"><a href="beauty.html">Fragrances &amp; Make-Up</a></div>
        <div class="mobile-nav-link-item"><a href="gifts.html">Gifts</a></div>
      </div>
      <div class="mobile-nav-extras">
        <a href="#">Gucci Services</a>
        <a href="about.html">World of Gucci</a>
        <a href="stores.html">Store Locator</a>
      </div>
      <div class="mobile-nav-bottom">
        <a href="contact.html" class="mobile-nav-bottom-link">Contact Us</a>
      </div>
    </div>
  `;

  function injectNav() {
    document.querySelectorAll('.mobile-nav-overlay, .mobile-nav-drawer').forEach(el => el.remove());
    const header = document.querySelector('.site-header');
    if (header) {
      header.insertAdjacentHTML('beforeend', navHTML);
    } else {
      document.body.insertAdjacentHTML('beforeend', navHTML);
    }
    initNav();
  }

  function initNav() {
    const overlay = document.querySelector('.mobile-nav-overlay');
    const drawer = document.querySelector('.mobile-nav-drawer');
    if (!overlay || !drawer) return;

    document.querySelector('[data-action="open-mobile-nav"]')?.addEventListener('click', () => {
      overlay.classList.add('open');
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    function closeNav() {
      overlay.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelector('.mobile-nav-close')?.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeNav();
    });
  }

  const footerHTML = `
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h5>Shop</h5>
          <ul>
            <li><a href="handbag.html">Handbags</a></li>
            <li><a href="women.html">Women</a></li>
            <li><a href="men.html">Men</a></li>
            <li><a href="jewelry.html">Jewelry &amp; Watches</a></li>
            <li><a href="beauty.html">Fragrances &amp; Make-Up</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Explore</h5>
          <ul>
            <li><a href="children.html">Children</a></li>
            <li><a href="travel.html">Travel</a></li>
            <li><a href="decor.html">D&eacute;cor &amp; Lifestyle</a></li>
            <li><a href="gifts.html">Gifts</a></li>
            <li><a href="about.html">About Gucci</a></li>
            <li><a href="contact.html">Contact Us</a></li>
            <li><a href="stores.html">Store Locator</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Store Locator</h5>
          <div class="footer-store-locator">
            <input type="text" placeholder="Country/Region, City" readonly onclick="window.location='stores.html'">
          </div>
          <div class="footer-email-signup" style="margin-top:32px">
            <h5>Sign Up for Gucci Updates</h5>
            <p>By entering your email address below, you consent to receiving our newsletter with access to our latest collections, events and initiatives.</p>
            <input type="email" placeholder="Email">
          </div>
          <div class="footer-country">
            <h5>Country/Region</h5>
            <a href="stores.html">India</a>
          </div>
        </div>
      </div>
      <div class="footer-services">
        <h5>Gucci Services</h5>
        <div class="footer-services-links">
          <a href="about.html">Discover Our Services</a>
          <a href="stores.html">Book an Appointment</a>
          <a href="stores.html">Collect in Store</a>
        </div>
      </div>
      <div class="footer-copyright">
        <p>&copy; 2016 - 2025 Guccio Gucci S.p.A. - All rights reserved.</p>
      </div>
      <div class="footer-wordmark">
        <span>G</span><span>U</span><span>C</span><span>C</span><span>I</span>
      </div>
    </div>
  </footer>`;

  function injectFooter() {
    const existingFooter = document.querySelector('footer');
    if (existingFooter) {
      existingFooter.outerHTML = footerHTML;
    }
  }

  function init() {
    injectNav();
    injectFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
