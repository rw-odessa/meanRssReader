(function () {
  'use strict';

  describe('Feeds Route Tests -', function () {
    // Initialize global variables
    var $scope,
      FeedsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FeedsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FeedsService = _FeedsService_;
    }));
    describe('Route Config -', function () {

      describe('Main Route -', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('feeds');
          //console.log('mainstate -' + mainstate);
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/feeds');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route -', function () {
        var viewstate,
          FeedsListController,
          mockFeed;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('feeds.list');
          
          //console.log('viewstate.url - ' + viewstate.url);
          $templateCache.put('modules/feeds/client/views/list-feeds.client.view.html', '');

          // create mock Feed
          mockFeed = new FeedsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Feed Name',
            url:  'Feed URL'
          });

          //Initialize Controller
          FeedsListController = $controller('FeedsListController as vm', {
            $scope: $scope,
            feedResolve: mockFeed
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('');
        });

        
        xit('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.feedResolve).toEqual('function');
        });
        

        xit('should attach an Feed to the controller scope', function () {
          expect($scope.feeds).toBe([mockFeed]);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/feeds/client/views/list-feeds.client.view.html');
        });
      });

    });
  });
})();
