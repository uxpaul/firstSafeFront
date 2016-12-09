((app) => {
    'use strict'
    app.service('aidProvidersService', function($http, apiConfig) {
    return {
        get() {
            return $http.get(apiConfig.baseUrl + '/api/providers')
        },
        get(id){
          return $ctrl.get(apiConfig.baseUrl +'api/providers/'+ id)
        },
        add(newArticle) {
            return $http.post(apiConfig.baseUrl + '/api/providers', newArticle)
        },
        edit(selectedArticle) {
            return $http.put(apiConfig.baseUrl + '/api/providers/' + selectedArticle._id, selectedArticle)
        },
        delete(selectedArticle) {
            return $http.delete(apiConfig.baseUrl + '/api/providers/' + selectedArticle._id)
        }
    }
    })
})(angular.module('app.services'))
