(function(){
  'use strict';

	app.controller('SensorItemController', function SensorItemController($scope, $window, sensorsDataService) {
	
		$scope.calendarIconName = automation.GetIcon('calendar','');
		$scope.actionIconName = automation.GetIcon('action','');
		$scope.saveRegularSettings = saveRegularSettings;
		$scope.saveSensorDevicesSettings = saveSensorDevicesSettings;
		$scope.showRegular = false;
		$scope.showDevices = false;
		$scope.regularActionData = {};
		$scope.sensorDevicesData = {};
		$scope.resetSensorData = resetSensorData;
		$scope.translate = translate;
		$scope.toggleRegularOptions = toggleRegularOptions;
		$scope.toggleDevicesOptions = toggleDevicesOptions;
		
		init();
		
		function toggleRegularOptions() {
			$scope.showRegular = !$scope.showRegular;
		}
		
		function toggleDevicesOptions() {
			$scope.showDevices = !$scope.showDevices;
		}
		
		function init()
		{
			if($scope.timeUnits !== undefined && $scope.timeUnits.length > 0) {
				$scope.regularActionData.timeUnits = JSON.parse($scope.timeUnits);
			}
			
			if($scope.customData) {
				$scope.calendarIconName = automation.GetIcon('calendar','_enabled');
				$scope.actionIconName = automation.GetIcon('action','_enabled');
			}
				
			if($scope.onDevices !== undefined && $scope.onDevices.length > 0) {
				$scope.sensorDevicesData.onDevices = JSON.parse($scope.onDevices);
			}
		};
		
		function resetSensorData() {
			$scope.showRegular = false;
			$scope.showDevices = false;
			
			sensorsDataService.setSensorTimelineData($scope.outletId, null).then(
				function(dataResponse) {
					$window.location.reload();
				},
				function(response) {
					var error = 'Regular action data clear error for ' + $scope.outletId;
					console.log(error);
					console.log(response);
				}
			);
		}
		
		function saveRegularSettings(msg) {
			$scope.showRegular = false;
			$scope.showDevices = false;
			
			sensorsDataService.setSensorTimelineData($scope.outletId, msg).then(
				function(dataResponse) {
					$window.location.reload();
				},
				function(response) {
					var error = 'Regular action data set error for ' + $scope.outletId;
					console.log(error);
					console.log(response);
				}
			);
		}
		
		function saveSensorDevicesSettings(msg) {
			$scope.showRegular = false;
			$scope.showDevices = false;
			
			sensorsDataService.setSensorDevicesData($scope.outletId, msg).then(
				function(dataResponse) {
					$window.location.reload();
				},
				function(response) {
					var error = 'Devices data set error for ' + $scope.outletId;
					console.log(error);
					console.log(response);
				}
			);
		}
		
		function translate(code) {
			return automation.Translate(code);
		}
	});
	
})();