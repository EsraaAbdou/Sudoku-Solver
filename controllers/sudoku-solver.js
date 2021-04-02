class SudokuSolver {

  validate(puzzleString) {
    if(!puzzleString) {
      return 'Required field missing';
    }
    const validNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const puzzleArr = puzzleString.split('');
    if(puzzleArr.length != 81) {
      return 'Expected puzzle to be 81 characters long';
    }
    const numbersArr = puzzleArr.filter(element => element != '.');
    const containtsValidNumbers = numbersArr.every(element => validNumbers.includes(element));
    if(!containtsValidNumbers) {
      return 'Invalid characters in puzzle';
    }
    return '';
  }

  checkRowPlacement(puzzleString, row, value) {
    const puzzleArr = puzzleString.split(''); 
    const rows = this.findrows(puzzleArr).rowsObj;
    let valid = true;

    if (rows[row].includes(value)) {
      valid = false;
    } 

    return valid;
  }

  checkColPlacement(puzzleString, column, value) {
    const puzzleArr = puzzleString.split('');
    const columns = this.findCols(puzzleArr).colObj;
    let valid = true;

    if (columns[column].includes(value)) {
      valid = false;
    }
    
    return valid;
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    const puzzleArr = puzzleString.split('');
    const regions = this.findRegions(puzzleArr).regObj;
    let valid = true;
    let region = '';
    if(['1','2','3'].includes(col) && ['A', 'B', 'C'].includes(row)) region = 'a1';
    if(['1','2','3'].includes(col) && ['D', 'E', 'F'].includes(row)) region = 'a4';
    if(['1','2','3'].includes(col) && ['G', 'H', 'I'].includes(row)) region = 'a7';
    if(['4','5','6'].includes(col) && ['A', 'B', 'C'].includes(row)) region = 'a2';
    if(['4','5','6'].includes(col) && ['D', 'E', 'F'].includes(row)) region = 'a5';
    if(['4','5','6'].includes(col) && ['G', 'H', 'I'].includes(row)) region = 'a8';
    if(['7','8','9'].includes(col) && ['A', 'B', 'C'].includes(row)) region = 'a3';
    if(['7','8','9'].includes(col) && ['D', 'E', 'F'].includes(row)) region = 'a6';
    if(['7','8','9'].includes(col) && ['G', 'H', 'I'].includes(row)) region = 'a9';

    if (regions[region].includes(value)) {
      valid = false;
    } 

    return valid;
  }

  checkPlacement(puzzleString, row, column, value) {
    row = row.toUpperCase();
    const validationRes = this.validate(puzzleString);
    if(validationRes != '') return validationRes;
    if(!(row || column) || !value) {
      const errorObj = { error: 'Required field(s) missing'};
      return errorObj;
    }
    if(!'ABCDEFGHI'.split('').includes(row)) {
      const errorObj = { error: 'Invalid coordinate'};
      return errorObj;
    }
    if(!'123456789'.split('').includes(column)) {
      const errorObj = { error: 'Invalid coordinate'};
      return errorObj;
    }
    if(!'123456789'.split('').includes(value)) {
      const errorObj = { error: 'Invalid value'};
      return errorObj;
    }
    let checkResult = {
      valid: true
    };

    let puzzleArr = this.createPuzzleObjArr(puzzleString);
    const inputFieldObj = puzzleArr.filter(element => element.col == column && element.row == row);
    if(inputFieldObj[0].value == value) return checkResult;
    
    if(!this.checkRowPlacement(puzzleString, row, value)) {
      if(checkResult.valid) {
        checkResult = {
          valid: false,
          conflict: ['row']
        };
      } else {
        checkResult.conflict.push('row');
      }
    }
    if(!this.checkColPlacement(puzzleString, column, value)) {
      if(checkResult.valid) {
        checkResult = {
          valid: false,
          conflict: ['column']
        };
      } else {
        checkResult.conflict.push('column');
      }
    }
    if(!this.checkRegionPlacement(puzzleString, row, column, value)) {
      if(checkResult.valid) {
        checkResult = {
          valid: false,
          conflict: ['region']
        };
      } else {
        checkResult.conflict.push('region');
      }
    }

    return checkResult;
  }

  solve(puzzleString) {
    const validationError = this.validate(puzzleString);
    let error, solution; 
    if(validationError != ''){
      return {error: validationError};
    } else {
      let puzzleArr = this.createPuzzleObjArr(puzzleString);
      const validNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      let missingFields = puzzleArr.filter(element => element.value === '.');
      let loopBreakCounter = true;
      while(missingFields.length > 0 && loopBreakCounter) {
        let loopStartmissingCount = missingFields.length;
        missingFields.forEach(element => {
          let possibleSol = [];
          validNumbers.forEach(val => {
            if(this.checkPlacement(puzzleString, element.row, element.col, val).valid) possibleSol.push(val);
          });
          if(possibleSol.length == 1) {
            const idx = puzzleArr.findIndex(d => d.col == element.col && d.row == element.row);
            puzzleArr[idx].value = possibleSol[0];
            puzzleString = puzzleString.substr(0, idx) + possibleSol[0] + puzzleString.substr(idx + 1);
          }
        });
        missingFields = puzzleArr.filter(element => element.value === '.');
        if(missingFields.length == loopStartmissingCount) loopBreakCounter = false;
      }
      let solutionObj;
      if(missingFields.length == 0) {
        const solution = puzzleArr.map(element => element.value).join('');
        solutionObj = {solution: solution}
        return solutionObj;
      } else {
        solutionObj = {error: "Puzzle cannot be solved"}
        return solutionObj;
      }
    }
  }
  createPuzzleObjArr(puzzleString) {
    let puzzleArr = puzzleString.split('');
    puzzleArr = this.findrows(puzzleArr).puzzleObjArr;
    puzzleArr = this.findCols(puzzleArr).puzzleObjArr;
    puzzleArr = this.findRegions(puzzleArr).puzzleObjArr;
    return puzzleArr;
  }

  findrows(puzzleArr){
    let rows = {A: [], B:[], C: [], D:[], E: [], F:[], G: [], H:[], I:[]};
    let n = 0;
    for (const property in rows) {
      const slicedArr = puzzleArr.slice(9*n, 9*n +9);
      const mappedArr = slicedArr.map(element => {
        if(typeof(element) == 'object') {
          element.row = property;
          return element;
        } else{
          const obj = {
            value: element,
            row: property
          }
          return obj;
        }
      });

      rows[property] = slicedArr;
      puzzleArr.splice(9*n, 9, ...mappedArr)
      n++;
    }
    return {
      rowsObj: rows,
      puzzleObjArr: puzzleArr
    }
  }

  findCols(puzzleArr) {
    const columns = {1: [], 2:[], 3: [], 4:[], 5: [], 6:[], 7: [], 8:[], 9:[]};
    let n = 0;
    let mappedArr = [];
    for (const property in columns) {
      for(let i=0; i<9; i++){
        columns[property].push(puzzleArr[i*9 + n]);
        if(typeof(puzzleArr[i*9 + n]) == 'object') {
          mappedArr[i*9 + n] = puzzleArr[i*9 + n];
          mappedArr[i*9 + n].col = property;
        } else {
          mappedArr[i*9 + n] = {value: puzzleArr[i*9 + n], col: property}
        }
      }
      n++;
    }

    return {
      colObj: columns,
      puzzleObjArr: mappedArr
    }
  }

  findRegions(puzzleArr) {
    const regions = {a1: [], a2:[], a3: [], a4:[], a5: [], a6:[], a7: [], a8:[], a9:[]};
    let m = [0, 1, 2, 9, 10, 11, 18, 19, 20];
    let n = 0;
    for (const property in regions) {
      for(let i=0; i<3; i++){
        const slicedArr = puzzleArr.slice(i*9 + 3*m[n], 3 + i*9 + 3*m[n]);
        const mappedArr = slicedArr.map(element => {
          if(typeof(element) == 'object') {
            element.region = property;
            return element;
          } else{
            const obj = {
              value: element,
              region: property
            }
            return obj;
          }
        });
        regions[property].push(...slicedArr);
        puzzleArr.splice(i*9 + 3*m[n], 3, ...mappedArr)
      }
      n++;
    }

    return {
      regObj: regions,
      puzzleObjArr: puzzleArr
    }
  }
}

module.exports = SudokuSolver;

