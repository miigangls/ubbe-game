(function () {
  'use strict';

  var MAX_WRONG = 6;

  // Partes del cuerpo que se dibujan con cada error
  var PARTS = [
    { tag: 'circle', attrs: { cx: 85, cy: 42, r: 12 } },                    // cabeza
    { tag: 'line',   attrs: { x1: 85, y1: 54, x2: 85,  y2: 90  } },        // cuerpo
    { tag: 'line',   attrs: { x1: 85, y1: 65, x2: 65,  y2: 80  } },        // brazo izq
    { tag: 'line',   attrs: { x1: 85, y1: 65, x2: 105, y2: 80  } },        // brazo der
    { tag: 'line',   attrs: { x1: 85, y1: 90, x2: 65,  y2: 115 } },        // pierna izq
    { tag: 'line',   attrs: { x1: 85, y1: 90, x2: 105, y2: 115 } }         // pierna der
  ];

  var ALPHABET = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  /* =============================================
   * HangmanGame
   * @param {string} containerSelector
   * ============================================= */
  var HangmanGame = function (containerSelector) {
    var container = document.querySelector(containerSelector);
    var word      = '';
    var category  = 'mecanica';
    var guessed   = [];   // letras correctas
    var wrong     = [];   // letras incorrectas
    var finished  = false;
    var self      = this;

    this.setCategory = function (cat) { category = cat; };

    this.init = function () {
      var words = WORDSEARCH_DATA[category].words;
      word     = words[Math.floor(Math.random() * words.length)].toUpperCase();
      guessed  = [];
      wrong    = [];
      finished = false;
      render();
    };

    this.destroy = function () {
      container.innerHTML = '';
    };

    /* Expuesto para el listener de teclado en app.js */
    this.guess = function (letter) {
      var l = letter.toUpperCase();
      if (finished) return;
      if (guessed.indexOf(l) !== -1 || wrong.indexOf(l) !== -1) return;

      if (word.indexOf(l) !== -1) {
        guessed.push(l);
        var allRevealed = word.split('').every(function (c) {
          return guessed.indexOf(c) !== -1;
        });
        if (allRevealed) {
          finished = true;
          render();
          showResult(true);
          window.dispatchEvent(new CustomEvent('ubbeGame:hangmanWin',
            { detail: { word: word, errors: wrong.length } }));
          return;
        }
      } else {
        wrong.push(l);
        if (wrong.length >= MAX_WRONG) {
          finished = true;
          render();
          showResult(false);
          return;
        }
      }
      render();
    };

    /* ---------- Render ---------- */
    function render() {
      container.innerHTML = '';
      container.appendChild(buildSVG());
      container.appendChild(buildWordDisplay());
      container.appendChild(buildWrongList());
      container.appendChild(buildKeyboard());
    }

    /* Dibujo SVG del ahorcado */
    function buildSVG() {
      var NS  = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 130 155');
      svg.setAttribute('width',   '130');
      svg.setAttribute('height',  '155');
      svg.classList.add('hm-svg');
      svg.setAttribute('aria-label',
        'Ahorcado: ' + wrong.length + ' de ' + MAX_WRONG + ' errores');
      svg.setAttribute('role', 'img');

      // Horca — siempre visible
      [
        [10, 145, 120, 145],   // base
        [35, 145, 35,  10 ],   // poste
        [35, 10,  85,  10 ],   // viga
        [85, 10,  85,  30 ]    // cuerda
      ].forEach(function (c) {
        var l = document.createElementNS(NS, 'line');
        l.setAttribute('x1', c[0]); l.setAttribute('y1', c[1]);
        l.setAttribute('x2', c[2]); l.setAttribute('y2', c[3]);
        l.classList.add('hm-gallows');
        svg.appendChild(l);
      });

      // Partes del cuerpo
      PARTS.forEach(function (p, i) {
        var el = document.createElementNS(NS, p.tag);
        Object.keys(p.attrs).forEach(function (k) {
          el.setAttribute(k, p.attrs[k]);
        });
        el.classList.add('hm-part');
        if (i < wrong.length) el.classList.add('hm-visible');
        svg.appendChild(el);
      });

      return svg;
    }

    /* Casillas de letras de la palabra */
    function buildWordDisplay() {
      var div = document.createElement('div');
      div.className = 'hm-word';
      div.setAttribute('aria-label', wordToAriaLabel());

      word.split('').forEach(function (letter) {
        var span = document.createElement('span');
        span.className = 'hm-letter';
        if (guessed.indexOf(letter) !== -1) {
          span.textContent = letter;
          span.classList.add('hm-revealed');
        } else if (finished) {
          span.textContent = letter;
          span.classList.add('hm-missed');
        }
        div.appendChild(span);
      });

      return div;
    }

    function wordToAriaLabel() {
      return word.split('').map(function (l) {
        return guessed.indexOf(l) !== -1 ? l : 'espacio';
      }).join(', ');
    }

    /* Lista de letras incorrectas */
    function buildWrongList() {
      var div = document.createElement('div');
      div.className = 'hm-wrong';
      div.setAttribute('aria-live', 'polite');
      if (wrong.length) {
        div.textContent = 'Errores (' + wrong.length + '/' + MAX_WRONG + '): ' + wrong.join(' ');
      }
      return div;
    }

    /* Teclado de letras */
    function buildKeyboard() {
      var div = document.createElement('div');
      div.className = 'hm-keyboard';
      div.setAttribute('role', 'group');
      div.setAttribute('aria-label', 'Teclado de letras');

      ALPHABET.forEach(function (letter) {
        var btn  = document.createElement('button');
        var used = guessed.indexOf(letter) !== -1 || wrong.indexOf(letter) !== -1;
        var isWrong = wrong.indexOf(letter) !== -1;

        btn.className = 'hm-key' + (isWrong ? ' hm-key--wrong' : used ? ' hm-key--correct' : '');
        btn.textContent = letter;
        btn.setAttribute('aria-label', 'Letra ' + letter);
        btn.disabled = used || finished;

        (function (l) {
          btn.addEventListener('click', function () { self.guess(l); });
        }(letter));

        div.appendChild(btn);
      });

      return div;
    }

    /* Mensaje de resultado */
    function showResult(won) {
      var div = document.createElement('div');
      div.className = won ? 'hm-win' : 'hm-lose';
      div.setAttribute('role', 'alert');
      div.innerHTML = won
        ? '&#127881; &#161;Correcto! La palabra era <strong>' + word + '</strong>'
        : '&#128549; La palabra era <strong>' + word + '</strong>';
      container.appendChild(div);
    }
  };

  window.HangmanGame = HangmanGame;

}());
