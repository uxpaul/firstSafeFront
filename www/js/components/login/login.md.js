((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.login', {
      url:'/login/{userID}',
      views: {
        'menuContent': {
          template:'<login></login>'
        }
      }
    })
  }])

})(angular.module('app.login', []))
