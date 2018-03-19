(function(){
  'use strict';

	app.controller('HoursAndMinutesController', function GeneralController($scope) {
		//console.log("HoursAndMinutesController");
		
		$scope.mathFloor = mathFloor;
		calculateTime();
		
		function mathFloor(number) {
			return Math.floor(number);
		}
		
		$scope.$watch('delayValue', function(newValue, oldValue) {
			if (newValue)
				calculateTime();
		}, true);
		
		function getTime() {
			var date = new Date();
			return date;
		}
		
		function calculateTime() {
		
			$scope.calculatedTime =  new Date((new Date()).getTime() + $scope.delayValue*60000);
		}
	});
	
})();