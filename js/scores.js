(function () {
  'use strict';

  var STORAGE_KEY = 'ubbe-game-scores';
  var MAX_ENTRIES  = 5;

  /* =============================================
   * Scores — gestión de highscores con localStorage
   *
   * Métricas (menor = mejor en ambos casos):
   *   memory  → nº de movimientos
   *   sudoku  → segundos
   * ============================================= */
  var Scores = {

    _load: function () {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      } catch (e) {
        return {};
      }
    },

    _persist: function (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    /* Agrega un nuevo valor al ranking de un juego */
    add: function (game, value) {
      var data = this._load();
      if (!data[game]) data[game] = [];
      data[game].push(value);
      data[game].sort(function (a, b) { return a - b; }); // ascendente
      data[game] = data[game].slice(0, MAX_ENTRIES);
      this._persist(data);
    },

    /* Devuelve el array de scores (ya ordenado) */
    get: function (game) {
      return this._load()[game] || [];
    },

    /* Borra el ranking de un juego */
    clear: function (game) {
      var data = this._load();
      delete data[game];
      this._persist(data);
    },

    /* Formatea un valor según el juego */
    _format: function (game, value) {
      if (game === 'sudoku') {
        var m = Math.floor(value / 60);
        var s = value % 60;
        return m + ':' + (s < 10 ? '0' : '') + s;
      }
      return value + ' movimientos';
    },

    /* Renderiza el panel de scores en el contenedor indicado */
    render: function (game, containerSelector) {
      var el = document.querySelector(containerSelector);
      if (!el) return;

      var list  = this.get(game);
      var self  = this;
      var MEDALS = ['1\u00BA', '2\u00BA', '3\u00BA', '4\u00BA', '5\u00BA'];

      var html = '<div class="scores-panel">';
      html += '<h6 class="scores-title">Mejores marcas</h6>';

      if (list.length === 0) {
        html += '<p class="scores-empty">Sin registros a\u00FAn \u2014 \u00A1completa una partida!</p>';
      } else {
        html += '<ol class="scores-list">';
        list.forEach(function (v, i) {
          var isNew = (i === 0);
          html += '<li' + (isNew ? ' class="scores-best"' : '') + '>';
          html += '<span class="scores-pos">' + MEDALS[i] + '</span>';
          html += '<span class="scores-value">' + self._format(game, v) + '</span>';
          if (isNew) html += '<span class="scores-badge">mejor</span>';
          html += '</li>';
        });
        html += '</ol>';
        html += '<button class="scores-clear-btn" data-game="' + game + '">Borrar marcas</button>';
      }

      html += '</div>';
      el.innerHTML = html;

      var clearBtn = el.querySelector('.scores-clear-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', function () {
          self.clear(game);
          self.render(game, containerSelector);
        });
      }
    }

  };

  window.Scores = Scores;

}());
