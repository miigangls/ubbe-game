(function () {
  'use strict';

  var CARDS = ['😀', '😂', '😍', '😎', '🤔', '😴', '🤩', '😡'];

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /**
   * MemoryGame
   * @param {string} containerSelector - selector del contenedor donde se renderiza
   */
  var MemoryGame = function (containerSelector) {
    var container = document.querySelector(containerSelector);
    var flipped = [];
    var matched = 0;
    var moves = 0;
    var locked = false;
    var movesEl = null;

    function render() {
      container.innerHTML = '';

      movesEl = document.createElement('div');
      movesEl.className = 'memory-moves';
      movesEl.textContent = 'Movimientos: 0';
      container.appendChild(movesEl);

      var deck = document.createElement('div');
      deck.className = 'memory-deck';

      var pairs = shuffle(CARDS.concat(CARDS));

      pairs.forEach(function (face, idx) {
        var card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.face = face;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Carta ' + (idx + 1) + ', sin voltear');
        card.setAttribute('aria-pressed', 'false');
        card.innerHTML =
          '<div class="memory-card-inner">' +
            '<div class="memory-card-front">?</div>' +
            '<div class="memory-card-back">' + face + '</div>' +
          '</div>';
        card.addEventListener('click', function () { flipCard(card); });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            flipCard(card);
            e.preventDefault();
          }
        });
        deck.appendChild(card);
      });

      container.appendChild(deck);
    }

    function flipCard(card) {
      if (locked) return;
      if (card.classList.contains('flipped')) return;
      if (card.classList.contains('matched')) return;

      card.classList.add('flipped');
      card.setAttribute('aria-pressed', 'true');
      card.setAttribute('aria-label', card.getAttribute('aria-label').replace('sin voltear', 'volteada'));
      flipped.push(card);

      if (flipped.length === 2) {
        moves++;
        movesEl.textContent = 'Movimientos: ' + moves;
        locked = true;
        checkMatch();
      }
    }

    function checkMatch() {
      var a = flipped[0];
      var b = flipped[1];

      if (a.dataset.face === b.dataset.face) {
        a.classList.add('matched'); a.setAttribute('aria-label', 'Pareja encontrada'); a.setAttribute('tabindex', '-1');
        b.classList.add('matched'); b.setAttribute('aria-label', 'Pareja encontrada'); b.setAttribute('tabindex', '-1');
        matched += 2;
        flipped = [];
        locked = false;

        if (matched === CARDS.length * 2) {
          showWin();
        }
      } else {
        setTimeout(function () {
          a.classList.remove('flipped'); a.setAttribute('aria-pressed', 'false');
          b.classList.remove('flipped'); b.setAttribute('aria-pressed', 'false');
          flipped = [];
          locked = false;
        }, 900);
      }
    }

    function showWin() {
      window.dispatchEvent(new CustomEvent('ubbeGame:memoryWin', { detail: { moves: moves } }));
      setTimeout(function () {
        var msg = document.createElement('div');
        msg.className = 'memory-win';
        msg.innerHTML = '&#127881; ¡Ganaste en <strong>' + moves + '</strong> movimientos!';
        container.appendChild(msg);
      }, 400);
    }

    this.init = function () {
      flipped = [];
      matched = 0;
      moves = 0;
      locked = false;
      render();
    };

    this.destroy = function () {
      container.innerHTML = '';
      flipped = [];
      matched = 0;
      moves = 0;
      locked = false;
    };
  };

  window.MemoryGame = MemoryGame;

}());
