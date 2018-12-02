(function(){
	'use strict';

	app.controller('GeneralController', function GeneralController($scope, $rootScope, $location) {
		
		function translate(code) {
			return automation.Translate(code);
		};
		
		$scope.pageFlag = automation.PageFlag;
		$scope.currentPath = '';
		$scope.$on('$routeChangeSuccess',function(evt, absNewUrl, absOldUrl) {
			$scope.currentPath = $location.path();
			$scope.itemsPerPage = GetLocalStorage(itemsPerPageStorageName, itemsPerPageDefault);
		});
		
		function translateAll() {
			$scope.homeLabel = translate('homepage');
			$scope.advancedLabel = translate('advanced');
			$scope.sensorsLabel = translate('sensors');
			$scope.adminLabel = translate('admin');
			$scope.itemsLabel = translate('items');
			$scope.carefulLabel = translate('careful');
			$scope.disableLabel = translate('disable');
			$scope.closeLabel = translate('close');
			$scope.logsActionsLabel = translate('logs_actions');
			$scope.logsSensorsLabel = translate('logs_sensors');
			$scope.logsExceptionsLabel = translate('logs_exceptions');
		}
		
		var unbindEventHandler = $rootScope.$on('translationsReceived', translateAll);
		$scope.$on('$destroy', function () {
			unbindEventHandler();
		});
	});
	
})();