((app)=>{

  app.component('marker', {
    templateUrl:'js/components/home/markermodal.html',
    controller:["$stateParams","$http" ,function($stateParams, $http){
      angular.extend(this, {
        $onInit(){

          $http.get('users.json').then((res)=>{
            this.users = res.data

          let id = $stateParams.userID

          this.users.forEach((user)=>{
            if(user.id === id)
            this.user = user

          })


            })

        }
      })
    }]
  })
})(angular.module('app.marker'))
