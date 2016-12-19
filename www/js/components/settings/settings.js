((app) => {

  app.component('settings', {
    templateUrl: 'js/components/settings/settings.html',
    controller: ["usersService","$scope", function(usersService, $scope) {
      angular.extend(this, {
        $onInit() {

          let _previous = {}

          usersService.getCurrent().then((res) => {
          this.user = res
            //this.user(res)
          })


          this.edit = (user) => {
            if (this.editMode) {
              usersService.edit(user).then((res) => {
                this.user = res.config.data
                this.editMode = false
              })

            } else {
              _previous[user._id] = angular.copy(this.user)
              this.editMode = true
            }
          }


          this.cancel = (user)=>{
            this.user = _previous[user._id]
            this.editMode = false
          }

        }

      })
    }]
  })
})(angular.module('app.settings'))
