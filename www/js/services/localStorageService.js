(function(app) {
  'use strict';
  app.service('LocalStorageService', function($window) {
    var self = this;

    self.set = function(key, value) {
      $window.localStorage[key] = value;
    };

    self.get = function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    };

    self.remove = function(key) {
      $window.localStorage.removeItem(key);
    };

    self.setObject = function(key, value) {
      self.set(key, JSON.stringify(value));
    };

    self.getObject = function(key) {
      var value = self.get(key);
      if (value) {
        return JSON.parse(value);
      }
      return undefined;
    };

    self.removeObject = function(key) {
      self.remove(key);
    };
  });

})(angular.module('app.services'));
