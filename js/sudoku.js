(function () {
  'use strict';

  /* -------------------------------------------------------
   * Puzzles: grid = tablero inicial (0 = vacío), solution = solución completa
   * Ambos verificados como válidos
   * ------------------------------------------------------- */
  var PUZZLES = [
    {
      label: 'Fácil',
      grid: [
        [5,3,0, 0,7,0, 0,0,0],
        [6,0,0, 1,9,5, 0,0,0],
        [0,9,8, 0,0,0, 0,6,0],
        [8,0,0, 0,6,0, 0,0,3],
        [4,0,0, 8,0,3, 0,0,1],
        [7,0,0, 0,2,0, 0,0,6],
        [0,6,0, 0,0,0, 2,8,0],
        [0,0,0, 4,1,9, 0,0,5],
        [0,0,0, 0,8,0, 0,7,9]
      ],
      solution: [
        [5,3,4, 6,7,8, 9,1,2],
        [6,7,2, 1,9,5, 3,4,8],
        [1,9,8, 3,4,2, 5,6,7],
        [8,5,9, 7,6,1, 4,2,3],
        [4,2,6, 8,5,3, 7,9,1],
        [7,1,3, 9,2,4, 8,5,6],
        [9,6,1, 5,3,7, 2,8,4],
        [2,8,7, 4,1,9, 6,3,5],
        [3,4,5, 2,8,6, 1,7,9]
      ]
    },
    {
      label: 'Fácil',
      grid: [
        [0,0,3, 0,2,0, 6,0,0],
        [9,0,0, 3,0,5, 0,0,1],
        [0,0,1, 8,0,6, 4,0,0],
        [0,0,8, 1,0,2, 9,0,0],
        [7,0,0, 0,0,0, 0,0,8],
        [0,0,6, 7,0,8, 2,0,0],
        [0,0,2, 6,0,9, 5,0,0],
        [8,0,0, 2,0,3, 0,0,9],
        [0,0,5, 0,1,0, 3,0,0]
      ],
      solution: [
        [4,8,3, 9,2,1, 6,5,7],
        [9,6,7, 3,4,5, 8,2,1],
        [2,5,1, 8,7,6, 4,9,3],
        [5,4,8, 1,3,2, 9,7,6],
        [7,2,9, 5,6,4, 1,3,8],
        [1,3,6, 7,9,8, 2,4,5],
        [3,7,2, 6,8,9, 5,1,4],
        [8,1,4, 2,5,3, 7,6,9],
        [6,9,5, 4,1,7, 3,8,2]
      ]
    },
    {
      label: 'Medio',
      grid: [
        [0,0,0, 2,6,0, 7,0,1],
        [6,8,0, 0,7,0, 0,9,0],
        [1,9,0, 0,0,4, 5,0,0],
        [8,2,0, 1,0,0, 0,4,0],
        [0,0,4, 6,0,2, 9,0,0],
        [0,5,0, 0,0,3, 0,2,8],
        [0,0,9, 3,0,0, 0,7,4],
        [0,4,0, 0,5,0, 0,3,6],
        [7,0,3, 0,1,8, 0,0,0]
      ],
      solution: [
        [4,3,5, 2,6,9, 7,8,1],
        [6,8,2, 5,7,1, 4,9,3],
        [1,9,7, 8,3,4, 5,6,2],
        [8,2,6, 1,9,5, 3,4,7],
        [3,7,4, 6,8,2, 9,1,5],
        [9,5,1, 7,4,3, 6,2,8],
        [5,1,9, 3,2,6, 8,7,4],
        [2,4,8, 9,5,7, 1,3,6],
        [7,6,3, 4,1,8, 2,5,9]
      ]
    }
  ];

  /* -------------------------------------------------------
   * SudokuGame
   * @param {string} containerSelector
   * ------------------------------------------------------- */
  var SudokuGame = function (containerSelector) {
    var container = document.querySelector(containerSelector);
    var puzzle = null;
    var userGrid = [];     // valores que el usuario va llenando
    var givenGrid = [];    // celdas dadas (no editables)
    var selectedRow = -1;
    var selectedCol = -1;
    var cells = [];        // referencias DOM [row][col]
    var won = false;
    var timerInterval  = null;
    var elapsedSeconds = 0;
    var timerEl        = null;

    /* ---------- Init ---------- */
    this.init = function () {
      var idx = Math.floor(Math.random() * PUZZLES.length);
      puzzle = PUZZLES[idx];
      won = false;
      selectedRow = -1;
      selectedCol = -1;
      cells = [];
      userGrid = [];
      givenGrid = [];

      for (var r = 0; r < 9; r++) {
        userGrid[r] = [];
        givenGrid[r] = [];
        for (var c = 0; c < 9; c++) {
          userGrid[r][c] = puzzle.grid[r][c];
          givenGrid[r][c] = puzzle.grid[r][c] !== 0;
        }
      }

      elapsedSeconds = 0;
      render();
      attachKeyboard();
      startTimer();
    };

    this.destroy = function () {
      stopTimer();
      container.innerHTML = '';
      document.removeEventListener('keydown', keyHandler);
      puzzle = null;
      cells = [];
      won = false;
    };

    /* ---------- Render ---------- */
    function render() {
      container.innerHTML = '';

      var header = document.createElement('div');
      header.className = 'sudoku-header';
      header.innerHTML =
        '<span class="sudoku-label">Sudoku \u2014 ' + puzzle.label + '</span>' +
        '<span class="sudoku-timer">\u23F1 0:00</span>';
      container.appendChild(header);
      timerEl = header.querySelector('.sudoku-timer');

      var board = document.createElement('div');
      board.className = 'sudoku-board';

      for (var r = 0; r < 9; r++) {
        cells[r] = [];
        for (var c = 0; c < 9; c++) {
          var cell = document.createElement('div');
          cell.className = 'sudoku-cell';
          if (r % 3 === 2 && r !== 8) cell.classList.add('box-border-bottom');
          if (c % 3 === 2 && c !== 8) cell.classList.add('box-border-right');

          if (givenGrid[r][c]) {
            cell.classList.add('given');
            cell.textContent = userGrid[r][c];
          } else if (userGrid[r][c] !== 0) {
            cell.textContent = userGrid[r][c];
          }

          (function (row, col) {
            cell.addEventListener('click', function () { selectCell(row, col); });
          }(r, c));

          board.appendChild(cell);
          cells[r][c] = cell;
        }
      }

      container.appendChild(board);
      container.appendChild(buildNumpad());
      refreshErrors();
    }

    /* ---------- Numpad ---------- */
    function buildNumpad() {
      var pad = document.createElement('div');
      pad.className = 'sudoku-numpad';

      for (var n = 1; n <= 9; n++) {
        var btn = document.createElement('button');
        btn.className = 'sudoku-num-btn';
        btn.textContent = n;
        (function (num) {
          btn.addEventListener('click', function () { inputNumber(num); });
        }(n));
        pad.appendChild(btn);
      }

      var erase = document.createElement('button');
      erase.className = 'sudoku-num-btn sudoku-erase-btn';
      erase.textContent = '✕';
      erase.addEventListener('click', function () { inputNumber(0); });
      pad.appendChild(erase);

      return pad;
    }

    /* ---------- Timer ---------- */
    function formatTime(secs) {
      var m = Math.floor(secs / 60);
      var s = secs % 60;
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function startTimer() {
      stopTimer();
      timerInterval = setInterval(function () {
        elapsedSeconds++;
        if (timerEl) timerEl.textContent = '\u23F1 ' + formatTime(elapsedSeconds);
      }, 1000);
    }

    function stopTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }

    /* ---------- Selección de celda ---------- */
    function selectCell(row, col) {
      if (won) return;
      clearSelection();
      selectedRow = row;
      selectedCol = col;

      // Highlight fila, columna y caja
      for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
          var boxR = Math.floor(row / 3);
          var boxC = Math.floor(col / 3);
          if (r === row || c === col ||
              (Math.floor(r / 3) === boxR && Math.floor(c / 3) === boxC)) {
            cells[r][c].classList.add('highlight');
          }
        }
      }
      cells[row][col].classList.add('selected');
    }

    function clearSelection() {
      for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
          cells[r][c].classList.remove('selected', 'highlight');
        }
      }
    }

    /* ---------- Input de número ---------- */
    function inputNumber(num) {
      if (won) return;
      if (selectedRow === -1) return;
      if (givenGrid[selectedRow][selectedCol]) return;

      userGrid[selectedRow][selectedCol] = num;
      var cell = cells[selectedRow][selectedCol];
      cell.textContent = num === 0 ? '' : num;

      refreshErrors();
      if (num !== 0) checkWin();
    }

    /* ---------- Teclado ---------- */
    var keyHandler = function (e) {
      if (e.key >= '1' && e.key <= '9') {
        inputNumber(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        inputNumber(0);
      }
    };

    function attachKeyboard() {
      document.removeEventListener('keydown', keyHandler);
      document.addEventListener('keydown', keyHandler);
    }

    /* ---------- Detección de conflictos ---------- */
    function refreshErrors() {
      for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
          cells[r][c].classList.remove('error');
        }
      }

      for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
          if (userGrid[r][c] === 0) continue;
          if (hasConflict(r, c)) {
            cells[r][c].classList.add('error');
          }
        }
      }
    }

    function hasConflict(row, col) {
      var val = userGrid[row][col];
      // fila
      for (var c = 0; c < 9; c++) {
        if (c !== col && userGrid[row][c] === val) return true;
      }
      // columna
      for (var r = 0; r < 9; r++) {
        if (r !== row && userGrid[r][col] === val) return true;
      }
      // caja 3×3
      var br = Math.floor(row / 3) * 3;
      var bc = Math.floor(col / 3) * 3;
      for (var r = br; r < br + 3; r++) {
        for (var c = bc; c < bc + 3; c++) {
          if (r !== row && c !== col && userGrid[r][c] === val) return true;
        }
      }
      return false;
    }

    /* ---------- Victoria ---------- */
    function checkWin() {
      for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
          if (userGrid[r][c] !== puzzle.solution[r][c]) return;
        }
      }
      won = true;
      stopTimer();
      window.dispatchEvent(new CustomEvent('ubbeGame:sudokuWin', { detail: { time: elapsedSeconds } }));
      clearSelection();
      document.removeEventListener('keydown', keyHandler);
      showWin();
    }

    function showWin() {
      for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
          cells[r][c].classList.add('complete');
        }
      }
      setTimeout(function () {
        var msg = document.createElement('div');
        msg.className = 'sudoku-win';
        msg.innerHTML = '&#127881; ¡Completado en <strong>' + formatTime(elapsedSeconds) + '</strong>!';
        container.appendChild(msg);
      }, 300);
    }
  };

  window.SudokuGame = SudokuGame;

}());
