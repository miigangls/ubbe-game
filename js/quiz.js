(function () {
  'use strict';

  var TOTAL_Q   = 10;
  var TIME_PER_Q = 15;

  /* =============================================
   * QuizGame
   * @param {string} containerSelector
   * ============================================= */
  var QuizGame = function (containerSelector) {
    var container = document.querySelector(containerSelector);
    var questions = [];
    var current   = 0;
    var score     = 0;
    var category  = 'mecanica';
    var timer     = null;
    var timeLeft  = 0;
    var answered  = false;
    var self      = this;

    this.setCategory = function (cat) { category = cat; };

    this.init = function () {
      clearInterval(timer);
      // Fisher-Yates shuffle + tomar TOTAL_Q preguntas
      var pool = QUIZ_DATA[category].slice();
      for (var i = pool.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
      }
      questions = pool.slice(0, TOTAL_Q);
      current  = 0;
      score    = 0;
      showQuestion();
    };

    this.destroy = function () {
      clearInterval(timer);
      container.innerHTML = '';
    };

    /* ---------- Lógica interna ---------- */

    function showQuestion() {
      clearInterval(timer);
      answered = false;
      var q = questions[current];

      container.innerHTML = '';

      // Progreso
      var progress = document.createElement('div');
      progress.className = 'quiz-progress';
      progress.innerHTML =
        '<span class="quiz-progress-text">Pregunta ' + (current + 1) + ' / ' + TOTAL_Q + '</span>' +
        '<span class="quiz-score-live">' + score + ' \u2605</span>';
      container.appendChild(progress);

      // Barra de tiempo
      var timerWrap = document.createElement('div');
      timerWrap.className = 'quiz-timer-wrap';
      timerWrap.setAttribute('aria-hidden', 'true');
      var timerBar = document.createElement('div');
      timerBar.className = 'quiz-timer-bar';
      timerWrap.appendChild(timerBar);
      container.appendChild(timerWrap);

      // Texto de la pregunta
      var qEl = document.createElement('p');
      qEl.className = 'quiz-question';
      qEl.textContent = q.q;
      container.appendChild(qEl);

      // Opciones
      var optsEl = document.createElement('div');
      optsEl.className = 'quiz-options';
      optsEl.setAttribute('role', 'group');
      optsEl.setAttribute('aria-label', 'Opciones de respuesta');

      q.opts.forEach(function (text, idx) {
        var btn = document.createElement('button');
        btn.className = 'quiz-opt';
        btn.textContent = text;
        btn.setAttribute('aria-label', 'Opción ' + (idx + 1) + ': ' + text);
        (function (i) {
          btn.addEventListener('click', function () { onAnswer(i); });
        }(idx));
        optsEl.appendChild(btn);
      });
      container.appendChild(optsEl);

      // Arrancar timer
      timeLeft = TIME_PER_Q;
      updateTimerBar();
      timer = setInterval(function () {
        timeLeft--;
        updateTimerBar();
        if (timeLeft <= 0) {
          clearInterval(timer);
          onAnswer(-1); // tiempo agotado = respuesta incorrecta
        }
      }, 1000);
    }

    function updateTimerBar() {
      var bar = container.querySelector('.quiz-timer-bar');
      if (!bar) return;
      var pct = Math.max(0, timeLeft / TIME_PER_Q * 100);
      bar.style.width = pct + '%';
      bar.className = 'quiz-timer-bar' +
        (pct > 50 ? '' : pct > 25 ? ' quiz-timer-bar--warn' : ' quiz-timer-bar--danger');
    }

    function onAnswer(selectedIdx) {
      if (answered) return;
      answered = true;
      clearInterval(timer);

      var q       = questions[current];
      var correct = q.a;
      var btns    = container.querySelectorAll('.quiz-opt');

      btns.forEach(function (btn, i) {
        btn.disabled = true;
        if (i === correct)      btn.classList.add('quiz-opt--correct');
        else if (i === selectedIdx) btn.classList.add('quiz-opt--wrong');
      });

      if (selectedIdx === correct) score++;

      setTimeout(function () {
        current++;
        if (current < TOTAL_Q) showQuestion();
        else                   showResult();
      }, 1500);
    }

    function showResult() {
      clearInterval(timer);
      container.innerHTML = '';

      var wrap = document.createElement('div');
      wrap.className = 'quiz-result';
      wrap.setAttribute('role', 'status');
      wrap.setAttribute('aria-live', 'polite');

      var pct   = Math.round(score / TOTAL_Q * 100);
      var emoji = pct >= 80 ? '\uD83C\uDF89' : pct >= 50 ? '\uD83D\uDE0A' : '\uD83D\uDE14';
      var msg   = pct >= 80 ? '\u00A1Excelente!' : pct >= 50 ? '\u00A1Bien hecho!' : '\u00A1Sigue practicando!';

      wrap.innerHTML =
        '<div class="quiz-result-emoji" aria-hidden="true">' + emoji + '</div>' +
        '<p class="quiz-result-msg">' + msg + '</p>' +
        '<p class="quiz-result-score">' + score + ' <span>/ ' + TOTAL_Q + '</span></p>' +
        '<p class="quiz-result-pct">' + pct + '% aciertos</p>';

      container.appendChild(wrap);

      window.dispatchEvent(new CustomEvent('ubbeGame:quizWin',
        { detail: { score: score, total: TOTAL_Q } }));
    }
  };

  window.QuizGame = QuizGame;

}());
