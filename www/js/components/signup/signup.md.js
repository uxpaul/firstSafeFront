((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.signup', {
      url:'/signup',
      views: {
        'menuContent': {
          templateUrl:'js/components/signup/signup.html'
        }
      }
    })
  }])

})(angular.module('app.signup', []))
