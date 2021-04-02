const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    suite('POST requests to /api/solve', () => {

        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
            chai
              .request(server)
              .post("/api/solve")
              .send({"puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                console.log(res.body)
                assert.isObject(res.body);
                assert.property(res.body, "solution");
                assert.notProperty(res.body, "error");
                done();
            });
        });

        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
            chai
              .request(server)
              .post("/api/solve")
              .send({"puzzle": ""})
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.deepEqual(res.body, { "error": "Required field missing" });
                done();
            });
        });

        test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
            chai
              .request(server)
              .post("/api/solve")
              .send({"puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......494..*..4.37.4.3..6.."})
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.deepEqual(res.body, { "error": "Invalid characters in puzzle" });
                done();
            });
        });

        test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
            chai
              .request(server)
              .post("/api/solve")
              .send({"puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6."})
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.deepEqual(res.body, { "error": "Expected puzzle to be 81 characters long" });
                done();
            });
        });

        test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
            chai
              .request(server)
              .post("/api/solve")
              .send({"puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...3......1945....4.37.4.3..6.."})
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.deepEqual(res.body, { "error": "Puzzle cannot be solved" });
                done();
            });
        });

    });

    suite('POST requests to /api/check', () => {

        test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({
                  "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                  "coordinate": "a2",
                  "value": "7"
                })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.deepEqual(res.body, { "valid": true });
                done();
            });
        });

        test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({
                  "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                  "coordinate": "A2",
                  "value": "8"
                })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.deepEqual(res.body, { "valid": false, "conflict": [ "region" ] });
                done();
            });
        });

        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({
                  "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                  "coordinate": "A2",
                  "value": "2"
                })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.deepEqual(res.body, { "valid": false, "conflict": [ "column", "region" ] });
                done();
            });
        });

        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({
                  "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                  "coordinate": "F8",
                  "value": "9"
                })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.deepEqual(res.body, { "valid": false, "conflict": [ "row", "column", "region" ] });
                done();
            });
        });

        test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({
                  "puzzle": "",
                  "coordinate": "A2",
                  "value": "1"
                })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.deepEqual(res.body, { "error": "Required field(s) missing" });
                done();
            });
        });

        test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({
                  "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6%.",
                  "coordinate": "A2",
                  "value": "2"
                })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.deepEqual(res.body, { "error": "Invalid characters in puzzle" });
                done();
            });
        });

        test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({
                  "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.",
                  "coordinate": "A2",
                  "value": "2"
                })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.deepEqual(res.body, { "error": "Expected puzzle to be 81 characters long" });
                done();
            });
        });

        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({
                  "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                  "coordinate": "A10",
                  "value": "2"
                })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.deepEqual(res.body, { "error": "Invalid coordinate" });
                done();
            });
        });

        test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
            chai
              .request(server)
              .post("/api/check")
              .send({
                  "puzzle": "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                  "coordinate": "A2",
                  "value": "0"
                })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.deepEqual(res.body, { "error": "Invalid value" });
                done();
            });
        });

    });

});

