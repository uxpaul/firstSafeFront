((app) => {

  app.component('login', {
    templateUrl: 'js/components/login/login.html',
    controller: ["$ionicModal", "$scope", "$state", "usersService", function($ionicModal, $scope, $state, usersService) {


      this.closeSignup = false;
      // Create the signup modal that we will use later
      $ionicModal.fromTemplateUrl('js/components/signup/signup.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      // Triggered in the signup modal to close it
      $scope.closeSignup = function() {
        $scope.modal.hide();
      };

      // Open the signup modal
      this.signup = function() {
        $scope.modal.show();
      };
      angular.extend(this, {
        $onInit() {

          this.loginData = {};

        },
        // Perform the login action when the user submits the login form
        doLogin() {
          console.log('Doing login', this.loginData);
          usersService.connect(this.loginData).then((res) => {
            $state.go('app.home')
          })

        },
        doSignup(newUser) {
          usersService.add(newUser).then((res) => {
            this.newUser = res.data
            console.log(this.newUser)
          })
          this.close = true
        }


      })
    }]
  })
})(angular.module('app.login'))
