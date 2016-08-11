angular.module('casos.controllers')
.controller('CasoItemCtrl', function ($scope, $location, $routeParams, $modal, growl, Caso) {
	$scope.caso = Caso.get({id: $routeParams.id}, function (caso)
	{
		$scope.caso.fecha=new Date($scope.caso.fecha);
	});

  // Validate and save the new case to the database
	$scope.saveCaso = function() {
		var caso = $scope.caso;
		//TODO: validate

		// Create a new case from the model
		var newCaso = new Caso(caso);
		//console.log(angular.toJson(newCaso,true));

		// Call API to save case to the database
		newCaso.$save(function(p, resp) {
			if(!p.error) {
				growl.success("Your changes have been saved successfully");
				//$location.path('caso');
			} else {
				alert('Could not create ');
			}
		});
	};

	$scope.back = function() {
		window.history.back();
	}

	$scope.isActive = function (viewLocation) {
    	var active = ($location.path().indexOf(viewLocation)>=0);
    	return active;
	};
});
