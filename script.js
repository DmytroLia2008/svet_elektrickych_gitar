const searchForm = document.querySelector('.search');
const searchInput = searchForm?.querySelector('input');

searchForm?.addEventListener('submit', (event) => {
  event.preventDefault();
});

searchInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    searchInput.value = '';
    searchInput.blur();
  }
});

document.querySelectorAll('.side-link').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.side-link').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});

const homePage = document.querySelector('#home-page');
const encyclopediaPage = document.querySelector('#encyclopedia-page');
const manufacturersPage = document.querySelector('#manufacturers-page');

function closeSidebarMenus() {
  document.querySelectorAll('.side-main-link').forEach((button) => {
    const submenu = document.querySelector(`[data-submenu="${button.dataset.section}"]`);
    submenu?.setAttribute('hidden', '');
    button.setAttribute('aria-expanded', 'false');
  });
}

function renderRoute() {
  const isParts = window.location.hash === '#casti';
  const isEncyclopedia = window.location.hash === '#encyklopedia' || isParts;
  const isManufacturers = window.location.hash === '#vyrobcovia';
  const isBeginners = window.location.hash === '#zaciatocnici';
  const isFindGuitar = isManufacturers || isBeginners;
  document.body.classList.toggle('encyclopedia-mode', isEncyclopedia);
  document.body.classList.toggle('manufacturers-mode', isFindGuitar);
  document.body.classList.toggle('beginners-mode', isBeginners);
  encyclopediaPage?.toggleAttribute('hidden', !isEncyclopedia);
  manufacturersPage?.toggleAttribute('hidden', !isFindGuitar);
  homePage?.toggleAttribute('hidden', isEncyclopedia || isParts || isFindGuitar);

  document.querySelectorAll('.side-link').forEach((link) => {
    let route = '#';
    if (isParts) route = '#casti';
    else if (isEncyclopedia) route = '#encyklopedia';
    else if (isFindGuitar) route = isBeginners ? '#zaciatocnici' : '#vyrobcovia';
    else if (isBeginners) route = '#zaciatocnici';
    link.classList.toggle('active', link.getAttribute('href') === route);
  });

  document.querySelectorAll('.side-sub-link').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === window.location.hash);
  });

  if (isEncyclopedia || isParts || isFindGuitar) {
    if (isParts) {
      window.requestAnimationFrame(() => {
        document.querySelector('#encyclopedia-parts')?.scrollIntoView({ block: 'start' });
      });
    } else if (isBeginners) {
      window.requestAnimationFrame(() => {
        document.querySelector('#beginners-section')?.scrollIntoView({ block: 'start' });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }
}

window.addEventListener('hashchange', renderRoute);
renderRoute();

document.querySelectorAll('.side-main-link').forEach((button) => {
  button.addEventListener('click', () => {
    const section = button.dataset.section;
    const submenu = document.querySelector(`[data-submenu="${section}"]`);
    const isOpen = submenu && !submenu.hasAttribute('hidden');

    closeSidebarMenus();
    if (!isOpen) {
      submenu?.removeAttribute('hidden');
      button.setAttribute('aria-expanded', 'true');
    }

    if (!isOpen && section === 'encyclopedia' && window.location.hash !== '#encyklopedia') {
      window.location.hash = '#encyklopedia';
    }
    if (!isOpen && section === 'finder' && window.location.hash !== '#vyrobcovia') {
      window.location.hash = '#vyrobcovia';
    }
  });
});

document.querySelectorAll('.side-sub-link').forEach((link) => {
  link.addEventListener('click', closeSidebarMenus);
});

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  if (event.target.closest('.side-main-link')) return;

  const openMenu = document.querySelector('.sidebar-submenu:not([hidden])');
  if (openMenu && !openMenu.contains(event.target)) {
    closeSidebarMenus();
  }
});

const partDetails = {
  head: 'Hlava nesie ladiace mechaniky a drží struny v správnom postavení.',
  tuning: 'Ladiace mechaniky umožňujú doladenie každej struny na požadovaný tón.',
  neck: 'Krk podpiera hmatník a ovplyvňuje pohodlie hry aj stabilitu strún.',
  fretboard: 'Hmatník je miesto, kde prsty skracujú struny a vytvárajú tóny.',
  fret: 'Pražce rozdeľujú hmatník a určujú vzdialenosti jednotlivých tónov.',
  strings: 'Struny menia napätie a kmitajú, čím vytvárajú zvuk gitary.',
  body: 'Telo nesie elektro-mechanické komponenty a ovplyvňuje rezonanciu nástroja.',
  pickups: 'Snímače premieňajú kmitanie strún na elektrický signál.',
  nut: 'Kobylka na hmatníku vedie struny a nastavuje ich vzdialenosti.',
  bridge: 'Mostík prenáša vibrácie strún na telo a drží ich na správnej výške.',
  controls: 'Ovládacie panely menia hlasitosť a farebnosť zosilneného zvuku.',
  switch: 'Prepínač mení výber snímačov a charakter gitarového zvuku.',
  jack: 'Konektor Jack odvádza elektrický signál k kombinácii alebo zosilňovaču.'
};

const detail = document.querySelector('#part-detail');

function selectPart(part) {
  if (!partDetails[part]) return;
  document.querySelectorAll('.component-button, .hotspot').forEach((item) => {
    item.classList.toggle('active', item.dataset.part === part);
  });
  if (detail) detail.textContent = partDetails[part];
}

document.querySelectorAll('.component-button, .hotspot').forEach((item) => {
  item.addEventListener('click', () => selectPart(item.dataset.part));
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectPart(item.dataset.part);
    }
  });
});

const priceTabs = document.querySelectorAll('.price-tab');
const beginnerCards = Array.from(document.querySelectorAll('.beginner-card'));
let ascending = true;

priceTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    priceTabs.forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');

    beginnerCards.forEach((card) => {
      const price = Number(card.dataset.price);
      const filter = tab.dataset.filter;
      const visible =
        filter === 'all' ||
        (filter === 'under150' && price < 150) ||
        (filter === '150-250' && price >= 150 && price <= 250) ||
        (filter === 'over250' && price > 250);
      card.toggleAttribute('hidden', !visible);
    });
  });
});

document.querySelector('#sort-price')?.addEventListener('click', () => {
  const grid = document.querySelector('#beginner-grid');
  const sortButton = document.querySelector('#sort-price');
  if (!grid || !sortButton) return;
  ascending = !ascending;
  sortButton.innerHTML = ascending
    ? '<span aria-hidden="true">↕</span>Cena: od najnižšej'
    : '<span aria-hidden="true">↕</span>Cena: od najvyššej';
  sortButton.setAttribute('aria-pressed', String(!ascending));
  beginnerCards
    .sort((a, b) => ascending
      ? Number(a.dataset.price) - Number(b.dataset.price)
      : Number(b.dataset.price) - Number(a.dataset.price))
    .forEach((card) => grid.appendChild(card));
});
