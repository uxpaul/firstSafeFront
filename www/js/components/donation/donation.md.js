((app)=>{

  app.config(['$stateProvider', ($stateProvider)=>{
    $stateProvider.state('app.donation', {
      url: '/donation/:id',
      views: {
        'menuContent': {
          templateUrl: 'js/components/donation/donation.html'
        }
      }
    })
  }])

})(angular.module('app.donation', []))
