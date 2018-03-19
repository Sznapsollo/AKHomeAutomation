var app = {};

(function(){
  'use strict';
  app = angular.module('automationApp', ['ngRoute'])
    .config(function($routeProvider, $locationProvider){
      $routeProvider.when('/general', {
        templateUrl: 'templates/general.html',
        controller: 'TabController',
		fromValue: 'general'
      });

      $routeProvider.when('/advanced', {
        templateUrl: 'templates/advanced.html',
        controller: 'TabController',
		fromValue: 'advanced'
      });
	  
	  $routeProvider.when('/sensors', {
        templateUrl: 'templates/sensors.html',
        controller: 'TabController',
		fromValue: 'sensors'
      });
	  
	  $routeProvider.when('/logsList/:logsType/:startIndex/:itemsPerPage', {
        templateUrl: 'templates/logsList.html',
        controller: 'LogsListController'
      });

      $routeProvider.otherwise({
        redirectTo: '/general'
      });
	  
    });
}());
