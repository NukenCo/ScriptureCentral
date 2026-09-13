(function () {
  'use strict';

  function initCarousel(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-cfm-slide]'));
    var devices = Array.prototype.slice.call(root.querySelectorAll('[data-cfm-device]'));
    var backBtn = root.querySelector('[data-cfm-back]');
    var nextBtn = root.querySelector('[data-cfm-next]');
    if (!slides.length || !backBtn || !nextBtn) return;

    var index = 0;

    function goTo(i) {
      index = Math.max(0, Math.min(i, slides.length - 1));
      slides.forEach(function (slide, n) {
        slide.classList.toggle('cfm-slide--active', n === index);
      });
      devices.forEach(function (device, n) {
        device.classList.toggle('cfm-device--active', n === index);
      });
      backBtn.disabled = index === 0;
      nextBtn.disabled = index === slides.length - 1;
    }

    backBtn.addEventListener('click', function () { goTo(index - 1); });
    nextBtn.addEventListener('click', function () { goTo(index + 1); });

    goTo(0);
  }

  var carousels = document.querySelectorAll('[data-cfm-carousel]');
  for (var i = 0; i < carousels.length; i++) {
    initCarousel(carousels[i]);
  }
})();
