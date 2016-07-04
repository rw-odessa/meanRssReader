(function () {
  'use strict';

  angular
  .module('feeds')
  .controller('FeedsListController', FeedsListController);

  FeedsListController.$inject = ['FeedsService', '$scope', 'Authentication', '$location', 'FeedLoader', 'AuthorCount', 'LetterCount', '$sce'];

  function FeedsListController(FeedsService, $scope, Authentication, $location, FeedLoader, AuthorCount, LetterCount, $sce) {

    $scope.authentication = Authentication;
    //$scope.showContent = false;

    $scope.find = function () {
      $scope.feeds = FeedsService.query();
      //console.log($scope.feeds);
    };

    $scope.addCannel = function (isValid) {
      $scope.error = null;

      //console.log($scope.feedForm);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'feedForm');
        return false;
      }

      // Create new Feed object
      var feed = new FeedsService({
        name : this.nameChannel,
        url : this.urlChannel
      });
      //console.log(feed);

      //save Feed
      feed.$save(function (response) {
        $scope.find();

        // Clear form fields
        $scope.nameChannel = '';
        $scope.urlChannel = '';

      }, function (errorResponse) {
        //console.log(errorResponse);
        $scope.error = errorResponse.data.message;
      });

    };

    // Update existing rssCannel
    $scope.updateCannel = function (feed) {

      if (feed) {
        feed.$update(function () {
          $scope.find();
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };

    $scope.delCannel = function (feed) {
      
      if (!confirm('Удалить ленту новостей ' + feed.name + '?')) {
        return;
      }
      
      if (feed) {
        feed.$remove();

        for (var i in $scope.feeds) {
          if ($scope.feeds[i] === feed) {
            $scope.feeds.splice(i, 1);
          }
        }
      }
    };

    $scope.show = function (feed) {
      
      $scope.feedName = '';
      $scope.entries = '';
      $scope.AuthorCount = '';
      
      if (feed) {
        $scope.feedName = feed.name;
        FeedLoader.fetch({
          q : feed.url,
          num : 20
        }, {}, function (data) {
          $scope.entries = data.responseData.feed.entries;
          $scope.AuthorCount = AuthorCount($scope.entries);
          //console.log(data);
        });
      }
      //console.log(feed);
    };

    $scope.ShowItem = function (item) {
      $scope.author = item.author;
      //var content = $sce.trustAsHtml(item.content);
      //$scope.content = content;
      $scope.content = $sce.trustAsHtml(item.content);
      //console.log('$scope.showContent - ' + $scope.showContent);

      //$scope.contentDate = new Date(date.parce(item.publishedDate));
      
      /*
      var options = {
        era: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      };
      
      console.log(Date.parse(item.publishedDate).toLocaleString("ru", options));
      */
      
      $scope.chartObject = {
        'type' : 'PieChart',
        'displayed' : false,
        'data' : [['letter', 'count']].concat(LetterCount(item.content)),
        'options' : {
          displayExactValues : true,
          width : 600,
          height : 300,
          is3D : true,
          chartArea : {
            left : 10,
            top : 10,
            bottom : 0,
            height : '100%'
          }
        }
      };
    };

    $scope.ShowItemLocal = function (item) {
      return $sce.trustAsHtml(item.content);
    };
    
    $scope.LocaleDate = function (publishedDate) {
      //console.log(item);
      var articleDate;
      if (!publishedDate) {
        articleDate = new Date();
      } else {
        articleDate = new Date(publishedDate);
      }
      return articleDate.toLocaleDateString() + " " + articleDate.toLocaleTimeString();
    };
  }
})();
