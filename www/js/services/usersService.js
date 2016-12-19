((app) => {
  'use strict'
  app.service('usersService', ['$http', 'apiConfig', '$cookies', '$window', '$q', function($http, apiConfig, $cookies, $window, $q) {
    return {
      get() {
        return $http.get(apiConfig.baseUrl + '/api/users')
      },
      getOne(user) {
        return $http.get(apiConfig.baseUrl + '/api/users/' + user)
      },
      getPopulate(user) {
        return $http.get(apiConfig.baseUrl + '/api/users/' + user.id)
      },
      add(newUser) {
        return $http.post(apiConfig.baseUrl + '/api/users', newUser)
      },
      edit(selectedUser) {
        return $http.put(apiConfig.baseUrl + '/api/users/' + selectedUser._id, selectedUser)
      },
      delete(selectedUser) {
        return $http.delete(apiConfig.baseUrl + '/api/users/' + selectedUser._id)
      },

      connect(data) {
        return $http.post(apiConfig.baseUrl + '/api/admin', data).then((res) => {
          this.currentUser = res.data.user
          $cookies.put('token', res.data.token)
        })
      },

      disconnect() {
        return new Promise((resolve, reject) => {
          $cookies.remove("token")
          this.currentUser = null
          resolve()
        })
      },

      getCurrent() {
        let deferred = $q.defer()
        if (!$cookies.get('token')) {
          deferred.reject()
        } else {
          if (!this.currentUser) {
            let payload = $cookies.get('token').split('.')[1]
            payload = $window.atob(payload)
            payload = JSON.parse(payload)
            this.currentUser = payload._doc
            if (Math.round(new Date().getTime() / 1000) > payload.exp)
              return this.disconnect()
          }
          deferred.resolve(this.currentUser)
        }

        return deferred.promise
      }
    }
  }])
})(angular.module('app.services'))
