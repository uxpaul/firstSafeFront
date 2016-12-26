((app) => {

  app.component('signup', {
    templateUrl: 'js/components/signup/signup.html',
    controller: ["$state", function($state) {
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
