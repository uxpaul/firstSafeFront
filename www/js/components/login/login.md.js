((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.login', {
      url:'/login',
      views: {
        'menuContent': {
          templateUrl:'js/components/login/login.html'
        }
      }
    })
  }])

})(angular.module('app.login', []))
