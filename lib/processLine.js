/* jshint node: true */

module.exports = (function () {
  'use strict';
  return {
    containsISBN: function (line) {
      var id = line.slice(0,9);
      var field = line.slice(10,13);
      var content = line.slice(18);
      if (field === '020') {
        return true;
      } else if (field === '776') {
        content = content.split('$$');
        content.forEach(function (field) {
          if (field.slice(0,1) === 'z') {
            return true;
          }
        });
      } else {
        return false;
      }
    }
  };
})();