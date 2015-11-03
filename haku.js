/* jshint node: true */
'use strict';

var file = process.argv[2];
var readline = require('readline');
var fs = require('fs');
// var serialOrMonograph = require('./serialOrMonograph.js');

if (!file) {
  console.log('Usage: node haku.js inputfile');
  process.exit();
} else {
  var dirStuff = fs.readdirSync('./output/');
  if (dirStuff.length > 0) {
    console.log('Output directory (' + __dirname + '/output)' + ' not empty, aborting.');
    process.exit();
  }
}

var isbnChecker = require('./lib/isbnChecker.js');
var processLine = require('./lib/processLine.js');

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