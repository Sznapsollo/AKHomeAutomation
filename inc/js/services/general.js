(function(){
  'use strict';
	app.service('machineAvailabilityService', function($http) {
		this.checkMachineAvailability = function(id) {
			return $http({
				url: 'executables/Services.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {service: 'CheckMachineAvailability', receive: '1', id: id}
			});
		};
	});
	app.service('delayDataService', function($http) {
		this.checkData = function(id) {
			return $http({
				url: 'executables/Services.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {service: 'CheckDelayData', receive: '1', id: id}
			});
		};
		this.checkRegularActionData = function(id) {
			return $http({
				url: 'executables/Services.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {service: 'GetRegularActionData', receive: '1', id: id}
			});
		};
		this.setRegularActionData = function(id, timeLine) {
			return $http({
				url: 'executables/Services.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {service: 'SetRegularActionData', receive: '1', id: id, timeLine: timeLine}
			});
		};
	});
	
	app.service('itemsDataService', function($http) {
		this.checkItemsData = function(category) {
			return $http({
				url: 'executables/Services.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {service: 'CheckItemsData', receive: '1', category: category}
			});
		};
	});
	
	app.service('sensorsDataService', function($http) {
		this.setSensorTimelineData = function(id, timeLine) {
			return $http({
				url: 'executables/Services.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {service: 'SetSensorActionData', receive: '1', id: id, timeLine: timeLine}
			});
		};
		this.setSensorDevicesData = function(id, onDevices) {
			return $http({
				url: 'executables/Services.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {service: 'SetSensorActionData', receive: '1', id: id, onDevices: onDevices}
			});
		};
	});
	
	app.service('logsDataService', function($http, $route) {
		this.checkLogsListData = function() {
			return $http({
				url: 'executables/Services.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {service: 'CheckLogsListData', receive: '1', category: $route.current.params.logsType, startIndex: $route.current.params.startIndex, itemsPerPage: $route.current.params.itemsPerPage}
			});
		};
		this.checkLogsFileData = function(fileName) {
			return $http({
				url: 'executables/Services.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {service: 'CheckLogsFileData', receive: '1', category: $route.current.params.logsType, fileName: fileName}
			});
		};
	});
	
	app.service('pageDataService', function($http) {
		this.checkPageData = function() {
			return $http({
				url: 'executables/Services.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {service: 'CheckPageData', receive: '1'}
			});
		};
	});
})();
