((app) => {
    'use strict'
    app.service('aidReceiversService', function($http, apiConfig) {
    return {
        get() {
            return $http.get(apiConfig.baseUrl + '/api/receivers')
        },
        add(newUser) {
            return $http.post(apiConfig.baseUrl + '/api/receivers', newUser)
        },
        edit(selectedUser) {
            return $http.put(apiConfig.baseUrl + '/api/receivers/' + selectedUser._id, selectedUser)
        },
        delete(selectedUser) {
            return $http.delete(apiConfig.baseUrl + '/api/receivers/' + selectedUser._id)
        }
    }
    })
})(angular.module('app.services'))
