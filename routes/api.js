'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;
      const checkResponse = solver.checkPlacement(puzzle, coordinate[0], coordinate.slice(1), value);
      res.send(checkResponse);      
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const solution = solver.solve(puzzle);
      res.send(solution);
    });
};
