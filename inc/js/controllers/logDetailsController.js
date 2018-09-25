(function(){
  'use strict';

	app.controller('LogDetailsController', function LogDetailsController($scope, logsDataService) {
		
		$scope.orderByType = true;
		$scope.checkLogDetails = checkLogDetails;
		$scope.translate = translate;
		
		$scope.$on('$routeChangeSuccess',function(evt, absNewUrl, absOldUrl) {
		   checkItemsData();
		   $scope.logsType = $route.current.params.logsType;
		});
		
		checkLogDetails();
		
		function checkLogDetails() {
			$scope.dataLoading = true;
			logsDataService.checkLogsFileData($scope.logName).then(
				function(dataResponse) {
					$scope.dataLoading = false;
					$scope.logContentLines = dataResponse.data.loglines;
				},
				function(response) {
					var error = $routeParams.logsType + ' ' + $scope.logName + ' file data read error';
					$scope.dataLoading = false;
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