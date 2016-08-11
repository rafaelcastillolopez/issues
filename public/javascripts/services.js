// Angular service module for connecting to JSON APIs
var services=angular.module('casos.services', ['ngResource']);


services.factory('Caso', function($resource) {
	return $resource('api/caso/:id', {id: '@_id', cacheSlayer: new Date().getTime()}, {
  				count: {method:'GET', params:{count:true}}
 			});
});