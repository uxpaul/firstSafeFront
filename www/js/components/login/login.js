((app)=>{

  app.component('login', {
    templateUrl:'js/components/login/login.html',
    controller:["$stateParams","$http" ,function($stateParams, $http){
      angular.extend(this, {
        $onInit(){



        }
      })
    }]
  })
})(angular.module('app.login'))
