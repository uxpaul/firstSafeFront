((app) => {
  app.constant('apiConfig', {
  //baseUrl:'http://localhost:8000'
 baseUrl: 'https://firstsafe.herokuapp.com',
  //baseUrl : 'https://savefirst.herokuapp.com'
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
  'ionic',
  'ngCookies',
  'btford.socket-io',
  'ngCordova',
  'app.services',
  'app.home',
  'app.login',
  'app.menu',
  'app.marker',
  'app.signup',
  'app.donation',
  'app.settings'


]))
