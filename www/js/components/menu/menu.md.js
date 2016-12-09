((app) => {

  app.component('menu', {
    templateUrl: 'js/components/menu/menu.html',
    controller: ['$scope', '$ionicModal', '$timeout','$state', function($scope, $ionicModal, $timeout, $state) {

      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});

      this.loginData = {};

      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('js/components/login/login.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeLogin = function() {
        $scope.modal.hide();
      };

      // Open the login modal
      this.login = function() {
        $scope.modal.show();
      };

      
      // Perform the login action when the user submits the login form
      this.doLogin = ()=> {
        console.log('Doing login', this.loginData);

        $state.go('app.home', {
          id: this.loginData.username
        })

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(()=> {
          $scope.closeLogin();
        }, 1000);
      }


    }]
  })

})(angular.module('app.menu', []))
