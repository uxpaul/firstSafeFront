((app) => {

  app.component('home', {
    templateUrl: 'js/components/home/home.html',
    controller: ["aidReceiversService", "usersService", "$compile", "$scope", "$http", "$stateParams", "apiConfig", function(aidReceiversService, usersService, $compile, $scope, $http, $stateParams, apiConfig) {
      let identification = "584a2d959c4d490e50b0478e" + "58497190c833f097d5872e8e"
      let prov = "584a2de49c4d490e50b04791"
      let socket = io(apiConfig.baseUrl + '/iller');
      this.show;
      this.reply;
      socket.on('stats', (data) => console.log('Connected clients:', data.numClients))

      // Test
      socket.on('hi', (message) => console.log(message))
        // Uniquement le(s) medecin(s) reçoit le(s) message(s) de secours
      socket.on('emergency', (message) => {
        debugger
        message.user.lat
        message.user.lng
        this.calculateDistances(message.user)
        this.emergency(message)
      })
        // A la confirmation du medecin ...
      socket.on('accept',(user) => {

        user.lat
        user.lng
        this.calculateDistances(user)
        this.acceptHelp(user)

      })

      usersService.getPopulate($stateParams).then((res) => {
        this.user = res.data
        socket.emit('user', this.user.situation)
        this.show = (this.user.situation === "aidReceiver" ? true : false)

      })



      angular.extend(this, {
        $onInit() {

          let options = {
            // maximumAge: 3000,
            // timeout: 15000,
            enableHighAccuracy: true
          };
          let icon = {
            url: "img/ionic.png",
            scaledSize: new google.maps.Size(20, 20)
          }
          let origin;
          let destinations;
          let directionsService = new google.maps.DirectionsService();
          let directionsDisplay = new google.maps.DirectionsRenderer();
          let geocoder = new google.maps.Geocoder();

          this.calculateDistances = (destination) => {
            destinations = [destination]
            let service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
              origins: [origin], //array of origins
              destinations: destinations, //array of destinations
              travelMode: google.maps.TravelMode.WALKING,
              unitSystem: google.maps.UnitSystem.METRIC,
              avoidHighways: false,
              avoidTolls: false
            }, (response, status) => {
              if (status != google.maps.DistanceMatrixStatus.OK) {
                alert('Error was: ' + status);
              } else {
                //we only have one origin so there should only be one row
                let routes = response.rows[0].elements;
                let tmp = routes[0].duration.text;
                let resultText = `Position : ${response.destinationAddresses[0]}.<br> Temps prévu : ${tmp} <br/>`;

                document.getElementById("results").innerHTML = resultText;

                  //map the route
                let request = {
                  origin: origin,
                  destination: destinations[0],
                  travelMode: google.maps.TravelMode.DRIVING
                };

                // Display route in blue line
                directionsService.route(request, (result, status) => {
                  if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);
                  }
                });
              }

            })
          }

          // Get current position
          let onSuccess = (position) => {
            origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            let mapOptions = {
              center: origin,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            let map = new google.maps.Map(document.getElementById('map'), mapOptions);

            let marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: origin,
              icon: icon
            });

            let circle = new google.maps.Circle({
              map: map,
              radius: 200,
              scale: 200.0,
              strokeOpacity: 0.5,
              strokeWeight: 2,
              fillColor: '#02B875',
              strokeColor: '#3D9970'
            });

            circle.bindTo('center', marker, 'position'); //This will set the circle bound to the marker at center
            // user.lat = position.coords.latitude
            // user.long = position.coords.longitude

            this.markers(map)
            directionsDisplay.setMap(map);
          //  debugger
          }

          let onError = (error)=> {
            console.log("Could not get location");
          };

          // Get current position
          navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
          navigator.geolocation.watchPosition(onSuccess, onError, options);

        },

        // Create markers
        markers(map) {
          usersService.get().then((res) => {
            this.users = res.data.forEach((user) => {
              if (user.situation === "aidReceiver") {
                let latLng = new google.maps.LatLng(user.lat, user.lng);
                let icon = {
                  url: user.image,
                  scaledSize: new google.maps.Size(20, 20)
                }

                let marker = new google.maps.Marker({
                  map: map,
                  animation: google.maps.Animation.DROP,
                  position: latLng,
                  icon: icon
                });

                // I declare It to close the InfoWindow when I click on an other marker
                this.infoWindow = new google.maps.InfoWindow();
                this.windows(marker, user)
              }
            })
          })
        },

        // Set infoWindows of markers
        windows(marker, user) {

          // Enregistrement de la position du marker
          let destination = marker.position
          console.log(marker.position)
          let contentString = `<div>
                        <b> ${user.prenom} </b>
                        </br>
                        <img src="${user.image}" class="markerContent">
                        <a ui-sref="app.profil" class="button button-small button-outline button-primary" >Voir profil</a>
                        </div>`;
          let compiled = $compile(contentString)($scope);
          let infoWindowContent = compiled[0]

          // Lorsque je clique sur le marker ... affichage + calcul distance
          google.maps.event.addListener(marker, 'click', () => {
            this.infoWindow.setContent(infoWindowContent)
            this.infoWindow.open(map, marker);
            // pass marker's postion(destination) to calculateDistances()
            this.calculateDistances(destination)
          });

        },
        // aidReceiver le secours
        help() {
          socket.emit('emergency', this.user);
        },

        // Le message du malade reçu par le medecin
        emergency(message) {
          $scope.$apply(() => {
            this.content = message.user
            this.id = message.id
            console.log(message.id)
            this.reply = true;
          });
        },

        // Le medecin envoie son acceptation avec ses coordonnées
        accept() {
          this.reply = false;
          //L'aidProvider envoit ses infos à l'aidReceiver
          socket.emit('accept', {
            user: this.user,
            id: this.id
          });
          // Passer à calculateDistances -->  destination = lieux de l'aidReceiver

          //this.calculateDistances(destination)
        },

        refuse() {
          this.reply = false;
          this.show = false;
        },

        // ... Je reçoit ses coordonnées
        acceptHelp(user) {
          $scope.$apply(() => {
            this.doctor = user
          });
          // Je lance calculate distance
          // destination = celle de l'aidReceiver
          // orgin = celle du doctor

          //this.calculateDistances(destination)
        }


      })
    }]
  })
})(angular.module('app.home'))
