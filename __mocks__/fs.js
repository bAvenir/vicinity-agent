const fs = jest.genMockFromModule('fs');

function readFile(a, b, cb) {
    cb(false, [{'a': 1}, {'b': 2}]);
}

function writeFile(a, b, c, cb) {
    cb(false);
}

fs.readFile = readFile;
fs.writeFile = writeFile;

module.exports = fs;