(function(){
  'use strict';

	app.controller('GeneralController', function GeneralController($scope, $rootScope) {
		
		function translate(code) {
			return automation.Translate(code);
		};
		
		$scope.pageFlag = automation.PageFlag;
		
		$scope.$on('$routeChangeSuccess',function(evt, absNewUrl, absOldUrl) {
		   $scope.itemsPerPage = GetLocalStorage(itemsPerPageStorageName, itemsPerPageDefault);
		});
		
		function translateAll() {
			$scope.homeLabel = translate('homepage');
			$scope.tab2Label = translate('tab2');
			$scope.tab3Label = translate('tab3');
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