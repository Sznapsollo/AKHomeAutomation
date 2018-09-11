(function(){
  'use strict';

	app.controller('HoursAndMinutesController', function GeneralController($scope) {
		//console.log("HoursAndMinutesController");
		
		$scope.mathFloor = mathFloor;
		$scope.translate = translate;
		
		function mathFloor(number) {
			return Math.floor(number);
		}
		
		function getTime() {
			var date = new Date();
			return date;
		}

		function translate(code) {
			return automation.Translate(code);
		}
	});
	
})();