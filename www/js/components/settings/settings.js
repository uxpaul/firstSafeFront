((app)=>{

  app.component('settings', {
    templateUrl:'js/components/settings/settings.html',
    controller:["$stateParams", "usersService", "apiConfig",function($stateParams, usersService, apiConfig){
      angular.extend(this, {
        $onInit(){

          this.editMode = false
          let socket = io(apiConfig.baseUrl + '/iller');


          this.edit = ()=>{
            if(this.editMode)
            this.editMode = false
            else {
              this.editMode = true
            }

          }

        }
      })
    }]
  })
})(angular.module('app.settings'))
