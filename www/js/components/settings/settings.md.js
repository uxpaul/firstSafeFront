((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.settings', {
      url: '/settings/:id',
      views: {
        'menuContent': {
          templateUrl: 'js/components/settings/settings.html'
        }
      }
    })
  }])

})(angular.module('app.settings', []))
