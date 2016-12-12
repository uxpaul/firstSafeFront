(function(app) {
  'use strict';
  app.service('UsersService', function($http, $q, apiConfig, LocalStorageService) {
    var self = this;
    self.baseUrl = apiConfig.baseUrl + '/users/';
    console.log(self.baseUrl)
    const TOKEN = 'token';
    const USER = 'user';

    self.connect = function(signin) {
      var deferred = $q.defer();
      $http.post(apiConfig.baseUrl + '/api/users', signin).then(function(res) {
        var auth = res.data;
        self.__cacheAuth(auth.token, auth.user);
        deferred.resolve(auth.user);
      }).catch(function() {
        deferred.reject();
      });
      return deferred.promise;
      console.log(deferred.promise)
    };

    self.__cacheAuth = function(token, user) {
      self.__cache(TOKEN, token);
      self.__cache(USER, user);
    };

    self.__cache = function(key, data){
      LocalStorageService.set(key, data);
    };

  });

})(angular.module('app.services'));
