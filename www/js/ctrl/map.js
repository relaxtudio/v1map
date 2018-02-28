shante.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $compile) {
	var options = {
		timeout: 10000, 
		enableHighAccuracy: true
	};

	$scope.position = {
		me: null
	}

	$scope.locations = [
		['wheels32.png', -7.313340005019721, 112.73138751256204, "Tambal Ban"]
	];

	$cordovaGeolocation.getCurrentPosition(options).then(function(position) {
		var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		$scope.position.me = latLng;

		var mapOptions = {
			center: latLng,
			zoom: 18,
			styles: [
					  {
					    "featureType": "poi.business",
					    "stylers": [
					      {
					        "visibility": "off"
					      }
					    ]
					  },
					  {
					    "featureType": "poi.park",
					    "elementType": "labels.text",
					    "stylers": [
					      {
					        "visibility": "off"
					      }
					    ]
					  }
					],
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

		google.maps.event.addListenerOnce($scope.map, 'idle', function() {
			var marker = new google.maps.Marker({
				map: $scope.map,
				animation: google.maps.Animation.DROP,
				position: latLng
			});

			var infoWindow = new google.maps.InfoWindow({
				content: "Here I am"
			});
		});

		google.maps.event.addListener($scope.map, 'click', function() {
			$scope.infoWindow.close();
		});

		$scope.addMarker();

		// $scope.navigate();
		
	}, function(error) {
		console.log(error, "Could not get location");
	});

	$scope.infoWindow = new google.maps.InfoWindow({
		content: ''
	});

	$scope.directionsService = new google.maps.DirectionsService;
	$scope.directionsDisplay = new google.maps.DirectionsRenderer;

	$scope.log = function() {
		console.log('test');
	}

	$scope.addMarker = function() {
		for (i = 0; i < $scope.locations.length; i++) {
			marker = new google.maps.Marker({
				map: $scope.map,
				animation: google.maps.Animation.DROP,
				icon: "img/marker/" + $scope.locations[i][0],
				position: new google.maps.LatLng($scope.locations[i][1], $scope.locations[i][2])
			});

			var content = '<div><p>' + $scope.locations[i][3]
							+ '</p><button ng-click="navigate(' + i 
							+ ')" class="btn btn-default">Navigate</button></div>';
			var compileContent = $compile(content)($scope);

			google.maps.event.addListener(marker, 'click', (function(marker, content, scope) {
				return function() {					
					scope.infoWindow.setContent(content);
					scope.infoWindow.open(scope.map, marker);
				}				
			})(marker, compileContent[0], $scope));
		}
	}

	$scope.navigate = function(res) {
		$scope.directionsDisplay.setMap(null);

		var lat = $scope.locations[res][1];
		var lng = $scope.locations[res][2];

		$scope.directionsDisplay.setMap($scope.map);

		latLng = new google.maps.LatLng(lat, lng);

		$scope.directionsService.route({
			origin: $scope.position.me,
			destination: latLng,
			travelMode: google.maps.TravelMode['DRIVING']
		}, function(response, status) {
			if(status == google.maps.DirectionsStatus.OK) {
				$scope.directionsDisplay.setDirections(response);
			} else {
				console.log(status);
			}
		});
	};
	

})