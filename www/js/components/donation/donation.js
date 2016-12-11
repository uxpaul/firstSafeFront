((app)=>{

  app.component('donation', {
    templateUrl:'js/components/donation/donation.html',
    controller:["$stateParams","$http" ,function($stateParams, $http){
      angular.extend(this, {
        $onInit(){

        }
      })
    }]
  })
})(angular.module('app.donation'))
