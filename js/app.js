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

  // Restaurar preferencia guardada
  if (localStorage.getItem(THEME_KEY) === 'dark') {
    applyTheme(true);
  }

  document.getElementById('theme-toggle').addEventListener('click', function () {
    applyTheme(!document.body.classList.contains('dark-mode'));
  });

  /* =============================================
   * SOPA DE LETRAS — init
   * ============================================= */
  var WORDSEARCH_WORDS = [
    'Torno',
    'Biela',
    'Polea',
    'Manivela',
    'Tornillo',
    'Engranes',
    'Rodamientos',
    'Poleas',
    'Cuna',
    'Cremallera'
  ];

  WORDSEARCH_WORDS.map(function (word) {
    WordFindGame.insertWordBefore($('#add-word').parent(), word);
  });

  var wordSearchGame;

  function recreateWordSearch() {
    $('#result-message').removeClass();
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

  recreateWordSearch();

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

}(jQuery));
