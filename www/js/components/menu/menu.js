((app)=>{
  'use strict'
  app.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider)=>{
    $urlRouterProvider.otherwise('/')
    $stateProvider.state('app', {
    url: '',
    abstract: true,
    template: '<menu></menu>',

    })
  }])
})(angular.module('app.menu'))
