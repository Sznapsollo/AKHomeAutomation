(function(){
  'use strict';
	app.service('delayDataService', function($http) {
		this.checkData = function(id) {
			return $http({
				url: 'executables/checkDelayData.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {receive: '1', id: id}
			});
		};
		this.checkRegularActionData = function(id) {
			return $http({
				url: 'executables/checkRegularActionData.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {receive: '1', id: id}
			});
		};
		this.setRegularActionData = function(id, timeLine) {
			return $http({
				url: 'executables/setRegularActionData.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {receive: '1', id: id, timeLine: timeLine}
			});
		};
	});
	
	app.service('itemsDataService', function($http) {
		this.checkItemsData = function(category) {
			return $http({
				url: 'executables/checkItemsData.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {receive: '1', category: category}
			});
		};
	});
	
	app.service('sensorsDataService', function($http) {
		this.setSensorTimelineData = function(id, timeLine) {
			return $http({
				url: 'executables/setSensorActionData.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {receive: '1', id: id, timeLine: timeLine}
			});
		};
		this.setSensorDevicesData = function(id, onDevices) {
			return $http({
				url: 'executables/setSensorActionData.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {receive: '1', id: id, onDevices: onDevices}
			});
		};
	});
	
	app.service('logsDataService', function($http, $route) {
		this.checkLogsListData = function() {
			return $http({
				url: 'executables/checkLogsListData.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {receive: '1', category: $route.current.params.logsType, startIndex: $route.current.params.startIndex, itemsPerPage: $route.current.params.itemsPerPage}
			});
		};
		this.checkLogsFileData = function(fileName) {
			return $http({
				url: 'executables/checkLogsFileData.php',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				data: {receive: '1', category: $route.current.params.logsType, fileName: fileName}
			});
		};
	});
	
})();
