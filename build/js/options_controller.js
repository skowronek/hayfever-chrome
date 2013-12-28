// Generated by CoffeeScript 1.6.3
/*
Hayfever for Chrome
Options Page Controller

by Mike Green (mike.is.green@gmail.com)
*/


(function() {
  var app, options_controller;

  app = angular.module('hayfeverOptions', ['ui']);

  options_controller = function($scope) {
    var bg_app, bg_page, option_keys, storage;
    bg_page = chrome.extension.getBackgroundPage();
    bg_app = bg_page.application;
    storage = chrome.storage.local;
    option_keys = ['harvest_subdomain', 'harvest_username', 'harvest_auth_string', 'hayfever_prefs'];
    storage.get(option_keys, function(items) {
      $scope.subdomain = items.harvest_subdomain;
      $scope.username = items.harvest_username;
      $scope.auth_string = items.harvest_auth_string;
      $scope.preferences = items.hayfever_prefs || {
        badge_display: 'total',
        badge_format: 'clock',
        badge_color: '#207aac'
      };
      return $scope.$apply();
    });
    return $scope.save_options = function() {
      var options;
      options = {
        harvest_subdomain: $scope.subdomain,
        harvest_username: $scope.username,
        hayfever_prefs: $scope.preferences
      };
      if ($scope.username && $scope.password) {
        options.harvest_auth_string = btoa("" + $scope.username + ":" + $scope.password);
      }
      return storage.set(options, function() {
        $scope.password = null;
        $scope.options_saved = true;
        $scope.auth_string = options.harvest_auth_string;
        bg_page.location.reload();
        if (!bg_page.application.refresh_interval) {
          bg_page.application.start_refresh_interval();
        }
        $scope.$apply();
        return scrollTo(0, 0);
      });
    };
  };

  app.controller('OptionsController', ['$scope', options_controller]);

}).call(this);

/*
//@ sourceMappingURL=options_controller.map
*/
