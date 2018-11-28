(function(){
  'use strict';

	app.controller('SensorAlarmSettingsController', function SensorAlarmSettingsController($scope, $window, sensorsDataService) {
	
		$scope.translate = translate;
		$scope.alarmData = null;
		$scope.regularActionData = {};
		$scope.devicesData = {};
		$scope.saveAlarmTimeUnits = saveAlarmTimeUnits;
		$scope.saveAlarmDevices = saveAlarmDevices;
		$scope.folderSecured = false;
		
		init();
		
		function init()
		{
			sensorsDataService.checkSensorAlarmData($scope.outletId).then(
				function(dataResponse) {
					$scope.regularActionData.timeUnits = dataResponse.data.alarmTimeUnits;
					$scope.devicesData.onDevices = dataResponse.data.onAlarm;
					$scope.alarmData = dataResponse.data;
					$scope.folderSecured = $scope.alarmData.folderSecured;
				},
				function(response) {
					var error = 'Sensor Alarm data read error for ' + $scope.outletId;
					console.log(error);
					console.log(response);

					$scope.onSensorAlarmSettingsSaved({msg: ""});
				}
			);
		};
		
		function saveAlarmTimeUnits(msg) {
			sensorsDataService.setSensorAlarmTimelineData($scope.outletId, msg).then(
				function(dataResponse) {
					$scope.onSensorAlarmSettingsSaved();
				},
				function(response) {
					var error = 'Alarm Timeline data set error for ' + $scope.outletId;
					console.log(error);
					console.log(response);
				}
			);
		}
		
		function saveAlarmDevices(msg) {
			sensorsDataService.setSensorAlarmDevicesData($scope.outletId, msg).then(
				function(dataResponse) {
					$scope.onSensorAlarmSettingsSaved();
				},
				function(response) {
					var error = 'Alarm Devices data set error for ' + $scope.outletId;
					console.log(error);
					console.log(response);
				}
			);
		
		
			$scope.onSensorAlarmSettingsSaved();
		}
		
		function translate(code) {
			return automation.Translate(code);
		}
		
	});
	
})();
