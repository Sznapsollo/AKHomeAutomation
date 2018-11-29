(function(){
  'use strict';

	app.controller('LogsListController', function LogsListController($scope, $rootScope, $route, $compile, $filter, logsDataService, pageDataService) {
		
		$scope.itemscount = 0;
		$scope.dataLoading = true;
		$scope.pageTitle = '';
		$scope.url="";
		$scope.todayFileName = null;
		
		$scope.$on('$routeChangeSuccess',function(evt, absNewUrl, absOldUrl) {
			initiatePageData();
			checkItemsData();
			$scope.logsType = $route.current.params.logsType;
			
			var date = new Date();
			$scope.todayFileName = $scope.logsType + "_" + $filter('date')(new Date(), "yyyyMMdd") + ".log";
		});
		
		$scope.showNoResults = function() {
			if($scope.allCount != undefined)
				return $scope.allCount == 0;
			else
				return false;
		}
		
		$scope.getFileContent = function(fileName) {
			var detailLogNode = document.createElement("log-details");
			detailLogNode.setAttribute("log-name", fileName);
			var detailLogScope = $scope.$new();
			automation.FillAndLaunchLogModal(fileName, $compile(detailLogNode)(detailLogScope));
		}
		
		function checkItemsData() {
			$scope.dataLoading = true;
			logsDataService.checkLogsListData().then(
				function(dataResponse) {
					$scope.dataLoading = false;
					$scope.items = dataResponse.data.items;
					$scope.allCount = dataResponse.data.allCount;
					$rootScope.$broadcast('calculateImagesPaging', $scope.allCount);
				},
				function(response) {
					$scope.dataLoading = false;
					var error = $routeParams.logsType + 'logs data read error';
					console.log(error);
					console.log(response);
				});
		};
		function initiatePageData() {
			pageDataService.checkPageData().then(
				function(dataResponse) {
					automation.SetPageFlags(dataResponse.data.pageflags);
					automation.SetTranslations(dataResponse.data.translations);
					$scope.pageTitle = automation.Translate('logs_' + $scope.logsType);
					$rootScope.$broadcast('translationsReceived');
				},
				function(response) {
					var error = 'Page data read error';
					console.log(error);
					console.log(response);
				});
		};
	});
})();