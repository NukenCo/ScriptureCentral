(function () {
  'use strict';

  var FADE_MS = 500; // combina com a transição de width/height/opacity do CSS

  // Legendas sincronizadas com as fotos (mesma ordem: Charlotte, Marco,
  // Kyler, Katy, Alex). Extraído dos 5 estados de texto do componente no
  // Figma (node 3601:33561) — os states 4 e 5 vieram com o mesmo corpo de
  // texto no arquivo original (aparentam ser placeholder ainda não
  // finalizado pelo design).
  var CAPTIONS = [
    {
      title: 'For everyone who<br>means to read more',
      body: 'Scripture Central brings the scriptures to life. ScripturePlus helps carry them into your mind and heart.',
    },
    {
      title: 'Ten minutes is enough',
      body: 'A single chapter in the morning, or the day’s reading on the way to work. Listen when your hands are busy. Nothing here asks for more time than you have.',
    },
    {
      title: 'You are not reading alone',
      body: 'Come, Follow Me puts the whole Church on the same chapters in the same week. What you read this morning is what your ward will talk about on Sunday.',
    },
    {
      title: 'Coming back is easy',
      body: 'Your place is where you left it, and so are your notes. Nothing on this screen counts the days you missed.',
    },
    {
      title: 'Coming back is easy',
      body: 'Your place is where you left it, and so are your notes. Nothing on this screen counts the days you missed.',
    },
  ];

  function initCarousel(root) {
    var track = root.querySelector('[data-photo-track]');
    var nextBtn = root.querySelector('[data-photo-next]');
    if (!track || !nextBtn) return;

    var caption = document.querySelector('[data-photo-caption]');
    var titleEl = caption && caption.querySelector('[data-caption-title]');
    var bodyEl = caption && caption.querySelector('[data-caption-body]');
    var index = 0;
    var animating = false;

    function updateCaption() {
      if (!titleEl || !bodyEl) return;
      caption.classList.add('is-fading');
      window.setTimeout(function () {
        var c = CAPTIONS[index % CAPTIONS.length];
        titleEl.innerHTML = c.title;
        bodyEl.textContent = c.body;
        caption.classList.remove('is-fading');
      }, FADE_MS * 0.3);
    }

    nextBtn.addEventListener('click', function () {
      if (animating) return;
      animating = true;
      // O CSS já tem transition em width/height/opacity — só precisa
      // reordenar o DOM (a 1ª foto vira a última) que o :first-child muda
      // de papel e o navegador anima o redimensionamento sozinho, com o
      // recorte (object-fit:cover) e o border-radius corretos o tempo
      // todo — mais fiel ao Smart Animate do Figma do que um transform
      // de escala (que distorcia a imagem e os cantos durante o gesto).
      track.appendChild(track.firstElementChild);
      index += 1;
      updateCaption();
      window.setTimeout(function () {
        animating = false;
      }, FADE_MS);
    });
  }

  var carousels = document.querySelectorAll('[data-photo-carousel]');
  for (var i = 0; i < carousels.length; i++) {
    initCarousel(carousels[i]);
  }
})();
