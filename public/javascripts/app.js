// Angular module, defining routes for the app
casos=angular.module('casos',['casos.controllers','casos.services', 'ngRoute'])
	.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])
  /*.config(['$controllerProvider', function($controllerProvider) {
     $controllerProvider.allowGlobals();
  }])*/
  .config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(3500);
    growlProvider.globalDisableCountDown(true);
    growlProvider.globalPosition('bottom-right');
  }])
  .config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/caso', { templateUrl: 'partial/casolist', controller: 'CasoListCtrl' }).
			when('/caso/:id', { templateUrl: 'partial/casoitem', controller: 'CasoItemCtrl' }).
      when('/caso/:casoid/:servicioid', { templateUrl: 'partial/servicioitem', controller: 'ServicioItemCtrl' }).
			when('/nuevoCaso', { templateUrl: 'partial/casonew', controller: 'CasoNewCtrl' }).
      when('/proveedor', { templateUrl: 'partial/proveedorlist', controller: 'ProveedorListCtrl' }).
      when('/proveedor/:id', { templateUrl: 'partial/proveedoritem', controller: 'ProveedorItemCtrl' }).
      when('/nuevoProveedor', { templateUrl: 'partial/proveedornew', controller: 'ProveedorNewCtrl' }).
      when('/busquedaProveedor', { templateUrl: 'partial/proveedorsearch', controller: 'ProveedorSearchCtrl' }).
      when('/servicio', { templateUrl: 'partial/serviciolist', controller: 'ServicioListCtrl' }).
      when('/empresa', { templateUrl: 'partial/empresalist', controller: 'EmpresaListCtrl' }).
			when('/etiqueta', { templateUrl: 'partial/etiquetalist', controller: 'EtiquetaListCtrl' }).
      when('/estadisticas', { templateUrl: 'partial/estadisticas', controller: 'EstadisticasCtrl' }).
			// If invalid route, just redirect to the main list view
			otherwise({ redirectTo: '/caso' });
	}]);

casos.filter('range', function() {
	  return function(val, range) {
	    range = parseInt(range);
	    for (var i=0; i<range; i++)
	      val.push(i);
	    return val;
	  };
	});

casos.filter('pageRange', function() {
        return function(input) {
            var lowBound, highBound;
            switch (input.length) {
            case 1:
                lowBound = parseInt(input[0])-5;
                if (lowBound<1)
                	lowBound=1;
                highBound = parseInt(input[0])+5;
                break;
            case 2:
                lowBound = parseInt(input[0])-5;
                if (lowBound<1)
                	lowBound=1;
                highBound = parseInt(input[0])+5;
                if (highBound>parseInt(input[1]))
                	highBound=parseInt(input[1]);
                break;
            default:
                return input;
            }
            var result = [];
            for (var i = lowBound; i <= highBound; i++)
                result.push(i);
            return result;
        };
    });

casos.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
				if (input && input.length>=start)
        	return input.slice(start-1);
    }
});

casos.directive("select", function() {
    return {
      restrict: "E",
      require: "?ngModel",
      scope: false,
      link: function (scope, element, attrs, ngModel) {
        if (!ngModel) {
          return;
        }
        element.bind("keyup", function() {
          element.triggerHandler("change");
        })
      }
   }
});

casos.directive('bsDatefield', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {

        var dateFormat = attrs.bsDatefield || 'YYYY/MM/DD';

        ngModelCtrl.$parsers.push(function (viewValue) {

          //convert string input into moment data model
          var parsedMoment = moment(viewValue, dateFormat);

          //toggle validity
          ngModelCtrl.$setValidity('datefield', parsedMoment.isValid());

          //return model value
          return parsedMoment.isValid() ? parsedMoment.toDate() : undefined;
        });

        ngModelCtrl.$formatters.push(function (modelValue) {

          var isModelADate = angular.isDate(modelValue);
          ngModelCtrl.$setValidity('datefield', isModelADate);

          return isModelADate ? moment(modelValue).format(dateFormat) : undefined;
        });
      }
    };
});

casos.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
