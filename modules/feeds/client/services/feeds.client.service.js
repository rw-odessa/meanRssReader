//Feeds service used to communicate Feeds REST endpoints
(function () {
  'use strict';

  angular
  .module('feeds')
  .factory('FeedsService', FeedsService)
  .factory('FeedLoader', FeedLoader)
  .factory('AuthorCount', AuthorCount)
  .factory('LetterCount', LetterCount);

  FeedsService.$inject = ['$resource'];
  FeedLoader.$inject = ['$resource'];

  function FeedsService($resource) {
    return $resource('api/feeds/:feedId', {
      feedId : '@_id'
    }, {
      update : {
        method : 'PUT'
      }
    });
  }

  function FeedLoader($resource) {
    return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
      fetch : {
        method : 'JSONP',
        params : {
          v : '1.0',
          callback : 'JSON_CALLBACK'
        }
      }
    });
  }

  function AuthorCount() {
    return function (entries) {
      //console.log(entries);
      var AuthorCountObj = {}; // Object.create(null);
      for (var i = 0; i < entries.length; i++) {
        AuthorCountObj[entries[i].author] = 1;
        //console.log(entries[i].author);
      }
      i = 0;
      for (var author in AuthorCountObj) i++;
      //console.log(AuthorCountObj);
      return i;
    };
  }

  function LetterCount() {
    return function (msgStr) {
      var str = msgStr.toLowerCase();
      var letterCountObj = {};
      var letterAllowed = {
        'a' : 1,
        'b' : 1,
        'c' : 1,
        'd' : 1,
        'e' : 1,
        'f' : 1,
        'g' : 1,
        'h' : 1,
        'i' : 1,
        'k' : 1,
        'l' : 1,
        'm' : 1,
        'n' : 1,
        'o' : 1,
        'p' : 1,
        'q' : 1,
        'r' : 1,
        's' : 1,
        't' : 1,
        'v' : 1,
        'x' : 1,
        'y' : 1,
        'z' : 1,
        'а' : 1,
        'б' : 1,
        'в' : 1,
        'г' : 1,
        'д' : 1,
        'е' : 1,
        'ё' : 1,
        'ж' : 1,
        'з' : 1,
        'и' : 1,
        'й' : 1,
        'к' : 1,
        'л' : 1,
        'м' : 1,
        'н' : 1,
        'о' : 1,
        'п' : 1,
        'р' : 1,
        'с' : 1,
        'т' : 1,
        'у' : 1,
        'ф' : 1,
        'х' : 1,
        'ц' : 1,
        'ч' : 1,
        'ш' : 1,
        'щ' : 1,
        'ъ' : 1,
        'ы' : 1,
        'ь' : 1,
        'э' : 1,
        'ю' : 1,
        'я' : 1,
        'ґ' : 1,
        'є' : 1,
        'і' : 1,
        'ї' : 1
      };
      for (var i = 0; i < str.length; i++) {
        if (!(str[i] in letterAllowed))
          continue;
        if (str[i] in letterCountObj) {
          letterCountObj[str[i]]++;
        } else {
          letterCountObj[str[i]] = 1;
        }
      }

      var chartObjectRows = [];
      var letterCountObjKeys = Object.keys(letterCountObj);
      for (i = 0; i < letterCountObjKeys.length; i++) {
        chartObjectRows.push([letterCountObjKeys[i], letterCountObj[letterCountObjKeys[i]]]);
      }
      return chartObjectRows;
    };
  }

})();
