((app) => {

  app.component('signup', {
    templateUrl: 'js/components/signup/signup.html',
    controller: ["$stateParams", "$state", "$timeout", function($stateParams, $http, $state, $timeout) {
      angular.extend(this, {
        $onInit() {

          this.signupData = {};

          
        },
        // Perform the signup action when the user submits the signup form
        doSignup() {
          console.log('Doing signup', this.signupData);

          $state.go('app.home', {
            id: this.signupData.username
          })

        }

      })
    }]
  })
})(angular.module('app.signup'))
