document.addEventListener('DOMContentLoaded', function () {
  // Basic page enhancement for GitHub Pages deployment
  document.querySelectorAll('a[href="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.forEach(function (item) {
        item.classList.remove('active');
      });
      link.classList.add('active');
    });
  });
});
