((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.login', {
      url:'/home/{userID}',
      views: {
        'menuContent': {
          template:'<login></login>'
        }
      }
    })
  }])

})(angular.module('app.login', []))
