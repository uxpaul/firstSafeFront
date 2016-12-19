((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          //templateUrl: 'js/components/home/home.html'
         template: '<home></home>'
        }
      }
    })
  }])

})(angular.module('app.home', []))
