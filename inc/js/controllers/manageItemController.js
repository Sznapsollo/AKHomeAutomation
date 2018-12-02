(function(){
  'use strict';

	app.controller('ManageItemController', function ManageItemController($scope, $compile) {
	
		$scope.automation = automation;
		$scope.settingIconName = automation.GetIcon('setting','');
		$scope.openManageItemPanel = openManageItemPanel;

		function openManageItemPanel () {
			var manageItemNode = document.createElement("item-form");
			manageItemNode.setAttribute("id", $scope.id);
			var manageItemScope = $scope.$new();
			automation.LaunchItemModal($compile(manageItemNode)(manageItemScope));
		}
	});
	
})();