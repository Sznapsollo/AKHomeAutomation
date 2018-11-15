(function(){
  'use strict';

	app.controller('TabController', function TabController($scope, $rootScope, $route, itemsDataService, pageDataService) {
		
		$scope.translate = translate;
		$scope.dataLoading = true;
		
		init();
		
		function init()
		{
			initiatePageData();
			checkItemsData();
		};
		
		function checkItemsData() {
			$scope.dataLoading = true;
			itemsDataService.checkItemsData($route.current.$$route.fromValue).then(
				function(dataResponse) {
					$scope.dataLoading = false;
					$scope.items = dataResponse.data.items;
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
		
		function translate(code) {
			return automation.Translate(code);
		}
	});
	
})();