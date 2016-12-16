((app) => {

  app.component('home', {
    templateUrl: 'js/components/home/home.html',
    controller: ["aidReceiversService", "usersService", "$compile", "$scope", "apiConfig", "$ionicActionSheet", "$ionicPopup", '$timeout', function(aidReceiversService, usersService, $compile, $scope, apiConfig, $ionicActionSheet, $ionicPopup, $timeout) {

      let socket = io(apiConfig.baseUrl + '/iller');
      let markers = []

      this.show;
      this.reply;
      this.state;
      this.waiting = true;
      this.marker = new google.maps.Marker();

      usersService.getCurrent().then((res)=>{
        this.user = res
        socket.emit('user', this.user)
        this.show = (this.user.situation === "aidReceiver" ? true : false)
        this.init();
      })

      socket.on('stats', (data) => console.log('Connected clients:', data.numClients))

      socket.on('locationReceiver', (locationR) => console.log('locationR:', locationR))

      // Uniquement le(s) medecin(s) reçoit le(s) message(s) de(s) aidReceivers
      socket.on('emergency', (message) => {
          message.user.lat
          message.user.lng
          this.emergency(message)
          this.calculateDistances(message.user)

        })
        // A la confirmation du medecin ...
      socket.on('accept', (aidProvider) => {
        socket.emit('acceptation')
        this.waiting = false
        this.show = false
        aidProvider.user.lng
        aidProvider.user.lat
        this.aidProvider = aidProvider.id
        console.log("aidProvider qui a accepté" + aidProvider.id)
        this.acceptHelp(aidProvider)
        this.calculateDistances(aidProvider.user)

      })

      socket.on('disconnect', () => {
        this.deleteMarker()
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
      let directionsDisplay;

      angular.extend(this, {
        $onInit() {



        },
        init() {
          let options = {
            maximumAge: 1000,
            //  timeout: 4000,
            enableHighAccuracy: true
          };
          let origin;
          let destinations;
          let directionsService = new google.maps.DirectionsService();
          let geocoder = new google.maps.Geocoder();
          let GeoMarker;
          directionsDisplay = new google.maps.DirectionsRenderer();

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

            this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            directionsDisplay.setMap(this.map);

            // Supprime les markers A et B prévues par défaut
            directionsDisplay.setOptions({
              suppressMarkers: true
            });
            setMarker(position, map)

          }

          //Mise en place du marker
          let setMarker = (position) => {
            origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            GeoMarker = new GeolocationMarker(this.map);
            //let user = {}
            this.user.lat = position.coords.latitude
            this.user.lng = position.coords.longitude

            this.newPlace(this.user)
          }

          let onError = (error) => {
            console.log("Could not get location");
          };

          // Si il n'y pas eu d'acception il reçoit la localisation de tous

          socket.on('show-marker', (data) => {
            if (this.waiting) {
              this.markers(data.newLocation)
            } else {
              if (data.id === this.aidProvider) {
                this.markers(data.newLocation)
                console.log(data.id)
              }
            }
          })


          // Get current position
          navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
          // Reload marker when new postion detected
          navigator.geolocation.watchPosition(setMarker, onError, options);

          // Recharge la position si erreure
          this.reload = () => {
            navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
          }
        },
        newPlace(user) {
          if (this.user.situation === "aidReceiver")
            socket.emit('locationReceiver', user)
          else {
            socket.emit('locationProvider', user)
          }
        },
        // Create markers
        markers(newLocation) {
          //Only the AIDREC can see the APRO. The APRO doesnt see AIDREC
          if (this.user.situation === "aidReceiver") {
            if (!this.waiting) {
              this.marker.setMap(null);
             }

            let latLng = new google.maps.LatLng(newLocation.lat, newLocation.lng);
            let icon = {
              url: 'img/rescue.png',
              scaledSize: new google.maps.Size(20, 20)
            }

            this.marker = new google.maps.Marker({
              position: latLng,
              icon: icon
            });

            markers.push(this.marker)

            this.marker.setMap(this.map);
            // I declare It to close the InfoWindow when I click on an other marker
            this.infoWindow = new google.maps.InfoWindow();

          }

        },
        deleteMarker() {
          this.marker.setMap(null);
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
            this.infoWindow.open(this.map, marker);
            // pass marker's postion(destination) to calculateDistances()
            this.calculateDistances(destination)
          });

        },
        address(address, span) {
          $scope.$apply(() => {
            this.place = {
              address: address,
              time: span
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
            console.log(`aidReceiver's id : ${message.id}`)
            this.reply = true;
          });
        },

        //L'aidProvider envoit ses infos à l'aidReceiver (Son socket id est aussi passé pour spécifier qu'on lui renvoit bien à lui)
        accept() {
          this.reply = false;
          this.state = true;

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
        },

        endMission() {
          socket.emit('Rejoin')
          this.state = false;
          this.content = false;
          directionsDisplay.setMap();
          this.init()
        },

        curred() {
          this.doctor = false
          directionsDisplay.setMap();
          this.init()
        }

      })
    }]
  })
})(angular.module('app.home'))
