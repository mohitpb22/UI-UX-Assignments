/* Assignment 2 (Enhanced): Attributes, Control Flow, Functions, Loops */

// ---- NAV HIGHLIGHT + SCROLL BEHAVIOR (CSS via JS) ----
(function navHighlight(){
  const links = document.querySelectorAll('.site-nav a[href]');
  const here = window.location.hash || 'index.html';
  links.forEach(a => {
    a.classList.remove('active');
    // Active if href equals current path or is in-view section
    if ((a.getAttribute('href') === 'index.html' && !window.location.hash) ||
        (a.getAttribute('href') === here) ||
        (a.getAttribute('href').startsWith('#') && a.getAttribute('href') === here)) {
      a.classList.add('active');
    }
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if (href.startsWith('#')){
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({behavior:'smooth'});
        history.replaceState(null, '', href);
        links.forEach(x=>x.classList.remove('active'));
        a.classList.add('active');
      }
    });
  });
})();

// ---- DATA: PACKAGES (arrays/objects) ----
const packages = [
  { id: 101, destination: 'Goa',    durationDays: 4, basePrice: 18000, season: 'Peak',     startsOn: 'Fri' },
  { id: 102, destination: 'Manali', durationDays: 5, basePrice: 22000, season: 'Shoulder', startsOn: 'Mon' },
  { id: 103, destination: 'Jaipur', durationDays: 3, basePrice: 15000, season: 'Off',      startsOn: 'Sat' },
  { id: 104, destination: 'Kerala', durationDays: 6, basePrice: 28000, season: 'Peak',     startsOn: 'Wed' },
  { id: 105, destination: 'Andaman',durationDays: 5, basePrice: 42000, season: 'Peak',     startsOn: 'Sat' }
];

// ---- PRICING HELPERS (functions + operators + control flow) ----
function seasonalMultiplier(season){
  // switch/case required by spec
  switch(season){
    case 'Peak': return 1.25;
    case 'Shoulder': return 1.10;
    case 'Off': return 0.9;
    default: return 1.0;
  }
}
function weekendSurcharge(startsOn){
  // 10% if starts Fri/Sat
  return (startsOn === 'Fri' || startsOn === 'Sat') ? 1.10 : 1.0;
}
function finalPackagePrice(pkg){
  // use operators (multiply and rounding)
  const price = pkg.basePrice * seasonalMultiplier(pkg.season) * weekendSurcharge(pkg.startsOn);
  return Math.round(price);
}

// ---- RENDER PACKAGES TABLE (loops + DOM) ----
(function renderPackages(){
  const tbody = document.querySelector('#packagesTable tbody');
  const frag = document.createDocumentFragment();
  packages.forEach(pkg => {
    const tr = document.createElement('tr');
    const finalPrice = finalPackagePrice(pkg);
    tr.innerHTML = `
      <td>${pkg.id}</td>
      <td>${pkg.destination}</td>
      <td>${pkg.durationDays}</td>
      <td>${pkg.basePrice.toLocaleString('en-IN')}</td>
      <td>${pkg.season}</td>
      <td>${pkg.startsOn}</td>
      <td><strong>${finalPrice.toLocaleString('en-IN')}</strong></td>
    `;
    frag.appendChild(tr);
  });
  tbody.appendChild(frag);
})();

// ---- BOOKING ESTIMATOR (form + control flow) ----
(function bookingEstimator(){
  const sel = document.getElementById('packageSelect');
  const nightsEl = document.getElementById('nights');
  const totalEl = document.getElementById('total');
  const form = document.getElementById('estimateForm');
  const btn = document.getElementById('submitBtn');
  const msg = document.getElementById('formMsg');

  // Populate package select (loop)
  packages.forEach(pkg => {
    const opt = document.createElement('option');
    opt.value = pkg.id;
    opt.textContent = `#${pkg.id} — ${pkg.destination} (${pkg.durationDays}d)`;
    sel.appendChild(opt);
  });

  function parseDate(val){
    const d = new Date(val);
    return isNaN(d) ? null : d;
  }

  function promoDiscount(code){
    switch((code || '').trim().toUpperCase()){
      case 'EARLYBIRD': return 0.10; // 10%
      case 'FEST20': return 0.20;    // 20%
      default: return 0;
    }
  }

  // Calculate and update UI
  function recalc(){
    const pkgId = parseInt(sel.value);
    const pkg = packages.find(p => p.id === pkgId);
    const guests = parseInt(document.getElementById('guests').value);
    const cin = parseDate(document.getElementById('checkIn').value);
    const cout = parseDate(document.getElementById('checkOut').value);
    const promo = document.getElementById('promo').value;

    // Basic validation flags
    const validGuests = Number.isInteger(guests) && guests >= 1 && guests <= 10;
    const validDates = !!cin && !!cout && cout > cin;
    const validPkg = !!pkg;

    // Nights (date math)
    let nights = 0;
    if (validDates){
      const ms = cout - cin;
      nights = Math.round(ms / (1000*60*60*24));
    }
    nightsEl.textContent = nights;

    // Base nightly price derived from final package price / duration
    let total = 0;
    if (validPkg && nights > 0){
      const base = finalPackagePrice(pkg);
      const nightly = base / Math.max(pkg.durationDays, 1);
      total = nightly * nights;

      // Guests multiplier (+20% if > 2)
      if (guests > 2){
        total *= 1.20;
      }

      // Promo discount
      const disc = promoDiscount(promo);
      total *= (1 - disc);
    }

    // Round and display
    totalEl.textContent = Math.round(total).toLocaleString('en-IN');

    // Enable/disable submit
    const formOk = validGuests && validDates && validPkg && nights > 0;
    btn.disabled = !formOk;
    formOk
      ? msg.textContent = "All set — click Book Now to proceed."
      : msg.textContent = "Fill all fields correctly (guests 1–10, valid dates, package).";
  }

  // Init defaults
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);
  document.getElementById('checkIn').valueAsDate = today;
  document.getElementById('checkOut').valueAsDate = tomorrow;
  sel.value = packages[0].id;

  // Listen for changes
  form.addEventListener('input', recalc);
  form.addEventListener('change', recalc);
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (!btn.disabled){
      alert('Booking request submitted! (Demo)');
    }
  });

  recalc();
})();

// ---- GALLERY MODAL (attribute-driven + CSS via JS) ----
(function galleryModal(){
  const grid = document.getElementById('thumbGrid');
  const modal = document.getElementById('modal');
  const img = document.getElementById('modalImg');
  const title = document.getElementById('modalTitle');
  const dest = document.getElementById('modalDest');
  const closeBtn = document.getElementById('modalClose');
  const toggleBtn = document.getElementById('toggleLayoutBtn');

  // Read thumbnails' data-* attributes
  grid.querySelectorAll('.thumb').forEach(link => {
    link.addEventListener('click', (e)=>{
      e.preventDefault();
      const large = link.getAttribute('data-large');
      const imgAlt = link.querySelector('img').getAttribute('alt');
      const imgTitle = link.getAttribute('data-title') || imgAlt;
      const destination = link.getAttribute('data-destination') || '—';

      // Modify attributes on modal elements
      img.setAttribute('src', large);
      img.setAttribute('alt', imgAlt);
      img.setAttribute('title', imgTitle);
      title.textContent = imgTitle;
      dest.textContent = destination;

      // Show modal (CSS via JS by toggling aria-hidden)
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal(){
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // clear src for performance
    img.removeAttribute('src');
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false'){
      closeModal();
    }
  });

  // Layout toggle (style updates via JS using attributes)
  toggleBtn.addEventListener('click', ()=>{
    const current = grid.getAttribute('data-layout');
    const next = current === 'fit' ? 'masonry' : 'fit';
    grid.setAttribute('data-layout', next);
    // Example of inline style tweak for "masonry" effect
    grid.style.gridAutoRows = (next === 'masonry') ? '10px' : '1fr';
  });
})();
