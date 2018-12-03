(function(){
  'use strict';

	app.controller('ItemFormController', function ItemFormController($scope, $rootScope, itemsDataService) {
	
		$scope.arraysToOverride = ['codeOn','itemIDs'];
		$scope.arraysOverrideSuffix = "_Local";
		$scope.requiredFields = ['name','header','category'];
		$scope.automation = automation;
		$scope.save = save;
		$scope.item = {};
		$scope.dataLoading = true;
		$scope.isSaveEnabled = isSaveEnabled;
		$scope.manageItemData = manageItemData;
		$scope.categoriesDictionary = [{id:'general',description:'General'}, {id:'advanced',description: 'Advanced'}];
		$scope.sendOptionDictionary = [{id:0,description:automation.Translate('sendOption_0')}, {id:1,description: automation.Translate('sendOption_1')}, {id:2,description: automation.Translate('sendOption_2')},{id:3,description: automation.Translate('sendOption_3')}, {id:4,description: automation.Translate('sendOption_4')}, {id:5,description: automation.Translate('sendOption_5')}];
		$scope.devicesDictionary = automation.GetDevicesDictionary();
		$scope.addNewCollectionItem = addNewCollectionItem;
		$scope.remove = function(array, index){
			array.splice(index, 1);
		};
		
		init();
		
		function init()
		{
			checkItemsData();
		};
		
		function addNewCollectionItem(collectionName, value) {
			if(!$scope.item[collectionName])
				$scope.item[collectionName] = [];
				
			if(!value) {
				$scope.item[collectionName].push({value: ""});
			}
			else
				$scope.item[collectionName].push({value: value});
		}
		
		function convertServerCollectionToLocal(collectionName, serverCollection) {
			if(Array.isArray(serverCollection) && serverCollection.length > 0) {
				serverCollection.forEach(function(el, index, array) {
					addNewCollectionItem(collectionName, el);
				});
			}
		}
		
		function convertLocalCollectionToServer(localCollection) {
			var collectionResult = [];
			if(Array.isArray(localCollection) && localCollection.length > 0) {
				localCollection.forEach(function(el, index, array) {
					collectionResult.push(el.value);
				});
			}
			return collectionResult;
		}
		
		function checkItemsData() {
			$scope.dataLoading = true;
			itemsDataService.checkItemData($scope.id).then(
				function(dataResponse) {
					$scope.dataLoading = false;
					
					if(dataResponse.data && dataResponse.data.item && dataResponse.data.item.properties) {
						var itemServerObject = dataResponse.data.item.properties;
						for (var property in itemServerObject) {
							if (itemServerObject.hasOwnProperty(property)) {
								if($scope.arraysToOverride.includes(property)) {
									convertServerCollectionToLocal(property + $scope.arraysOverrideSuffix, itemServerObject[property]);
								}
								else {
									$scope.item[property] = itemServerObject[property];
								}
							}
						}
						manageItemData();
					}
				},
				function(response) {
					var error = 'Item data read error';
					$scope.dataLoading = false;
					console.log(error);
					console.log(response);
				});
		};
		
		function isSaveEnabled() {
			manageItemData();
			return automation.CheckRequiredFields($scope.requiredFields, [$scope.item]);
		}
		
		function manageItemData() {
			if($scope.item && $scope.item.itemIDs_Local && $scope.item.itemIDs_Local.length > 0) {
				$scope.item.sendOption = 5;
			}
		}
		
		function save() {
			for (var property in $scope.item) {
				if ($scope.item.hasOwnProperty(property)) {
					if(property.endsWith($scope.arraysOverrideSuffix)) {
						var orgPropertyName = property.slice(0, -1*$scope.arraysOverrideSuffix.length);
						if($scope.arraysToOverride.includes(orgPropertyName)) {
							$scope.item[orgPropertyName] = convertLocalCollectionToServer($scope.item[property]);
						}
					}
				}
			}
			
			$scope.dataLoading = true;
			var propertiesToOmmit = $scope.arraysToOverride.map(function(el){return el+$scope.arraysOverrideSuffix});
			itemsDataService.setItemData(JSON.stringify(automation.OmitKeys($scope.item, propertiesToOmmit))).then(
				function(dataResponse) {
					$scope.dataLoading = false;
					automation.CloseItemModal();
					$rootScope.$broadcast('refreshTab');
				},
				function(response) {
					var error = 'Items data set error';
					$scope.dataLoading = false;
					console.log(error);
					console.log(response);
				});
			
		}
	});
	
})();