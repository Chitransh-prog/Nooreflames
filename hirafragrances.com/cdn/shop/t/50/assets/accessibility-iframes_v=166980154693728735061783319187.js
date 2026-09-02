document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('iframe:not([title])').forEach(function (iframe) {
    iframe.setAttribute('title', 'Third-party content');
  });
});
