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
		$scope.dataLoading = true;
		
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
				if($scope.timeUnits[i].timeStart || $scope.timeUnits[i].timeEnd) {
					if($scope.timeUnits[i].timeStart && $scope.timeUnits[i].timeEnd) {
						if($scope.timeUnits[i].timeEnd.getHours() < $scope.timeUnits[i].timeStart.getHours()) {
							valid = false;
							break;
						}
						else if($scope.timeUnits[i].timeEnd.getHours() == $scope.timeUnits[i].timeStart.getHours() && ($scope.timeUnits[i].timeEnd.getMinutes() <= $scope.timeUnits[i].timeStart.getMinutes())) {
							valid = false;
							break;
						}
					}
				}
				else {
					valid = false;
					break;
				}
			}
			
			return valid;
		}
		
		function init()
		{
			$scope.dataLoading = true;
			if($scope.regularActionData !== undefined && $scope.regularActionData.length > 0) {
				$scope.regularActionData = JSON.parse($scope.regularActionData);
				if(!($scope.regularActionData.length == 0)) {
					$scope.regularActionData.timeUnits.forEach(function(element, index) { 
						$scope.timeUnits.push({timeStart:new Date(1970,0,1,element.timeStart.split(':')[0],element.timeStart.split(':')[1],0),timeEnd:new Date(1970,0,1,element.timeEnd.split(':')[0],element.timeEnd.split(':')[1],0),daysOfWeek:element.daysOfWeek,random:element.random});
					});
				}
			}
			
			if($scope.timeUnits.length == 0) {
				$scope.addNew();
			}
			$scope.dataLoading = false;
		};
		
		function saveRegularSettings() {

			var timeLine = '';

			for(var i=0; i < $scope.timeUnits.length; i++) {
				if($scope.timeUnits[i].timeStart && !isNaN($scope.timeUnits[i].timeStart.getTime()))
					timeLine += $scope.timeUnits[i].timeStart.getHours()+":"+$scope.timeUnits[i].timeStart.getMinutes();
				timeLine += '#';
				if($scope.timeUnits[i].timeEnd && !isNaN($scope.timeUnits[i].timeEnd.getTime()))
					timeLine += $scope.timeUnits[i].timeEnd.getHours()+":"+$scope.timeUnits[i].timeEnd.getMinutes();
				timeLine += '#';
				timeLine += $scope.timeUnits[i].daysOfWeek;
				if($scope.randomEnabled) {
					timeLine += '#';
					if($scope.timeUnits[i].random)
						timeLine += 'true';
					else
						timeLine += 'false';
				}
				timeLine += '|';
			}

			$scope.onRegularSettingsSaved({msg: timeLine});
		}
		
		function addNew() {
			$scope.timeUnits.push({timeStart:new Date(1970,0,1,0,0,0),timeEnd:new Date(1970,0,1,0,0,0),daysOfWeek:''});
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
