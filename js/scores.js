(function () {
  'use strict';

  var STORAGE_KEY = 'ubbe-game-scores';
  var MAX_TOP     = 5;
  var MAX_HISTORY = 20;

  /* =============================================
   * Scores — gestión de marcas e historial
   *
   * Estructura en localStorage:
   * {
   *   memory: { top: [4,6,8], history: [8,4,12,6] },
   *   sudoku: { top: [45,78], history: [120,45,78] }
   * }
   *
   * Métrica: menor = mejor (movimientos / segundos)
   * ============================================= */
  var Scores = {

    _load: function () {
      try {
        var raw  = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        var data = JSON.parse(raw);
        // Migración: formato antiguo era array directo
        ['memory', 'sudoku'].forEach(function (g) {
          if (Array.isArray(data[g])) {
            data[g] = { top: data[g], history: data[g].slice() };
          } else if (!data[g]) {
            data[g] = { top: [], history: [] };
          }
        });
        return data;
      } catch (e) {
        return {};
      }
    },

    _persist: function (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    _gameData: function (data, game) {
      if (!data[game]) data[game] = { top: [], history: [] };
      return data[game];
    },

    /* Guarda un nuevo resultado (top 5 + historial) */
    add: function (game, value) {
      var data = this._load();
      var gd   = this._gameData(data, game);

      // Top 5 ascendente
      gd.top.push(value);
      gd.top.sort(function (a, b) { return a - b; });
      gd.top = gd.top.slice(0, MAX_TOP);

      // Historial cronológico
      gd.history.push(value);
      if (gd.history.length > MAX_HISTORY) gd.history.shift();

      this._persist(data);
    },

    /* Devuelve el top (ordenado) */
    get: function (game) {
      return (this._load()[game] || { top: [] }).top;
    },

    /* Devuelve el historial cronológico completo */
    getHistory: function (game) {
      return (this._load()[game] || { history: [] }).history;
    },

    /* Calcula estadísticas del historial */
    getStats: function (game) {
      var history = this.getHistory(game);
      if (!history.length) return null;
      var best = Math.min.apply(null, history);
      var avg  = Math.round(history.reduce(function (s, v) { return s + v; }, 0) / history.length);
      return { played: history.length, best: best, avg: avg, history: history };
    },

    /* Borra un juego */
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
      return value + ' movs.';
    },

    /* Renderiza el panel de mejores marcas (top 5) */
    render: function (game, containerSelector) {
      var el = document.querySelector(containerSelector);
      if (!el) return;

      var list   = this.get(game);
      var self   = this;
      var MEDALS = ['1\u00BA', '2\u00BA', '3\u00BA', '4\u00BA', '5\u00BA'];

      var html = '<div class="scores-panel">';
      html += '<h6 class="scores-title">Mejores marcas</h6>';

      if (list.length === 0) {
        html += '<p class="scores-empty">Sin registros a\u00FAn \u2014 \u00A1completa una partida!</p>';
      } else {
        html += '<ol class="scores-list">';
        list.forEach(function (v, i) {
          html += '<li' + (i === 0 ? ' class="scores-best"' : '') + '>';
          html += '<span class="scores-pos">' + MEDALS[i] + '</span>';
          html += '<span class="scores-value">' + self._format(game, v) + '</span>';
          if (i === 0) html += '<span class="scores-badge">mejor</span>';
          html += '</li>';
        });
        html += '</ol>';
        html += '<button class="scores-clear-btn" data-game="' + game + '">Borrar marcas</button>';
      }

      html += '</div>';
      el.innerHTML = html;

      var btn = el.querySelector('.scores-clear-btn');
      if (btn) {
        btn.addEventListener('click', function () {
          self.clear(game);
          self.render(game, containerSelector);
        });
      }
    },

    /* Renderiza la pantalla completa de estadísticas */
    renderStats: function (containerSelector) {
      var el = document.querySelector(containerSelector);
      if (!el) return;

      var self   = this;
      var GAMES  = [
        { key: 'memory', label: 'Encuentra Caras', unit: 'movimientos' },
        { key: 'sudoku', label: 'Sudoku',           unit: 'segundos'   }
      ];

      var html = '';

      GAMES.forEach(function (g) {
        var stats = self.getStats(g.key);
        html += '<div class="stats-game">';
        html += '<h6 class="stats-game-title">' + g.label + '</h6>';

        if (!stats) {
          html += '<p class="scores-empty">Sin partidas registradas.</p>';
        } else {
          // Números clave
          html += '<div class="stats-numbers">';
          html += '<div class="stats-number"><span class="stats-n">' + stats.played + '</span><span class="stats-n-label">partidas</span></div>';
          html += '<div class="stats-number"><span class="stats-n">' + self._format(g.key, stats.best) + '</span><span class="stats-n-label">mejor</span></div>';
          html += '<div class="stats-number"><span class="stats-n">' + self._format(g.key, stats.avg) + '</span><span class="stats-n-label">promedio</span></div>';
          html += '</div>';

          // Mini gráfica de barras — últimas 5 partidas
          var last5 = stats.history.slice(-5);
          if (last5.length >= 2) {
            var maxV  = Math.max.apply(null, last5);
            var minV  = Math.min.apply(null, last5);
            var range = maxV - minV || 1;

            html += '<div class="stats-chart" aria-hidden="true" title="Últimas ' + last5.length + ' partidas">';
            last5.forEach(function (v) {
              // Barra más alta = mejor rendimiento (valor más bajo)
              var pct    = Math.round(((maxV - v) / range) * 65 + 20);
              var isBest = (v === stats.best);
              html += '<div class="stats-bar' + (isBest ? ' stats-bar--best' : '') + '" style="height:' + pct + '%" title="' + self._format(g.key, v) + '"></div>';
            });
            html += '</div>';
            html += '<p class="stats-chart-label">\u00FAltimas ' + last5.length + ' partidas</p>';
          }

          html += '<button class="scores-clear-btn" data-game="' + g.key + '">Borrar</button>';
        }

        html += '</div>';
      });

      el.innerHTML = html || '<p class="scores-empty">Sin datos a\u00FAn.</p>';

      // Listeners de borrar por juego
      el.querySelectorAll('.scores-clear-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          self.clear(btn.dataset.game);
          self.renderStats(containerSelector);
        });
      });
    }

  };

  window.Scores = Scores;

}());
