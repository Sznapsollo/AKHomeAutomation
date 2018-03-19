(function(){
  'use strict';

	app.controller('RegularSettingsController', function RegularSettingsController($scope) {
	
		$scope.timeUnits = [];
		
		$scope.saveRegularSettings = saveRegularSettings;
		$scope.toggleDay = toggleDay;
		$scope.isSetDay = isSetDay;
		$scope.isSaveEnabled = isSaveEnabled;
		$scope.addNew = addNew;
		$scope.removeUnit = removeUnit;
		$scope.translate = translate;
		
		init();
		
		function toggleDay(timeUnit, value) {
		
			value = String(value);
			var daysOfWeek = timeUnit.daysOfWeek.split(',')
			
			if(daysOfWeek.indexOf(value) >= 0)
			{
				for(var i = daysOfWeek.length; i--;){
					if (daysOfWeek[i] == value) daysOfWeek.splice(i, 1);
				}
			}
			else
				daysOfWeek.push(value);
				
				
			timeUnit.daysOfWeek = daysOfWeek.join(',');
		}
		
		function isSetDay(timeUnit, value) {
			value = String(value);
			if(timeUnit.daysOfWeek.split(',').indexOf(value) >= 0)
				return true;
			else
				return false;
		}
		
		function isSaveEnabled() {
			
			var valid = true;
			
			for(var i=0; i < $scope.timeUnits.length; i++) {
				if($scope.timeUnits[i].timeStart.length == 5 || $scope.timeUnits[i].timeEnd.length == 5)
				{}
				else {
					valid = false;
					break;
				}
			}
			
			return valid;
		}
		
		function init()
		{
			if($scope.regularActionData !== undefined && $scope.regularActionData.length > 0) {
				$scope.regularActionData = JSON.parse($scope.regularActionData);
				if(!($scope.regularActionData.length == 0)) {
					$scope.timeUnits = $scope.regularActionData.timeUnits;
				}
			}
			
			if($scope.timeUnits.length == 0) {
				$scope.addNew();
			}
		};
		
		function saveRegularSettings() {

			var timeLine = '';
		
			for(var i=0; i < $scope.timeUnits.length; i++) {
				timeLine += $scope.timeUnits[i].timeStart+"#"+$scope.timeUnits[i].timeEnd+"#"+$scope.timeUnits[i].daysOfWeek;
				timeLine += '|';
			}

			$scope.onRegularSettingsSaved({msg: timeLine});
		}
		
		function addNew() {
			$scope.timeUnits.push({timeStart:'',timeEnd:'',daysOfWeek:''});
		}
		
		function removeUnit(unit) {
			
			for(var i=0; i < $scope.timeUnits.length; i++) {
				if(unit.daysOfWeek == $scope.timeUnits[i].daysOfWeek && unit.timeStart == $scope.timeUnits[i].timeStart && unit.timeEnd == $scope.timeUnits[i].timeEnd)
				{
					$scope.timeUnits.splice(i, 1);
				}
			}
		}
		
		function translate(code) {
			return automation.Translate(code);
		}
	});
	
})();
