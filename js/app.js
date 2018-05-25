(function ($) {
  'use strict';

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
      return;
    }
  }

  recreateWordSearch();

  $('#solve').click(function () {
    if (wordSearchGame) wordSearchGame.solve();
  });

  /* =============================================
   * ENCUENTRA CARAS — init
   * ============================================= */
  var memoryGame = new MemoryGame('#memory-container');

  $('#memoryModal').on('show.bs.modal', function () {
    memoryGame.init();
  });

  $('#memoryModal').on('hidden.bs.modal', function () {
    memoryGame.destroy();
  });

  document.getElementById('memory-restart').addEventListener('click', function () {
    memoryGame.init();
  });

  /* =============================================
   * SUDOKU — init
   * ============================================= */
  var sudokuGame = new SudokuGame('#sudoku-container');

  $('#sudokuModal').on('show.bs.modal', function () {
    sudokuGame.init();
  });

  $('#sudokuModal').on('hidden.bs.modal', function () {
    sudokuGame.destroy();
  });

  document.getElementById('sudoku-restart').addEventListener('click', function () {
    sudokuGame.init();
  });

}(jQuery));
