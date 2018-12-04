(function(){
  'use strict';

	app.controller('ManageItemController', function ManageItemController($scope, $compile) {
	
		$scope.automation = automation;
		$scope.settingIconName = automation.GetIcon('setting','');
		$scope.openItemFormPanel = openItemFormPanel;

		function openItemFormPanel (id) {
			var itemFormNode = document.createElement("item-form");
			if(id)
				itemFormNode.setAttribute("id", id);
			var itemFormScope = $scope.$new();
			automation.LaunchItemModal($compile(itemFormNode)(itemFormScope));
		}
	});
	
})();