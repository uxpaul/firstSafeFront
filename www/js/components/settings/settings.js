((app)=>{

  app.component('settings', {
    templateUrl:'js/components/settings/settings.html',
    controller:["$stateParams", "usersService",function($stateParams, usersService){
      angular.extend(this, {
        $onInit(){

          this.editMode = false


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
