((app) => {
    'use strict'
    app.service('usersService', function($http, apiConfig) {
    return {
        get() {
            return $http.get(apiConfig.baseUrl + '/api/users')
        },
        getPopulate(user) {
            return $http.get(apiConfig.baseUrl + '/api/users/'+ user.id)
        },
        add(newUser) {
            return $http.post(apiConfig.baseUrl + '/api/users', newUser)
        },
        edit(selectedUser) {
            return $http.put(apiConfig.baseUrl + '/api/users/' + selectedUser._id, selectedUser)
        },
        delete(selectedUser) {
            return $http.delete(apiConfig.baseUrl + '/api/users/' + selectedUser._id)
        }
    }
    })
})(angular.module('app.services'))
