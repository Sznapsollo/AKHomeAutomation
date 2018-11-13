(function(){
  'use strict';

	app.controller('LogDetailsController', function LogDetailsController($scope, $route, logsDataService) {
		
		$scope.orderByType = true;
		$scope.checkLogDetails = checkLogDetails;
		$scope.translate = translate;
		$scope.dropdownItemsData = [];
		
		$scope.$on('$routeChangeSuccess',function(evt, absNewUrl, absOldUrl) {
			checkItemsData();
			$scope.logsType = $route.current.params.logsType;
		});
		
		function init() {
			checkLogDetails();
			var filterDropdownValues = automation.PageFlag("logsDropdownFilter");
			if(filterDropdownValues) {
				for(var filterDropdownValuesIndex = 0; filterDropdownValuesIndex < filterDropdownValues.length; filterDropdownValuesIndex++) {
					if(filterDropdownValues[filterDropdownValuesIndex].name == $route.current.params.logsType) {
						$scope.dropdownItemsData = filterDropdownValues[filterDropdownValuesIndex].values;
						
						if($scope.dropdownItemsData && $scope.dropdownItemsData.length > 0)
							$scope.dropdownItemsSelected = $scope.dropdownItemsData[0];
						break;
					}
				}
			}
		}
		
		init();
		
		function checkLogDetails() {
			$scope.dataLoading = true;
			logsDataService.checkLogsFileData($scope.logName).then(
				function(dataResponse) {
					$scope.dataLoading = false;
					$scope.logContentLines = dataResponse.data.loglines.filter(function(el) { return el; });
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