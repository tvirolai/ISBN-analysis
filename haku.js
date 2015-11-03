/* jshint node: true */
'use strict';

var file = process.argv[2];
var readline = require('readline');
var fs = require('fs');
// var serialOrMonograph = require('./serialOrMonograph.js');
var isbnChecker = require('./lib/isbnChecker.js');

var processLine = require('./lib/processLine.js');

if (!file) {
  console.log('Usage: node haku.js inputfile');
  process.exit();
}

var rl = readline.createInterface({
  input: fs.createReadStream(file)
});

rl.on('line', function (line) {
  if (processLine.containsISBN(line)) {
    isbnChecker.input(line);
  }

});

rl.on('close', function () {
  var stats = isbnChecker.returnStats();
  console.log(stats);
});