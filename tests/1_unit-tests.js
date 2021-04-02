const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {

    suite('validate function', () => {

        test('Logic handles a valid puzzle string of 81 characters', function () {
            const puzzleStr1 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const puzzleStr2 = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
            const puzzleStr3 = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1';
            const puzzleStr4 = '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6';
            const puzzleStr5 = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
            assert.equal(solver.validate(puzzleStr1), '');
            assert.equal(solver.validate(puzzleStr2), '');
            assert.equal(solver.validate(puzzleStr3), '');
            assert.equal(solver.validate(puzzleStr4), '');
            assert.equal(solver.validate(puzzleStr5), '');
        });

        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
            const puzzleStr = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.5g';
            assert.equal(solver.validate(puzzleStr), 'Invalid characters in puzzle');
        });

        test('Logic handles a puzzle string that is not 81 characters in length', function () {
            const puzzleStr = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.512';
            assert.equal(solver.validate(puzzleStr), 'Expected puzzle to be 81 characters long');
        });

    });

    suite('placement functions', () => {
    
        test('Logic handles a valid row placement', function () {
            const puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            assert.isTrue(solver.checkRowPlacement(puzzleStr, 'A', '2'));
            assert.isTrue(solver.checkRowPlacement(puzzleStr, 'a', '2'));
        });

        test('Logic handles an invalid row placement', function () {
            const puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            assert.isFalse(solver.checkRowPlacement(puzzleStr, 'A', '1'));
            assert.isFalse(solver.checkRowPlacement(puzzleStr, 'a', '1'));
        });

        test('Logic handles a valid column placement', function () {
            const puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            assert.isTrue(solver.checkColPlacement(puzzleStr, '1', '2'));
        });

        test('Logic handles an invalid column placement', function () {
            const puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            assert.isFalse(solver.checkColPlacement(puzzleStr, '2', '2'));
        });

        test('Logic handles a valid region (3x3 grid) placement', function () {
            const puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            assert.isTrue(solver.checkRegionPlacement(puzzleStr, 'E', '2', '4'));
            assert.isTrue(solver.checkRegionPlacement(puzzleStr, 'e', '2', '4'));
        });

        test('Logic handles an invalid region (3x3 grid) placement', function () {
            const puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            assert.isFalse(solver.checkRegionPlacement(puzzleStr, 'A', '2', '2'));
            assert.isFalse(solver.checkRegionPlacement(puzzleStr, 'a', '2', '2'));
        });
    
    });

    suite('solve function', () => {

        test('Valid puzzle strings pass the solver', function () {
            const puzzleStr1 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const puzzleStr2 = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
            const puzzleStr3 = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1';
            const puzzleStr4 = '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6';
            const puzzleStr5 = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
            assert.property(solver.solve(puzzleStr1), 'solution');
            assert.notProperty(solver.solve(puzzleStr1), 'error');
            assert.property(solver.solve(puzzleStr2), 'solution');
            assert.notProperty(solver.solve(puzzleStr2), 'error');
            assert.property(solver.solve(puzzleStr3), 'solution');
            assert.notProperty(solver.solve(puzzleStr3), 'error');
            assert.property(solver.solve(puzzleStr4), 'solution');
            assert.notProperty(solver.solve(puzzleStr4), 'error');
            assert.property(solver.solve(puzzleStr5), 'solution');
            assert.notProperty(solver.solve(puzzleStr5), 'error');
        });

        test('Invalid puzzle strings fail the solver', function () {
            const puzzleStr = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.5g';
            assert.property(solver.solve(puzzleStr), 'error');    
            assert.notProperty(solver.solve(puzzleStr), 'solution');
        });

        test('Solver returns the the expected solution for an incomplete puzzzle', function () {
            const puzzleStr1 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
            const sol1 = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
            const puzzleStr2 = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
            const sol2 = '568913724342687519197254386685479231219538467734162895926345178473891652851726943';
            const puzzleStr3 = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1';
            const sol3 = '218396745753284196496157832531672984649831257827549613962415378185763429374928561';
            const puzzleStr4 = '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6';
            const sol4 = '473891265851726394926345817568913472342687951197254638734162589685479123219538746';
            const puzzleStr5 = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
            const sol5 = '827549163531672894649831527496157382218396475753284916962415738185763249374928651';
            assert.equal(solver.solve(puzzleStr1).solution, sol1);
            assert.equal(solver.solve(puzzleStr2).solution, sol2);
            assert.equal(solver.solve(puzzleStr3).solution, sol3);
            assert.equal(solver.solve(puzzleStr4).solution, sol4);
            assert.equal(solver.solve(puzzleStr5).solution, sol5);
            assert.notProperty(solver.solve(puzzleStr1), 'error');
            assert.notProperty(solver.solve(puzzleStr2), 'error');
            assert.notProperty(solver.solve(puzzleStr3), 'error');
            assert.notProperty(solver.solve(puzzleStr4), 'error');
            assert.notProperty(solver.solve(puzzleStr5), 'error');
        });
        
    });

});
