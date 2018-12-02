(function(){
  'use strict';

	app.controller('TabController', function TabController($scope, $rootScope, $route, itemsDataService, pageDataService) {
		
		$scope.automation = automation;
		$scope.dataLoading = true;
		$scope.boolValue = function(value) {return automation.BoolValue(value)};
		
		init();
		
		function init()
		{
			initiatePageData();
			checkItemsData();
			
			$rootScope.$on('refreshTab', function() {
				checkItemsData();
			});
		};
		
		function checkItemsData() {
			$scope.dataLoading = true;
			itemsDataService.checkItemsData($route.current.$$route.fromValue).then(
				function(dataResponse) {
					$scope.dataLoading = false;
					$scope.data = dataResponse.data;
					if(dataResponse.data.itemsDictionary)
						automation.SetItemsDictionary(dataResponse.data.itemsDictionary);
				},
				function(response) {
					var error = 'Items data read error';
					$scope.dataLoading = false;
					console.log(error);
					console.log(response);
				});
		};
		
		function initiatePageData() {
			pageDataService.checkPageData().then(
				function(dataResponse) {
					automation.SetPageFlags(dataResponse.data.pageflags);
					automation.SetTranslations(dataResponse.data.translations);
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