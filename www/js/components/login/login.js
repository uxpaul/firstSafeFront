((app) => {

  app.component('login', {
    templateUrl: 'js/components/login/login.html',
    controller: ["$stateParams", "$http", "$state", "$timeout","$scope", function($stateParams, $http, $state, $timeout, $scope) {
      angular.extend(this, {
        $onInit() {

          this.loginData = {};


        },
        // Perform the login action when the user submits the login form
        doLogin() {
          console.log('Doing login', this.loginData);

          $state.go('app.home', {
            id: this.loginData.username
          })

         }

      })
    }]
  })
})(angular.module('app.login'))
