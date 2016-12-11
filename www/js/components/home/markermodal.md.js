((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.marker', {
      url:'/home/{userID}',
      views: {
        'menuContent': {
          templateUrl:'js/components/home/markermodal.html'
        }
      }
    })
  }])

})(angular.module('app.marker', []))
