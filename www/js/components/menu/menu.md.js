((app) => {

  app.component('menu', {
    templateUrl: 'js/components/menu/menu.html',
    controller: ['$timeout', '$state','apiConfig' ,'usersService', function($timeout, $state, apiConfig, usersService) {

      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});
      let socket = io(apiConfig.baseUrl + '/iller');

      this.logout = () => {
        socket.emit('disconnect me')

        usersService.disconnect().then((res)=>{
          $state.go('app.login')
          $state.reload()
        })
      }
    }]
  })

})(angular.module('app.menu', []))
