(function(){
  'use strict';

	app.controller('SensorDevicesSettingsController', function SensorDevicesSettingsController($scope) {
	
		$scope.devicesDictionary = automation.GetDevicesDictionary();
		$scope.onDevices = [];
		$scope.isSaveEnabled = isSaveEnabled;
		$scope.addNew = addNew;
		$scope.removeDevice = removeDevice;
		$scope.saveSensorDevicesSettings = saveSensorDevicesSettings;
		$scope.translate = translate;
		$scope.dependencyMethods = [{name: '', value: ''}, {name: 'Check Luminosity', value: 'checkLuminosity'}];
		$scope.dependencyOperations = [{name: '', value: ''}, {name: '>', value: 'grtr'}, {name: '<', value: 'lwr'}];
		
		init();
		
		function isSaveEnabled() {
			return automation.CheckRequiredFields(['id'], $scope.onDevices);
		}
		
		function init()
		{
			if($scope.sensorDevicesData !== undefined && $scope.sensorDevicesData.length > 0) {
				$scope.sensorDevicesData = JSON.parse($scope.sensorDevicesData);
				if(!($scope.sensorDevicesData.length == 0)) {
					$scope.onDevices = $scope.sensorDevicesData.onDevices;
				}
			}
			
			if($scope.onDevices.length == 0) {
				$scope.addNew();
			}
		};
		
		function saveSensorDevicesSettings() {
			$scope.onSensorDevicesSettingsSaved({msg: $scope.onDevices});
		}
		
		function addNew() {
			$scope.onDevices.push({id:null,delay:0,rebound:0,dependencyMethod:null,dependencyOperation:null,dependencyValue:null});
		}
		
		function removeDevice(unit) {
			
			for(var i=0; i < $scope.onDevices.length; i++) {
				if(unit.id == $scope.onDevices[i].id)
				{
					$scope.onDevices.splice(i, 1);
				}
			}
		}
		
		function translate(code) {
			return automation.Translate(code);
		}
	});
	
})();
