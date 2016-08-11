angular.module('casos.controllers')
.controller('CasoListCtrl', function ($scope, $location, $rootScope, Caso) {
	$scope.loading = true;
	var searchObject;
	if ($rootScope.searchObject && $.isEmptyObject($location.search()))
	{
		searchObject=$rootScope.searchObject;
		for (var key in searchObject)
  		$location.search(key,searchObject[key]);
	}
	else
	{
		searchObject=$location.search();
		$rootScope.searchObject=$location.search();
	}
	$scope.page=searchObject.page || 1;
	$scope.pagesize=15;
	$scope.totalCasos=Caso.count(searchObject, function (result)
	{
		$scope.pages=Math.ceil(result.count/$scope.pagesize);
	});
	$scope.casos = Caso.query(searchObject, function (result)
	{
		$scope.loading=false;
	});
	$scope.query = searchObject.query;
	$scope.casosSeleccionados = [];

	// Filter
	$scope.filter = function() {
		$scope.page=1;$scope.loading = true;
		var searchObject = $location.search();
		searchObject.query=$scope.query;
		searchObject.page=1;searchObject.limit=15;
		$scope.totalCasos=Caso.count(searchObject, function (result)
		{
			$scope.pages=Math.ceil(result.count/$scope.pagesize);
		});
		$scope.casos = Caso.query(searchObject, function (result)
		{
			$scope.loading=false;
			$rootScope.searchObject=searchObject;
			for (var key in searchObject)
	  		$location.search(key,searchObject[key]);
		});
	};

	$scope.previous = function() {
		var newpage=parseInt($scope.page)-1;
		return newpage;
	}

	$scope.next = function() {
		var newpage=parseInt($scope.page)+1;
		return newpage;
	}

	$scope.isActive = function (viewLocation) {
    	var active = ($location.path().indexOf(viewLocation)>=0);
    	return active;
	};
});
