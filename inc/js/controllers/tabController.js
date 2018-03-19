(function(){
  'use strict';

	app.controller('TabController', function TabController($scope, $rootScope, $route, itemsDataService) {
		
		$scope.translate = translate;
		
		init();
		
		function init()
		{
			checkItemsData();
		};
		
		function checkItemsData() {
			itemsDataService.checkItemsData($route.current.$$route.fromValue).then(
				function(dataResponse) {
					$scope.items = dataResponse.data.items;
					automation.SetTranslations(dataResponse.data.translations);
					if(dataResponse.data.itemsDictionary)
						automation.SetItemsDictionary(dataResponse.data.itemsDictionary);
						
					$rootScope.$broadcast('translationsReceived');
				},
				function(response) {
					var error = 'Items data read error';
					console.log(error);
					console.log(response);
				});
		}
		
		function translate(code) {
			return automation.Translate(code);
		}
	});
	
})();