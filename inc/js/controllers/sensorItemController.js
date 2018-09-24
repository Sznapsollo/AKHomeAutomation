(function(){
  'use strict';

	app.controller('SensorItemController', function SensorItemController($scope, $window, sensorsDataService) {
	
		$scope.calendarIconName = automation.GetIcon('calendar','');
		$scope.actionIconName = automation.GetIcon('action','');
		$scope.alarmTimeUnitsIconName = automation.GetIcon('alarmTimeUnits','');
		$scope.alarmDevicesIconName = automation.GetIcon('alarmDevices','');
		$scope.saveRegularSettings = saveRegularSettings;
		$scope.saveSensorDevicesSettings = saveSensorDevicesSettings;
		$scope.sensorAlarmSettingsSaved = sensorAlarmSettingsSaved;
		$scope.showRegular = false;
		$scope.showDevices = false;
		$scope.showAlarmTimeUnits = false;
		$scope.showAlarmDevices = false;
		$scope.regularActionData = {};
		$scope.sensorDevicesData = {};
		$scope.resetSensorData = resetSensorData;
		$scope.translate = translate;
		$scope.toggleRegularOptions = toggleRegularOptions;
		$scope.toggleDevicesOptions = toggleDevicesOptions;
		$scope.toggleAlarmsTimeUnits = toggleAlarmsTimeUnits;
		$scope.toggleAlarmsDevices = toggleAlarmsDevices;
		
		$scope.pageFlag = automation.PageFlag;
		
		init();
		
		function toggleAll(show) {
			$scope.showRegular = show;
			$scope.showDevices = show;
			$scope.showAlarmTimeUnits = show;
			$scope.showAlarmDevices = show;
		}
		
		function toggleRegularOptions() {
			if($scope.showRegular) {
				toggleAll(false);
				return;
			}
			toggleAll(false);
			$scope.showRegular = true;
		}
		
		function toggleDevicesOptions() {
			if($scope.showDevices) {
				toggleAll(false);
				return;
			}
			toggleAll(false);
			$scope.showDevices = true;
		}
		
		function toggleAlarmsTimeUnits() {
			if($scope.showAlarmTimeUnits) {
				toggleAll(false);
				return;
			}
			toggleAll(false);
			$scope.showAlarmTimeUnits = true;
		}
		
		function toggleAlarmsDevices() {
			if($scope.showAlarmDevices) {
				toggleAll(false);
				return;
			}
			toggleAll(false);
			$scope.showAlarmDevices = true;
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
			toggleAll(false)
			
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
			toggleAll(false)
			
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
			toggleAll(false)
			
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
		
		function sensorAlarmSettingsSaved(msg) {
			toggleAll(false)
		}
		
		function translate(code) {
			return automation.Translate(code);
		}
	});
	
})();