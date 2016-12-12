((app) => {

  app.component('home', {
    templateUrl: 'js/components/home/home.html',
    controller: ["aidReceiversService", "usersService", "$compile", "$scope", "$stateParams", "apiConfig", "$ionicActionSheet", "$ionicPopup", function(aidReceiversService, usersService, $compile, $scope, $stateParams, apiConfig, $ionicActionSheet, $ionicPopup) {

      let socket = io(apiConfig.baseUrl + '/iller');
      this.show;
      this.reply;
      socket.on('stats', (data) => console.log('Connected clients:', data.numClients))


      // Uniquement le(s) medecin(s) reçoit le(s) message(s) de(s) aidReceivers
      socket.on('emergency', (message) => {
          message.user.lat
          message.user.lng
          this.emergency(message)
          this.calculateDistances(message.user)

        })
        // A la confirmation du medecin ...
      socket.on('accept', (newLocation) => {
        this.show = false
        newLocation.user.lng
        newLocation.user.lat

        this.acceptHelp(newLocation)
        this.calculateDistances(newLocation.user)

      })

      usersService.getOne($stateParams.username).then((res) => {
        this.user = res.data
        let user = this.user[0]
        this.user = user
        socket.emit('user', this.user)
        this.show = (this.user.situation === "aidReceiver" ? true : false)

      })

      $scope.show = () => {

        // Show the action sheet
        let hideSheet = $ionicActionSheet.show({
          buttons: [{
            text: 'Gun Shot'
          }, {
            text: 'Heart Attack'
          }, {
            text: 'Stabbing'
          }, {
            text: 'Choking'
          }, {
            text: 'Other'
          }],

          titleText: 'Emergency Type',
          cancelText: 'Cancel',
          cancel: () => {
            // add cancel code..
          },
          buttonClicked: (index, emergencyType) => {
            this.help(emergencyType)
              // An alert dialog
            $ionicPopup.alert({
              title: 'Message sent',
              template: 'Someone is coming to help you. Please also call 107. '
            });
            return true;
          }
        });

      };

      angular.extend(this, {
        $onInit() {

          let options = {
            maximumAge: 3000,
            //  timeout: 1000,
            enableHighAccuracy: true
          };
          let origin;
          let destinations;
          let directionsService = new google.maps.DirectionsService();
          let directionsDisplay = new google.maps.DirectionsRenderer();
          let geocoder = new google.maps.Geocoder();
          let GeoMarker;


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
                let address = ` ${response.destinationAddresses[0]}`;

                 //map the route
                let request = {
                  origin: origin,
                  destination: destinations[0],
                  travelMode: google.maps.TravelMode.WALKING
                };

                this.address(address, tmp)
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
            this.markers(map)
            directionsDisplay.setMap(map);
            setMarker(position, map)

          }

          //Mise en place du marker
          let setMarker = (position, map) => {
            origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            GeoMarker = new GeolocationMarker(map);
            let user = {}
            user.lat = position.coords.latitude
            user.lng = position.coords.longitude

            socket.emit('location', user)

          }

          let onError = (error) => {
            console.log("Could not get location");
          };

          // Get current position
          navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
          // Reload marker when new postion detected
          navigator.geolocation.watchPosition(setMarker, onError, options);

          // Recharge la position si erreure
          this.reload = ()=>{
            navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
          }

        },
        // Create markers
        markers(map) {
          //Only the AIDREC can see the APRO. The APRO doesnt see AIDREC
          if(this.user.situation ==="aidReceiver"){
          usersService.get().then((res) => {
            this.users = res.data.forEach((user) => {
              if (user.situation === "aidProvider") {
                let latLng = new google.maps.LatLng(user.lat, user.lng);
                let icon = {
                  url: 'img/rescue.png',
                  scaledSize: new google.maps.Size(20, 20)
                }

                let marker = new google.maps.Marker({
                  map: map,
                  position: latLng,
                  icon: icon
                });

                // I declare It to close the InfoWindow when I click on an other marker
                this.infoWindow = new google.maps.InfoWindow();
                this.windows(marker, user)
              }
            })
          })
        }

        },

        // Set infoWindows of markers
        windows(marker, user) {

          // Enregistrement de la position du marker
          let destination = marker.position
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
        address(address,span) {
          $scope.$apply(() => {
          this.place = {
            address: address,
            time:span
          }
        });
         console.log(this.place)
        },

        // aidReceiver envoit un message de secours
        help(emergencyType) {
          this.user.message = emergencyType.text
          socket.emit('emergency', this.user);
        },

        // Le message du malade reçu par le medecin
        emergency(message) {
          $scope.$apply(() => {
            this.content = message.user
            this.id = message.id
            console.log(`L'id du malade est : ${message.id}`)
            this.reply = true;
          });
        },

        //L'aidProvider envoit ses infos à l'aidReceiver (Son socket id est aussi passé pour spécifier qu'on lui renvoit bien à lui)
        accept() {
          this.reply = false;
          socket.emit('accept', {
            user: this.user,
            id: this.id
          });
        },

        refuse() {
          this.reply = false;
          this.show = false;
        },

        // ... Je reçoit ses coordonnées
        acceptHelp(user) {
          $scope.$apply(() => {
            this.doctor = user.user
          });
        }

      })
    }]
  })
})(angular.module('app.home'))
