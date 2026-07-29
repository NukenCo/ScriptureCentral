(function () {
  'use strict';

  var SWIPE_DEADZONE = 6; // px mínimos de movimento antes de tratar como arrasto
  var VELOCITY_THRESHOLD = 0.35; // px/ms — separa um flick intencional de um arrasto lento
  var ELASTIC_RESISTANCE = 0.35; // fração do arrasto aplicada além do primeiro/último card

  function initCarousel(root) {
    var track = root.querySelector('.carousel__track');
    if (!track) return;
    var cards = Array.prototype.slice.call(track.children);
    if (!cards.length) return;

    var index = parseInt(root.getAttribute('data-start-index'), 10) || 0;
    index = Math.max(0, Math.min(index, cards.length - 1));

    var pointerId = null;
    var startX = 0;
    var startY = 0;
    var startTime = 0;
    var baseOffset = 0;
    var dragOffset = 0;
    var dragging = false;
    var moved = false;

    function step() {
      if (cards.length < 2) return cards[0].getBoundingClientRect().width;
      return cards[1].offsetLeft - cards[0].offsetLeft;
    }

    function offsetForIndex(i) {
      return -(i * step());
    }

    function applyTransform(x, withTransition) {
      track.style.transition = withTransition ? '' : 'none';
      track.style.transform = 'translateX(' + x + 'px)';
    }

    function goTo(i, withTransition) {
      index = Math.max(0, Math.min(i, cards.length - 1));
      applyTransform(offsetForIndex(index), withTransition !== false);
    }

    // Durante o arrasto, resiste (não trava) além do primeiro/último card —
    // mesma sensação de "elástico" do bottom sheet vertical que já existia
    // na página de leitura descartada.
    function resolveDragTransform() {
      var raw = baseOffset + dragOffset;
      var maxOffset = offsetForIndex(0);
      var minOffset = offsetForIndex(cards.length - 1);
      if (raw > maxOffset) {
        return maxOffset + (raw - maxOffset) * ELASTIC_RESISTANCE;
      }
      if (raw < minOffset) {
        return minOffset + (raw - minOffset) * ELASTIC_RESISTANCE;
      }
      return raw;
    }

    function onPointerDown(event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      startTime = performance.now();
      baseOffset = offsetForIndex(index);
      dragOffset = 0;
      dragging = true;
      moved = false;
    }

    function onPointerMove(event) {
      if (!dragging || event.pointerId !== pointerId) return;
      var dx = event.clientX - startX;
      var dy = event.clientY - startY;
      if (!moved) {
        if (Math.abs(dx) < SWIPE_DEADZONE && Math.abs(dy) < SWIPE_DEADZONE) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          // gesto predominantemente vertical: deixa o scroll da página rolar
          dragging = false;
          return;
        }
        moved = true;
        track.setPointerCapture(pointerId);
        track.classList.add('is-dragging');
      }
      event.preventDefault();
      dragOffset = dx;
      applyTransform(resolveDragTransform(), false);
    }

    function onPointerUp(event) {
      if (event.pointerId !== pointerId) return;
      dragging = false;
      track.classList.remove('is-dragging');
      if (!moved) return;

      var elapsed = performance.now() - startTime;
      var velocity = dragOffset / Math.max(elapsed, 1); // px/ms, o sinal preserva a direção
      var s = step();
      var target;

      if (velocity <= -VELOCITY_THRESHOLD) {
        target = index + 1; // flick pra esquerda: avança
      } else if (velocity >= VELOCITY_THRESHOLD) {
        target = index - 1; // flick pra direita: volta
      } else {
        // sem flick nítido: arredonda pro card mais próximo da posição alcançada
        target = index - Math.round(dragOffset / s);
      }
      goTo(target, true);
    }

    function onPointerCancel(event) {
      if (event.pointerId !== pointerId) return;
      dragging = false;
      moved = false;
      track.classList.remove('is-dragging');
      goTo(index, true);
    }

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointercancel', onPointerCancel);

    window.addEventListener('resize', function () {
      goTo(index, false);
    });

    // Posição inicial sem transição, pra não "saltar" visivelmente no load.
    goTo(index, false);
  }

  var carousels = document.querySelectorAll('.carousel');
  for (var i = 0; i < carousels.length; i++) {
    initCarousel(carousels[i]);
  }
})();
