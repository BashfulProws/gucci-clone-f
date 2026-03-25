# GUCCI CLONE — CODEX PROMPT TEMPLATES
## Project Structure + AI Prompt Guide

---

## 📁 Project Structure

```
gucci-clone/
├── index.html          → Homepage (hero slider, categories, new arrivals, bestsellers, newsletter)
├── catalogue.html      → Product listing (filters, sort, grid, pagination)
├── product.html        → Product detail (gallery, sizes, add to bag, accordions, related)
├── css/
│   ├── styles.css      → ★ DESIGN SYSTEM (tokens, nav, footer, product card, cart drawer)
│   ├── index.css       → Homepage-specific styles
│   ├── catalogue.css   → Catalogue page-specific styles
│   └── product.css     → Product detail page-specific styles
└── js/
    └── main.js         → Shared logic (cart, wishlist, toast, search, scroll reveal)
```

---

## 🎨 Design System Reference

| Token          | Value                        | Use                   |
|----------------|------------------------------|-----------------------|
| `--black`      | `#000000`                    | Primary text/bg       |
| `--white`      | `#FFFFFF`                    | Background/text       |
| `--cream`      | `#F5F0EB`                    | Section backgrounds   |
| `--gold`       | `#B8963E`                    | Accents, labels       |
| `--gray-400`   | `#AAAAAA`                    | Secondary text        |
| `--gray-200`   | `#EEEEEE`                    | Borders               |
| `--font-display`| `'Cormorant Garamond'`       | Headlines, product names |
| `--font-ui`    | `'Montserrat'`               | Navigation, body copy |
| `--nav-height` | `56px`                       | Sticky nav height     |
| `--transition` | `0.28s ease`                 | Hover transitions     |

---

## 🤖 CODEX PROMPT TEMPLATES

Use these prompts with OpenAI Codex or ChatGPT to extend the project.

---

### PROMPT 1 — Add a New Page Section

```
You are building a luxury e-commerce website for Gucci using plain HTML, CSS, and JavaScript.

Design system:
- Fonts: 'Cormorant Garamond' (display/serif), 'Montserrat' (UI/body)
- Colors: --black (#000), --white (#FFF), --cream (#F5F0EB), --gold (#B8963E)
- CSS variables are in css/styles.css
- Buttons use class="btn btn-primary" (black fill) or "btn btn-secondary" (outline)
- All sections use class="reveal" on elements for scroll animation

Task: Add an [EDITORIAL LOOKBOOK / GIFT GUIDE / SUSTAINABILITY] section to index.html.
It should:
- Have a full-width image on one side and editorial text on the other
- Match the existing luxury aesthetic (generous white space, Cormorant Garamond headings)
- Include a CTA button linking to catalogue.html
- Use scroll reveal animation (class="reveal")
- Be placed between the [new-arrivals] and [bestsellers] sections

Output: HTML + CSS only (link the CSS inside <style> tags so I can paste it). No JavaScript needed.
```

---

### PROMPT 2 — Create a New Product Card Variant

```
You are building a luxury e-commerce website for Gucci.

The existing product card HTML looks like this:
<article class="product-card">
  <div class="product-card-image">
    <img class="img-primary" src="IMAGE_URL" alt="Product">
    <div class="img-hover"><img src="HOVER_IMG_URL" alt="hover"></div>
    <button class="product-card-quick" onclick="addToCart({id:'id',name:'Name',price:0,image:'',size:'One Size',color:'Black'})">Add to Bag</button>
  </div>
  <div class="product-card-info">
    <p class="product-card-brand">Gucci</p>
    <a href="product.html"><h3 class="product-card-name">Product Name</h3></a>
    <p class="product-card-price">€0,000</p>
  </div>
</article>

Task: Create a HORIZONTAL product card variant (image on left, text on right) for a "Featured Product" stripe section.
- Image: 40% width, 3:2 aspect ratio
- Text: 60% width with larger type
- Include product name, price, a short description, and an Add to Bag button
- Use the existing CSS variables and fonts
- Add hover: image zooms slightly, button slides up from bottom
- Output: HTML + CSS (no JS changes needed)
```

---

### PROMPT 3 — Build the Mobile Navigation Drawer

```
You are building a Gucci luxury e-commerce clone with plain HTML, CSS, and JS.

The desktop nav in site-header already exists. On mobile (max-width: 768px), the .nav-links are hidden.

Task: Build a mobile hamburger menu drawer that:
1. Shows a hamburger button (☰) in the nav on mobile, replacing the hidden nav links
2. On click: opens a full-height slide-in drawer from the left side (width: 100vw or 320px)
3. Drawer contains: GUCCI logo, nav links (Women, Men, Gifts, Beauty) with accordion sub-menus, Account and Wishlist links, and a close (×) button
4. Overlay: semi-transparent black backdrop behind the drawer; clicking it closes the drawer
5. Animation: smooth 0.4s slide in from left
6. CSS variables: same as main design system (--black, --white, --font-display, --font-ui)
7. Output: HTML snippet to add to site-header + CSS block + JavaScript (vanilla, no libraries)
```

---

### PROMPT 4 — Add a Size Guide Modal

```
You are working on a Gucci luxury e-commerce site. The product page (product.html) has a "Size Guide" button with class="size-guide-link".

Task: When "Size Guide" is clicked, show a modal overlay that contains:
- A tab system: "Bags" | "Shoes" | "Clothing"
- For each tab: a responsive HTML table with size measurements (EU, UK, US, IT columns for shoes; letter sizing + measurements for clothing)
- A close (×) button top-right and click-outside-to-close behaviour
- Design: matches luxury style (Cormorant Garamond for headings, Montserrat for table text, black/white/cream palette)
- Smooth fade-in animation

Output: Vanilla JS + CSS + HTML for the modal. Attach the event listener to document.querySelector('.size-guide-link').
```

---

### PROMPT 5 — Implement a Working Search Page

```
You are building a Gucci luxury e-commerce clone.

There is a search overlay (div.search-overlay) that opens when the search icon is clicked.
The product data is this array:
[
  {id:'prod-001', name:'Horsebit 1955 Small Bag', price:2800, category:'bags', image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'},
  {id:'prod-002', name:'Princetown Leather Slipper', price:890, category:'shoes', image:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'},
  {id:'prod-003', name:'GG Wool Intarsia Coat', price:4200, category:'ready-to-wear', image:'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400'},
  {id:'prod-004', name:'GG Marmont Thin Belt', price:390, category:'accessories', image:'https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=400'},
  {id:'prod-005', name:'Dionysus Small GG Bag', price:2300, category:'bags', image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'}
]

Task: Add live search functionality to the search overlay:
- As the user types in .search-input, filter the product array in real time
- Show matching results as cards below the search bar (image, name, price, link to product.html)
- Highlight matching text in the results
- Show "No results found" for empty matches
- Show "Trending Searches" chips when the input is empty (Horsebit Bag, GG Marmont, Loafers, Belts)
- Keyboard: ArrowUp/Down to navigate results, Enter to select, Esc to close
- Output: Vanilla JS + minimal CSS to add to search overlay
```

---

### PROMPT 6 — Create a Checkout Page

```
You are building a Gucci luxury e-commerce site using plain HTML, CSS, and JS.

Design system: Cormorant Garamond for display, Montserrat for body, colors: --black #000, --white #FFF, --cream #F5F0EB, --gold #B8963E.

Task: Create a full checkout.html page with:
1. A 3-step progress indicator: (1) Shipping → (2) Payment → (3) Confirmation
2. Step 1 – Shipping form: Full name, Email, Phone, Address Line 1 & 2, City, Postal Code, Country (select)
3. Step 2 – Payment form: Card number (formatted with spaces every 4 digits), Name on card, Expiry (MM/YY), CVV (masked)
4. Step 3 – Confirmation: Order number (random 8-digit), thank you message, estimated delivery, a link back to index.html
5. Right sidebar: shows cart items from localStorage (key: 'gucciCart'), subtotal, shipping (Free), total
6. "Continue" button validates each step before advancing
7. Style must match existing site: sticky header (GUCCI logo centered, nav icons), footer optional

Output: Full checkout.html file (self-contained, links to css/styles.css and js/main.js).
```

---

## 📝 HOW TO USE WITH CODEX

1. **Set the context**: Always paste the relevant design system tokens at the top of your prompt.
2. **Be specific about output format**: "Output: HTML + CSS only" or "Output: JS function only".
3. **Reference existing class names**: Codex works best when you anchor it to code it can see.
4. **Iterate**: After Codex generates, ask it to "refine the typography", "add hover animations", or "make it responsive for mobile".
5. **For complex features**: Break them into sub-prompts (e.g., HTML structure first, then CSS, then JS).

---

## 🚀 NEXT STEPS TO COMPLETE THE PROJECT

- [ ] `checkout.html` — Full checkout flow (use Prompt 6)
- [ ] `wishlist.html` — Wishlist page (iterate from catalogue.html)
- [ ] Mobile nav drawer (use Prompt 3)
- [ ] Size guide modal on product.html (use Prompt 4)
- [ ] Live search (use Prompt 5)
- [ ] Add more products to catalogue (duplicate card HTML, change data attributes)
- [ ] Connect a real backend (Node.js / Supabase) for auth + orders
- [ ] Swap placeholder Unsplash images with actual Gucci-style photography
