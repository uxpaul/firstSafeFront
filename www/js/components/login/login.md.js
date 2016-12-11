((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.login', {
      url:'/login',
      views: {
        'menuContent': {
         template:'<login></login>',
        //templateUrl: 'js/components/login/login.html'

        }
      }
    })
  }])

})(angular.module('app.login', []))
