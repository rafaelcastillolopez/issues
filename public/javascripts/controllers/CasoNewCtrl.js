angular.module('casos.controllers')
.controller('CasoNewCtrl', function($scope, $location, Caso) {
	// Define an empty caso model object
	$scope.caso = {};
	$scope.caso.fecha=new Date();

	// Validate and save the new case to the database
	$scope.createCaso = function() {
		var caso = $scope.caso;
		//TODO: validate

		// Create a new case from the model
		var newCaso = new Caso(caso);

		// Call API to save case to the database
		newCaso.$save(function(p, resp) {
			if(!p.error) {
				// If there is no error, redirect to the edit view
				$location.path('caso/'+p._id);
			} else {
				alert('Could not create');
			}
		});
	};
});
