((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.marker', {
      url:'/home/{userID}',
      views: {
        'menuContent': {
          template:'<marker></marker>'
        }
      }
    })
  }])

})(angular.module('app.marker', []))
