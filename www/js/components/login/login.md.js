((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.login', {
      url:'/login',
      views: {
        'menuContent': {
          template:'<login></login>'
        }
      }
    })
  }])

})(angular.module('app.login', []))
