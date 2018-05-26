(function ($) {
  'use strict';

  /* =============================================
   * DARK MODE — toggle y persistencia
   * ============================================= */
  var THEME_KEY = 'ubbe-theme';

  function applyTheme(dark) {
    document.body.classList.toggle('dark-mode', dark);
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }

  if (localStorage.getItem(THEME_KEY) === 'dark') applyTheme(true);

  document.getElementById('theme-toggle').addEventListener('click', function () {
    applyTheme(!document.body.classList.contains('dark-mode'));
  });

  /* =============================================
   * SOPA DE LETRAS — categorías + init
   * ============================================= */
  var currentCategory = 'mecanica';

  function loadCategory(key) {
    currentCategory = key;
    // Limpiar palabras actuales (todo excepto #add-word)
    $('#words li:not(:last-child)').remove();
    // Insertar nuevas
    WORDSEARCH_DATA[key].words.forEach(function (word) {
      WordFindGame.insertWordBefore($('#add-word').parent(), word);
    });
    recreateWordSearch();
    // Estado visual del botón activo
    $('.ws-cat-btn').removeClass('active').attr('aria-pressed', 'false');
    $('.ws-cat-btn[data-cat="' + key + '"]').addClass('active').attr('aria-pressed', 'true');
  }

  var wordSearchGame;

  function recreateWordSearch() {
    $('#result-message').removeClass().text('');
    try {
      wordSearchGame = new WordFindGame('#puzzle', {
        allowedMissingWords: 10,
        maxGridGrowth: 10,
        fillBlanks: undefined,
        allowExtraBlanks: ['none'],
        maxAttempts: 100
      });
    } catch (error) {
      $('#result-message')
        .text('\uD83D\uDE1E ' + error + ', intenta con menos palabras')
        .css({ color: 'red' });
    }
  }

  // Cargar categoría inicial
  loadCategory('mecanica');

  // Botones de categoría
  $(document).on('click', '.ws-cat-btn', function () {
    loadCategory($(this).data('cat'));
  });

  $('#solve').click(function () {
    if (wordSearchGame) wordSearchGame.solve();
  });

  /* =============================================
   * ENCUENTRA CARAS — init + scores
   * ============================================= */
  var memoryGame = new MemoryGame('#memory-container');

  $('#memoryModal').on('show.bs.modal', function () {
    memoryGame.init();
    Scores.render('memory', '#memory-scores');
  });

  $('#memoryModal').on('hidden.bs.modal', function () {
    memoryGame.destroy();
  });

  document.getElementById('memory-restart').addEventListener('click', function () {
    memoryGame.init();
  });

  window.addEventListener('ubbeGame:memoryWin', function (e) {
    Scores.add('memory', e.detail.moves);
    Scores.render('memory', '#memory-scores');
  });

  /* =============================================
   * SUDOKU — init + scores
   * ============================================= */
  var sudokuGame = new SudokuGame('#sudoku-container');

  $('#sudokuModal').on('show.bs.modal', function () {
    sudokuGame.init();
    Scores.render('sudoku', '#sudoku-scores');
  });

  $('#sudokuModal').on('hidden.bs.modal', function () {
    sudokuGame.destroy();
  });

  document.getElementById('sudoku-restart').addEventListener('click', function () {
    sudokuGame.init();
  });

  window.addEventListener('ubbeGame:sudokuWin', function (e) {
    Scores.add('sudoku', e.detail.time);
    Scores.render('sudoku', '#sudoku-scores');
  });

  /* =============================================
   * AHORCADO — init + categorías + teclado físico
   * ============================================= */
  var hangmanGame = new HangmanGame('#hangman-container');
  var hangmanCat  = 'mecanica';

  function hangmanKeyHandler(e) {
    var key = e.key.toUpperCase();
    if (/^[A-ZÁÉÍÓÚÑ]$/.test(key)) {
      hangmanGame.guess(key);
      e.preventDefault();
    }
  }

  $('#hangmanModal').on('show.bs.modal', function () {
    hangmanGame.setCategory(hangmanCat);
    hangmanGame.init();
    Scores.render('hangman', '#hangman-scores');
    document.addEventListener('keydown', hangmanKeyHandler);
  });

  $('#hangmanModal').on('hidden.bs.modal', function () {
    hangmanGame.destroy();
    document.removeEventListener('keydown', hangmanKeyHandler);
  });

  document.getElementById('hangman-restart').addEventListener('click', function () {
    hangmanGame.setCategory(hangmanCat);
    hangmanGame.init();
  });

  $(document).on('click', '.hm-cat-btn', function () {
    hangmanCat = $(this).data('cat');
    $('.hm-cat-btn').removeClass('active').attr('aria-pressed', 'false');
    $(this).addClass('active').attr('aria-pressed', 'true');
    hangmanGame.setCategory(hangmanCat);
    hangmanGame.init();
  });

  window.addEventListener('ubbeGame:hangmanWin', function (e) {
    Scores.add('hangman', e.detail.errors);
    Scores.render('hangman', '#hangman-scores');
  });

  /* =============================================
   * ESTADÍSTICAS — modal
   * ============================================= */
  $('#statsModal').on('show.bs.modal', function () {
    Scores.renderStats('#stats-container');
  });

}(jQuery));
