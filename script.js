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

const guitarPartPositions = {
  head: { name: 'Hlava', x: 50, y: 9 },
  tuning: { name: 'Ladiace mechaniky', x: 38, y: 13 },
  neck: { name: 'Krk', x: 50, y: 32 },
  fretboard: { name: 'Hmatník', x: 54, y: 39 },
  fret: { name: 'Pražce', x: 46, y: 43 },
  strings: { name: 'Struny', x: 50, y: 56 },
  body: { name: 'Telo', x: 50, y: 69 },
  pickups: { name: 'Snímače', x: 46, y: 64 },
  nut: { name: 'Kobylka', x: 58, y: 72 },
  controls: { name: 'Ovládacie panely', x: 62, y: 78 },
  switch: { name: 'Prepínač', x: 38, y: 75 },
  jack: { name: 'Konektor (Jack)', x: 68, y: 84 }
};

const guitarPartDetails = {
  head: 'Horná časť gitary, na ktorej sú upevnené ladiace mechaniky. Často nesie logo značky.',
  tuning: 'Otočné kolíky na hlave, ktorými sa napína a ladí každá struna.',
  neck: 'Dlhá drevená časť, na ktorej sú hmatník a pražce. Jeho tvar ovplyvňuje pohodlie hry.',
  fretboard: 'Doska na krku, na ktorú hráč pritláča struny. Býva z palisandra, javora alebo ebenu.',
  fret: 'Kovové pásiky na hmatníku, ktoré určujú výšku jednotlivých tónov.',
  strings: 'Kovové struny, ktorých kmitanie vytvára zvuk. Hrúbka a materiál ovplyvňujú tón.',
  body: 'Hlavná časť gitary, v ktorej sú uložené snímače a elektronika. Ovplyvňuje vzhľad aj charakter zvuku.',
  pickups: 'Magnetické snímače, ktoré menia kmitanie strún na elektrický signál. Najčastejšie jednocievkové alebo humbuckery.',
  nut: 'Časť na tele, ktorá drží struny a prenáša ich kmity. Niektoré kobylky obsahujú tremolo.',
  controls: 'Potenciometre hlasitosti a tónu, ktorými hráč upravuje zvuk priamo na gitare.',
  switch: 'Prepína medzi snímačmi alebo ich kombináciami, čím mení farbu tónu.',
  jack: 'Zdierka na tele, do ktorej sa zapája kábel k zosilňovaču.'
};

const detail = document.querySelector('#part-detail');
const originalDetailText = 'Vyberte časť gitary pre zobrazenie jej funkcie.';
let activePart = null;

function renderPartDetail(part) {
  if (!detail) return;
  detail.classList.remove('is-changing');
  void detail.offsetWidth;

  if (!part) {
    detail.textContent = originalDetailText;
  } else {
    detail.replaceChildren();
    const title = document.createElement('strong');
    title.textContent = guitarPartPositions[part].name;
    const description = document.createElement('span');
    description.textContent = guitarPartDetails[part];
    detail.append(title, description);
  }
  detail.classList.add('is-changing');
}

function selectPart(part) {
  if (!guitarPartDetails[part]) return;
  const nextPart = activePart === part ? null : part;
  activePart = nextPart;

  document.querySelectorAll('.component-button, .hotspot').forEach((item) => {
    const isActive = item.dataset.part === nextPart;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-pressed', String(isActive));
  });
  renderPartDetail(nextPart);
}

document.querySelectorAll('.hotspot').forEach((hotspot) => {
  const part = guitarPartPositions[hotspot.dataset.part];
  if (!part) return;
  hotspot.style.left = `${part.x}%`;
  hotspot.style.top = `${part.y}%`;
  hotspot.addEventListener('click', () => selectPart(hotspot.dataset.part));
});

document.querySelectorAll('.component-button').forEach((button) => {
  button.addEventListener('click', () => selectPart(button.dataset.part));
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

const guitarGalleries = {
  Stratocaster: [
    { src: 'img/strat1.webp', description: 'Stratocaster – fotografia 1', fit: 'cover', position: 'center' },
    { src: 'img/strat2.webp', description: 'Stratocaster – fotografia 2' },
    { src: 'img/strat3.avif', description: 'Stratocaster – fotografia 3' },
    { src: 'img/strat4.jpg', description: 'Stratocaster – fotografia 4' },
    { src: 'img/strat5.jpg', description: 'Stratocaster – fotografia 5', position: 'center' }
  ],
  Telecaster: [
    { src: 'img/tele1.jpg', description: 'Telecaster – fotografia 1', fit: 'cover', position: 'center' },
    { src: 'img/tele2.jpg', description: 'Telecaster – fotografia 2', fit: 'cover', position: 'center' },
    { src: 'img/tele3.jpg', description: 'Telecaster – fotografia 3' },
    { src: 'img/tele4.webp', description: 'Telecaster – fotografia 4' },
    { src: 'img/tele5.jpg', description: 'Telecaster – fotografia 5' }
  ],
  'Les Paul': [
    { src: 'img/lp1.webp', description: 'Les Paul – fotografia 1', fit: 'cover', position: 'center' },
    { src: 'img/lp2.jpg', description: 'Les Paul – fotografia 2' },
    { src: 'img/lp3.webp', description: 'Les Paul – fotografia 3' },
    { src: 'img/lp4.webp', description: 'Les Paul – fotografia 4', fit: 'cover', position: 'center' },
    { src: 'img/lp5.jpg', description: 'Les Paul – fotografia 5' }
  ],
  SG: [
    { src: 'img/sg1.jpg', description: 'SG – fotografia 1' },
    { src: 'img/sg2.jpg', description: 'SG – fotografia 2' },
    { src: 'img/sg3.webp', description: 'SG – fotografia 3' },
    { src: 'img/sg4.jpg', description: 'SG – fotografia 4' },
    { src: 'img/sg5.jpg', description: 'SG – fotografia 5' }
  ]
};

const guitarModal = document.querySelector('#guitar-modal');
const guitarModalDialog = guitarModal?.querySelector('.guitar-modal__dialog');
const guitarModalTitle = guitarModal?.querySelector('#guitar-modal-title');
const guitarModalMain = guitarModal?.querySelector('.guitar-modal__main');
const guitarModalPosition = guitarModal?.querySelector('.guitar-modal__position');
const guitarModalThumbnails = guitarModal?.querySelector('.guitar-modal__thumbnails');
const guitarModalPrev = guitarModal?.querySelector('.guitar-modal__arrow--prev');
const guitarModalNext = guitarModal?.querySelector('.guitar-modal__arrow--next');
let currentGallery = [];
let currentIndex = 0;
let modalTrigger = null;
let closeTimer = null;

function createPlaceholder(description) {
  const placeholder = document.createElement('div');
  placeholder.className = 'guitar-modal__placeholder';
  placeholder.setAttribute('role', 'img');
  placeholder.setAttribute('aria-label', description);
  placeholder.textContent = description;
  return placeholder;
}

function createGalleryMedia(item, description, isThumbnail = false) {
  if (!item?.src) return createPlaceholder(description);

  const image = document.createElement('img');
  image.src = item.src;
  image.alt = item.description || description;
  image.style.setProperty('--gallery-fit', item.fit || (isThumbnail ? 'cover' : 'contain'));
  image.style.setProperty('--gallery-position', item.position || 'center');
  image.addEventListener('error', () => {
    image.replaceWith(createPlaceholder(item.description || description));
  }, { once: true });
  return image;
}

function showGalleryImage(index) {
  if (!currentGallery.length) return;
  currentIndex = (index + currentGallery.length) % currentGallery.length;
  const item = currentGallery[currentIndex];
  const description = item.description || `${guitarModalTitle?.textContent} – fotografia ${currentIndex + 1}`;

  if (guitarModalMain) {
    guitarModalMain.replaceChildren(createGalleryMedia(item, description));
  }
  if (guitarModalPosition) {
    guitarModalPosition.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
  }

  guitarModalThumbnails?.querySelectorAll('.guitar-modal__thumbnail').forEach((thumbnail, thumbnailIndex) => {
    const isActive = thumbnailIndex === currentIndex;
    thumbnail.classList.toggle('is-active', isActive);
    thumbnail.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

function renderGallery(guitarName) {
  const gallery = guitarGalleries[guitarName];
  currentGallery = Array.isArray(gallery) && gallery.length
    ? gallery
    : Array.from({ length: 5 }, (_, index) => ({
        src: '',
        description: `${guitarName} – fotografia ${index + 1}`
      }));
  currentIndex = 0;

  if (guitarModalTitle) guitarModalTitle.textContent = guitarName;
  if (guitarModalThumbnails) {
    guitarModalThumbnails.replaceChildren();
    currentGallery.forEach((item, index) => {
      const description = item.description || `${guitarName} – fotografia ${index + 1}`;
      const thumbnail = document.createElement('button');
      thumbnail.type = 'button';
      thumbnail.className = 'guitar-modal__thumbnail';
      thumbnail.setAttribute('aria-label', `Zobraziť ${description}`);
      thumbnail.append(createGalleryMedia(item, description, true));
      thumbnail.addEventListener('click', () => showGalleryImage(index));
      guitarModalThumbnails.append(thumbnail);
    });
  }
  showGalleryImage(0);
}

function openGuitarModal(guitarName, trigger) {
  if (!guitarModal) return;
  modalTrigger = trigger;
  renderGallery(guitarName);
  guitarModal.hidden = false;
  document.body.classList.add('modal-open');
  window.clearTimeout(closeTimer);
  window.requestAnimationFrame(() => {
    guitarModal.classList.add('is-open');
    guitarModalDialog?.focus();
  });
}

function closeGuitarModal() {
  if (!guitarModal || guitarModal.hidden) return;
  guitarModal.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  closeTimer = window.setTimeout(() => {
    guitarModal.hidden = true;
    modalTrigger?.focus();
  }, 180);
}

document.querySelectorAll('[data-guitar]').forEach((button) => {
  button.addEventListener('click', () => {
    openGuitarModal(button.dataset.guitar, button);
  });
});

guitarModal?.querySelectorAll('[data-modal-close]').forEach((element) => {
  element.addEventListener('click', closeGuitarModal);
});

guitarModalPrev?.addEventListener('click', () => showGalleryImage(currentIndex - 1));
guitarModalNext?.addEventListener('click', () => showGalleryImage(currentIndex + 1));

document.addEventListener('keydown', (event) => {
  if (!guitarModal || guitarModal.hidden) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeGuitarModal();
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    showGalleryImage(currentIndex - 1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    showGalleryImage(currentIndex + 1);
  } else if (event.key === 'Tab' && guitarModalDialog) {
    const focusable = Array.from(guitarModalDialog.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
    if (!focusable.length) {
      event.preventDefault();
      guitarModalDialog.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === guitarModalDialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
