((app)=>{

  app.component('settings', {
    templateUrl:'js/components/settings/settings.html',
    controller:["$stateParams", "usersService",function($stateParams, usersService){
      angular.extend(this, {
        $onInit(){

          this.editMode = false

          this.edit = ()=>{
            this.editMode = true
          }

        }
      })
    }]
  })
})(angular.module('app.settings'))
