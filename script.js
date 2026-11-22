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
