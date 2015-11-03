/* jshint node: true */

// Moduuli:
// 1. ottaa syötteenä rivin Aleph Sequential -tiedostoa, jossa on ISBN-tunnus
// 2. erittelee ISBN-tunnuksen niistä
// 3. ISBN-tunnuksesta katsotaan:
//  - Onko kyseessä validi ISBN. Jos ei, tallennetaan muistiin tietuenro ja ISBN
//  - Onko siinä väliviivat. Jos ei, tallennetaan muistiin tietuenro, alkuperäinen ISBN ja korjattu ISBN
//  - Onko maakoodi sama kuin 008-kenttään kirjattu. Jos ei, tallennetaan muistiin tietuenro ja tiedot

module.exports = (function() {
  'use strict';
  //var isbn = require('isbn-utils');
  var validator = require('./validateByCheckDigit.js');
  var fs = require('fs');

  var stats = {
    'containsSuffix': 0,
    'invalidLength': 0,
    'invalidIsbn': 0,
    'notHyphenated': 0,
    'containsInvalidCharacters': 0
  };

  // Output: write (stream) found invalid ISBNs with record id's to CSV files

  var invalidLength = fs.createWriteStream('./output/invalidLength.csv', { flags : 'w' });
  var hasSuffix = fs.createWriteStream('./output/containsSuffix.csv', { flags : 'w' });
  var invalidIsbn = fs.createWriteStream('./output/invalidIsbn.csv', { flags : 'w' });
  var notHyphenated = fs.createWriteStream('./output/notHyphenated.csv', { flags : 'w' });
  var containsInvalidCharacters = fs.createWriteStream('./output/containsInvalidCharacters.csv', { flags : 'w' });

  var isbnRegex = /[^0-9-Xx]/g;

  function runTests(id, input) {
    // Check if ISBN has suffix 230492034 : (sid.) etc.
    if (containsSuffix(input)) { hasSuffix.write(id + ',' + input + '\n'); ++stats.containsSuffix; }
    input = stripSuffix(input);
    if (!isCorrentLength(input)) { invalidLength.write(id + ',' + input + '\n'); ++stats.invalidLength; }

    if (isCorrentLength(input) && !containsInvalidChars(input) && !isValidISBN(input)) { invalidIsbn.write(id + ',' + input + '\n'); ++stats.invalidIsbn; }
    if (isCorrentLength(input) && !isHyphenated(input)) { notHyphenated.write(id + ',' + input + '\n'); ++stats.notHyphenated; }
    if (isCorrentLength(input) && containsInvalidChars(input)) { containsInvalidCharacters.write(id + ',' + input + '\n'); ++stats.containsInvalidCharacters; }
  }

  function isCorrentLength(input) {
    return (toNumbers(input).length === 10 || toNumbers(input).length === 13);
  }

  function containsSuffix(input) {
    return (input.split(' ').length > 1);
  }

  function stripSuffix(input) {
    return input.split(' ')[0];
  }

  function containsInvalidChars(input) {
    return isbnRegex.test(input);
  }

  function isValidISBN(input) {
    return validator.validate(toNumbers(input));
  }

  function toNumbers(input) {
    return input.replace(/-/g, '').trim();
  }

  function isHyphenated(input) {
    return (input.indexOf('-') > -1);
  }

  return {
    input: function (line) {
      var splitLine = line.split('$$');
      var aContent = '';
      var id = splitLine[0].split(' ')[0].trim();
      splitLine.forEach(function(item) {
        if (item.slice(0,1) === 'a') {
          aContent = item.slice(1).trim();
          runTests(id, aContent);
        }
      });
    },
    returnStats: function () {
      return stats;
    }
  };
})();