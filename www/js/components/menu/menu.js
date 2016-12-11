((app) => {
  'use strict'
  app.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/app/login')
    $stateProvider.state('app', {
      url: '/app',
      abstract: true,
      template: '<menu></menu>'
    })
  }])
})(angular.module('app.menu'))
