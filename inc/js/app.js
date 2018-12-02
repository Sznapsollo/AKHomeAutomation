var app = {};

(function(){
	'use strict';
	app = angular.module('automationApp', ['ngRoute'])
	.config(function($routeProvider, $locationProvider){
		$locationProvider.hashPrefix('');
		$routeProvider.when('/general', {
			templateUrl: 'templates/general.html',
			controller: 'TabController',
			fromValue: 'general'
		})
		.when('/advanced', {
			templateUrl: 'templates/advanced.html',
			controller: 'TabController',
			fromValue: 'advanced'
		})
		.when('/sensors', {
			templateUrl: 'templates/sensors.html',
			controller: 'TabController',
			fromValue: 'sensors'
		})
		.when('/manageitems', {
			templateUrl: 'templates/manageitems.html',
			controller: 'TabController',
			fromValue: 'manageitems'
		})
		.when('/logsList/:logsType/:startIndex/:itemsPerPage', {
			templateUrl: 'templates/logsList.html',
			controller: 'LogsListController'
		})
		.otherwise({
			redirectTo: '/general'
		});
	});
}());
