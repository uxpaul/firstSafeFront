((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          template: '<home></home>'
        }
      }
    })
  }])

})(angular.module('app.home', []))
