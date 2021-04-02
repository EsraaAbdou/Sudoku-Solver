'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const value = req.body.value;
      const coordinate = req.body.coordinate;
      let row = '', col ='';
      if(coordinate) {
        row =  coordinate[0];
        col = coordinate.slice(1);
      }
      const checkResponse = solver.checkPlacement(puzzle, row , col, value);
      res.json(checkResponse);      
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const solution = solver.solve(puzzle);
      res.json(solution).then(text=> console.log(text));
    });
};
