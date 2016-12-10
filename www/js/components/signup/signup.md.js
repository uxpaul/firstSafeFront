((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.signup', {
      url:'/signup',
      views: {
        'menuContent': {
          template:'<signup></signup>'
        }
      }
    })
  }])

})(angular.module('app.signup', []))
