(function () {
  'use strict';

  angular
    .module('feeds')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('feeds', {
        abstract: true,
        url: '/feeds',
        template: '<ui-view/>'
      })
      .state('feeds.list', {
        url: '',
        templateUrl: 'modules/feeds/client/views/list-feeds.client.view.html',
        controller: 'FeedsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Feeds List'
        }
      });
  }

  /*  
  getFeed.$inject = ['$stateParams', 'FeedsService'];

  function getFeed($stateParams, FeedsService) {
    return FeedsService.get({
      feedId: $stateParams.feedId
    }).$promise;
  }


  newFeed.$inject = ['FeedsService'];

  function newFeed(FeedsService) {
    return new FeedsService();
  }
  */
  
})();
