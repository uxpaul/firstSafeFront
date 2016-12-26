((app) => {

  app.component('home', {
    templateUrl: 'js/components/home/home.html',
    controller: ["usersService","$timeout", "$compile", "$scope", "socket","$ionicActionSheet", "$ionicPopup", '$timeout', function(usersService, $timeout, $compile, $scope, socket, $ionicActionSheet, $ionicPopup) {

      let icon = {
        url: 'img/rescue.png',
        scaledSize: new google.maps.Size(20, 20)
      }

      this.show;
      this.reply;
      this.state;

      usersService.getCurrent().then((res) => {
        this.user = res
        socket.emit('user', this.user)
        this.show = (this.user.situation === "aidReceiver" ? true : false)
        this.init();
      })

      socket.on('stats', (data) => console.log('Connected clients:', data.numClients))

      socket.on('show-marker', (data) => {
        if (!this.aidProvider)
          this.updateMarker(data)
        else
          this.oneMarker(data)
      })

      // Uniquement le(s) medecin(s) reçoit le(s) message(s) de(s) aidReceivers
      socket.on('emergency', (message) => {
        message.user.lat
        message.user.lng
        this.emergency(message)
        this.calculateDistances(message.user)

      })

      socket.on('iAccept', () => this.iAccept())

      // A la confirmation du medecin ...
      socket.on('accept', (aidProvider) => {
        this.show = false
        aidProvider.user.lng
        aidProvider.user.lat
        this.aidProvider = aidProvider.id
        console.log("aidProvider qui a accepté" + this.aidProvider)
        this.acceptHelp(aidProvider)
        this.calculateDistances(aidProvider.user)
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
      let timer;

      angular.extend(this, {
        $onInit() {

          this.markers = []



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
            setMarker(position)

          }

          //Mise en place du marker
          let setMarker = (position) => {
            origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            let GeoMarker = new GeolocationMarker(this.map);
            this.user.lat = position.coords.latitude
            this.user.lng = position.coords.longitude
              // J'envois la localisation des aidProvider à tous les aidReceivers
            if (this.user.situation === "aidProvider") socket.emit('locationProvider', this.user)

            let locReload = () => {
              timer = $timeout(() => {
                if (this.user.situation === "aidProvider") socket.emit('locationProvider', this.user)
                timer = $timeout(locReload, 2000);
              }, 2000);
            };
            locReload();
          }

          let onError = (error) => {
            console.log("Could not get location");
          };

          // Reload marker when new postion detected
          navigator.geolocation.watchPosition(setMarker, onError, options);
          // Get current position
          navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

          // Recharge la position si erreure
          this.reload = () => {
            navigator.geolocation.watchPosition(setMarker, onError, options);
            navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
          }
        },
        //AR reçoit la localisation de tous les AP
        updateMarker(data) {
          let doctor = {}
          let memory
          console.log(data.id + data.newLocation)
          this.markers.forEach((marker) => {
            if (marker.id === data.id) {
              memory = marker.marker
            }
          })

          if (memory) {
            memory.setPosition(new google.maps.LatLng(data.newLocation.lat, data.newLocation.lng))
          } else {
            let marker = new google.maps.Marker({
              map: this.map,
              icon: icon
            });

            doctor.marker = marker
            doctor.id = data.id
            doctor.lat = data.newLocation.lat
            doctor.lng = data.newLocation.lng
            this.markers.push(doctor)
          }
          console.log(this.markers)
        },

        oneMarker(data) {
          this.markers.forEach((marker) => {
            if (marker.id != this.aidProvider) {
              marker.marker.setMap(null)
              delete marker;
            } else {
              if (data.id === this.aidProvider)
                marker.marker.setPosition(new google.maps.LatLng(data.newLocation.lat, data.newLocation.lng))
            }
          })
        },

        // Create markers
        markers(newLocation) {
          marker.setPosition(new google.maps.LatLng(newLocation.lat, newLocation.lng))

          // I declare It to close the InfoWindow when I click on an other marker
          this.infoWindow = new google.maps.InfoWindow();
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
            this.place = {
              address: address,
              time: span
            }
          console.log(this.place)
        },

        // aidReceiver envoit un message de secours
        help(emergencyType) {
          this.user.message = emergencyType.text
          socket.emit('emergency', this.user);
        },

        // Le message du malade reçu par le medecin
        emergency(message) {
            this.content = message.user
            this.id = message.id
            console.log(`aidReceiver's id : ${message.id}`)
            this.reply = true;
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

        // Refus de l'aidProvider -- Retire tous les messages
        refuse() {
          this.reply = false;
          this.content = null;
          directionsDisplay.setMap()
        },

        // ... Je reçois ses coordonnées
        acceptHelp(user) {
            this.doctor = user.user
        },

        // Quand un aidProvider accepte l'alerte disparaît chez les autres aidProvider
        iAccept() {
            this.reply = false;
            this.content = null;
            directionsDisplay.setMap()
        },

        endMission() {
          socket.emit('Rejoin')
          this.state = false;
          this.content = false;
          directionsDisplay.setMap();
        },

        curred() {
          this.doctor = false
          this.show = true;
          directionsDisplay.setMap();
        }

      })
    }]
  })
})(angular.module('app.home'))
