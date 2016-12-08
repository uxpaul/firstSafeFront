((app) => {
  app.constant('apiConfig', {
    baseUrl:'http://localhost:8000'
  })
  .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });
    })

})(angular.module('app', [
  'btford.socket-io',
  'ionic',
  'ngCordova',
  'app.services',
  'app.home',
  'app.login',
  'app.menu',
  'app.marker'


]))
