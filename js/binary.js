(function () {
  'use strict';

  var TOTAL_R    = 10;
  var TIME_PER_Q = 20;

  function toBin(n) {
    return n.toString(2).padStart(8, '0');
  }

  /* =============================================
   * BinaryGame
   * Modo dec2bin: se muestra un decimal → el jugador
   *   arma el binario pulsando los 8 bits (toggle).
   * Modo bin2dec: se muestra un binario → el jugador
   *   escribe el decimal.
   * @param {string} containerSelector
   * ============================================= */
  var BinaryGame = function (containerSelector) {
    var container = document.querySelector(containerSelector);
    var mode      = 'dec2bin';
    var current   = 0;
    var score     = 0;
    var timer     = null;
    var timeLeft  = 0;
    var answered  = false;
    var currentN  = 0;
    var self      = this;

    this.setMode = function (m) { mode = m; };

    this.init = function () {
      clearInterval(timer);
      current  = 0;
      score    = 0;
      showQuestion();
    };

    this.destroy = function () {
      clearInterval(timer);
      container.innerHTML = '';
    };

    /* ---------- Preguntas ---------- */

    function showQuestion() {
      clearInterval(timer);
      answered = false;
      currentN = Math.floor(Math.random() * 256); // 0–255

      container.innerHTML = '';

      // Progreso
      var prog = document.createElement('div');
      prog.className = 'bin-progress';
      prog.innerHTML =
        '<span>Pregunta ' + (current + 1) + ' / ' + TOTAL_R + '</span>' +
        '<span class="bin-score-live">' + score + ' \u2605</span>';
      container.appendChild(prog);

      // Barra de tiempo
      var timerWrap = document.createElement('div');
      timerWrap.className = 'bin-timer-wrap';
      timerWrap.setAttribute('aria-hidden', 'true');
      var timerBar = document.createElement('div');
      timerBar.className = 'bin-timer-bar';
      timerWrap.appendChild(timerBar);
      container.appendChild(timerWrap);

      if (mode === 'dec2bin') {
        buildDec2Bin();
      } else {
        buildBin2Dec();
      }

      timeLeft = TIME_PER_Q;
      updateTimerBar();
      timer = setInterval(function () {
        timeLeft--;
        updateTimerBar();
        if (timeLeft <= 0) { clearInterval(timer); onAnswer(false); }
      }, 1000);
    }

    /* --- Decimal → Binario: 8 botones de bit toggle --- */
    function buildDec2Bin() {
      var q = document.createElement('p');
      q.className = 'bin-question';
      q.innerHTML = 'Convierte <strong>' + currentN + '</strong> a binario (8 bits)';
      container.appendChild(q);

      var bits = [0, 0, 0, 0, 0, 0, 0, 0]; // índice 0 = bit 7 (MSB)

      var bitsWrap = document.createElement('div');
      bitsWrap.className = 'bin-bits';
      bitsWrap.setAttribute('role', 'group');
      bitsWrap.setAttribute('aria-label', 'Bits del número binario, del más significativo al menos significativo');

      var preview = document.createElement('div');
      preview.className = 'bin-preview';
      preview.setAttribute('aria-live', 'polite');
      preview.textContent = 'Valor: 0';

      function calcVal() {
        return bits.reduce(function (acc, b, i) { return acc + b * Math.pow(2, 7 - i); }, 0);
      }

      for (var i = 0; i < 8; i++) {
        (function (idx) {
          var btn = document.createElement('button');
          btn.className    = 'bin-bit';
          btn.textContent  = '0';
          btn.setAttribute('aria-pressed', 'false');
          btn.setAttribute('aria-label', 'Bit 2^' + (7 - idx) + ' (' + Math.pow(2, 7 - idx) + ')');
          btn.addEventListener('click', function () {
            bits[idx] = bits[idx] ? 0 : 1;
            btn.textContent = bits[idx];
            btn.classList.toggle('bin-bit--on', bits[idx] === 1);
            btn.setAttribute('aria-pressed', bits[idx] ? 'true' : 'false');
            preview.textContent = 'Valor: ' + calcVal();
          });
          bitsWrap.appendChild(btn);
        }(i));
      }

      container.appendChild(bitsWrap);

      // Etiquetas de potencias
      var labels = document.createElement('div');
      labels.className = 'bin-bit-labels';
      labels.setAttribute('aria-hidden', 'true');
      for (var j = 7; j >= 0; j--) {
        var lbl = document.createElement('span');
        lbl.textContent = Math.pow(2, j);
        labels.appendChild(lbl);
      }
      container.appendChild(labels);
      container.appendChild(preview);

      var submitBtn = document.createElement('button');
      submitBtn.className = 'memory-restart-btn bin-submit';
      submitBtn.textContent = 'Confirmar';
      submitBtn.addEventListener('click', function () {
        onAnswer(calcVal() === currentN);
      });
      container.appendChild(submitBtn);
    }

    /* --- Binario → Decimal: mostrar bits, escribir decimal --- */
    function buildBin2Dec() {
      var binStr = toBin(currentN);

      var q = document.createElement('p');
      q.className = 'bin-question';
      q.innerHTML = 'Convierte <strong class="bin-binary-display">' + binStr + '</strong> a decimal';
      container.appendChild(q);

      // Tabla de referencia de bits
      var refWrap = document.createElement('div');
      refWrap.className = 'bin-ref';
      refWrap.setAttribute('aria-hidden', 'true');

      var refBits = document.createElement('div');
      refBits.className = 'bin-ref-bits';
      var refLabels = document.createElement('div');
      refLabels.className = 'bin-bit-labels';

      binStr.split('').forEach(function (b, idx) {
        var span = document.createElement('span');
        span.className = 'bin-ref-bit' + (b === '1' ? ' bin-ref-bit--on' : '');
        span.textContent = b;
        refBits.appendChild(span);

        var lbl = document.createElement('span');
        lbl.textContent = Math.pow(2, 7 - idx);
        refLabels.appendChild(lbl);
      });

      refWrap.appendChild(refBits);
      refWrap.appendChild(refLabels);
      container.appendChild(refWrap);

      var inputWrap = document.createElement('div');
      inputWrap.className = 'bin-input-wrap';

      var input = document.createElement('input');
      input.type        = 'number';
      input.min         = '0';
      input.max         = '255';
      input.className   = 'bin-input';
      input.placeholder = '0 – 255';
      input.setAttribute('aria-label', 'Respuesta en decimal (0 a 255)');

      var submitBtn = document.createElement('button');
      submitBtn.className  = 'memory-restart-btn bin-submit';
      submitBtn.textContent = 'Confirmar';

      function submit() {
        var val = parseInt(input.value, 10);
        if (isNaN(val) || input.value.trim() === '') return;
        onAnswer(val === currentN);
      }

      submitBtn.addEventListener('click', submit);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') submit();
      });

      inputWrap.appendChild(input);
      inputWrap.appendChild(submitBtn);
      container.appendChild(inputWrap);

      setTimeout(function () { input.focus(); }, 60);
    }

    /* ---------- Timer ---------- */
    function updateTimerBar() {
      var bar = container.querySelector('.bin-timer-bar');
      if (!bar) return;
      var pct = Math.max(0, timeLeft / TIME_PER_Q * 100);
      bar.style.width = pct + '%';
      bar.className   = 'bin-timer-bar' +
        (pct > 50 ? '' : pct > 25 ? ' bin-timer-bar--warn' : ' bin-timer-bar--danger');
    }

    /* ---------- Respuesta ---------- */
    function onAnswer(correct) {
      if (answered) return;
      answered = true;
      clearInterval(timer);

      if (correct) score++;

      // Deshabilitar controles
      container.querySelectorAll('button, input').forEach(function (el) {
        el.disabled = true;
      });

      // Feedback
      var fb = document.createElement('div');
      fb.className = correct ? 'bin-feedback bin-feedback--correct' : 'bin-feedback bin-feedback--wrong';
      fb.setAttribute('role', 'alert');

      if (correct) {
        fb.innerHTML = '\u2713 \u00A1Correcto!';
      } else {
        var correctBin = toBin(currentN);
        fb.innerHTML = mode === 'dec2bin'
          ? '\u2717 Era <strong>' + correctBin + '</strong> (' + currentN + ')'
          : '\u2717 Era <strong>' + currentN + '</strong> (' + correctBin + ')';
      }
      container.appendChild(fb);

      setTimeout(function () {
        current++;
        if (current < TOTAL_R) showQuestion();
        else                   showResult();
      }, 1600);
    }

    /* ---------- Resultado final ---------- */
    function showResult() {
      clearInterval(timer);
      container.innerHTML = '';

      var pct   = Math.round(score / TOTAL_R * 100);
      var emoji = pct >= 80 ? '\uD83C\uDF89' : pct >= 50 ? '\uD83D\uDE0A' : '\uD83D\uDE14';
      var msg   = pct >= 80 ? '\u00A1Excelente!' : pct >= 50 ? '\u00A1Bien hecho!' : '\u00A1Sigue practicando!';

      var wrap = document.createElement('div');
      wrap.className = 'bin-result';
      wrap.setAttribute('role', 'status');
      wrap.setAttribute('aria-live', 'polite');
      wrap.innerHTML =
        '<div class="bin-result-emoji" aria-hidden="true">' + emoji + '</div>' +
        '<p class="bin-result-msg">' + msg + '</p>' +
        '<p class="bin-result-score">' + score + ' <span>/ ' + TOTAL_R + '</span></p>' +
        '<p class="bin-result-pct">' + pct + '% aciertos</p>';

      container.appendChild(wrap);

      window.dispatchEvent(new CustomEvent('ubbeGame:binaryWin',
        { detail: { score: score, total: TOTAL_R } }));
    }
  };

  window.BinaryGame = BinaryGame;

}());
