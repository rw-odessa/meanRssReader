(function () {
  'use strict';

  angular
    .module('feeds')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'RSS',
      state: 'feeds',
      type: 'dropdown',
      roles: ['admin', 'user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'feeds', {
      title: 'RSS - каналы',
      state: 'feeds.list',
      roles: ['user']
    });

  }
})();
