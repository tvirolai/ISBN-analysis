/* jshint node: true */

module.exports = (function() {
  'use strict';

  function validateByDigit(input) {
    var checkDigit = '';
    if (input.length === 10) {
      checkDigit = returnISBN10CheckDigit(input);
    } else if (input.length === 13) {
      checkDigit = returnISBN13CheckDigit(input);
    }
    // Debug : console.log(checkDigit + ' : ' + input);
    return checkDigit == input.slice(input.length - 1).toUpperCase();
  }

  function returnISBN10CheckDigit(input) {
    var checkDigit = 0;
    var modulo = 0;
    //var code = input.slice(3, input.length - 1);
    var code = input.split('');
    code.pop();
    for (var i = 0; i < code.length; i++) {
      modulo += (10 - i) * code[i];
    }
    checkDigit = 11 - (modulo % 11);
    if (checkDigit > 10) {
      checkDigit = checkDigit % 11;
    }
    if (checkDigit === 10) {
      checkDigit = 'X';
    }
    return checkDigit.toString();
  }

  function returnISBN13CheckDigit(input) {
    
    var checkDigit = 0;
    input = input.toString();
    input = input.split('');
    input.pop();
    for (var i = 0; i < input.length; i++) {
      var number = Number(input[i]);
      if (i % 2 === 0) {
        checkDigit += number * 1;
      } else {
        checkDigit += number * 3;
      }
    }
    checkDigit = 10 - (((checkDigit / 10) % 1).toFixed(1) * 10);
    if (checkDigit === 10) { checkDigit = 0; }
    return checkDigit.toString();
  }

  return {
    validate: function (isbn) {
      return validateByDigit(isbn);
    }
  };
})();