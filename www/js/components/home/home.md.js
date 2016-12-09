((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.home', {
      url: '/home/:id',
      views: {
        'menuContent': {
          template: '<home></home>'
        }
      }
    })
  }])

})(angular.module('app.home', []))
