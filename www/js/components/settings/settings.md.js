((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.settings', {
      url: '/settings/:id',
      views: {
        'menuContent': {
          template: '<settings></settings>'
          //templateUrl: 'js/components/settings/settings.html'
        }
      }
    })
  }])

})(angular.module('app.settings', []))
