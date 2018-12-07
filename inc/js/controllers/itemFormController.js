(function(){
  'use strict';

	app.controller('ItemFormController', function ItemFormController($scope, $rootScope, itemsDataService) {
	
		$scope.confirmDeleteItem = false;
		$scope.arraysToOverride = ['codeOn','itemIDs'];
		$scope.arraysOverrideSuffix = "_Local";
		$scope.requiredFields = ['name','header','category'];
		$scope.invalidName = false;
		$scope.automation = automation;
		$scope.saveItem = saveItem;
		$scope.preDeleteItem = preDeleteItem;
		$scope.deleteItem = deleteItem;
		$scope.item = {};
		$scope.dataLoading = true;
		$scope.isSaveEnabled = isSaveEnabled;
		$scope.manageItemData = manageItemData;
		$scope.categoriesDictionary = [];
		$scope.sendOptionDictionary = [];
		$scope.reorderDictionary = [];
		$scope.devicesDictionary = automation.GetDevicesDictionary();
		$scope.otherElements = otherElements;
		$scope.addNewCollectionItem = addNewCollectionItem;
		$scope.remove = function(array, index){
			array.splice(index, 1);
		};
		
		init();
		
		function init()
		{
			$scope.categoriesDictionary = [{id:'general',description:automation.Translate('homepage')}, {id:'advanced',description: automation.Translate('advanced')}];
			
			$scope.sendOptionDictionary = [{id:0,description:automation.Translate('sendOption_0')}, {id:1,description: automation.Translate('sendOption_1')}, {id:2,description: automation.Translate('sendOption_2')},{id:3,description: automation.Translate('sendOption_3')}, {id:4,description: automation.Translate('sendOption_4')}, {id:5,description: automation.Translate('sendOption_5')}];

			// build reorder dictionary start
			$scope.reorderDictionary.push({id:-1, description:automation.Translate('itemReorderFirst')});
			$scope.devicesDictionary.forEach(function(el, array, index) {
				$scope.reorderDictionary.push({id:el.id, description:automation.Translate('itemReorderAfter')+el.header});
			});
			$scope.reorderDictionary.push({id:99, description:automation.Translate('itemReorderLast')});
			// build reorder dictionary end
			
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
			
			// no duplicated item names
			if($scope.item.name && $scope.item.name.length > 0) {
				for(var devIndex = 0; devIndex < $scope.devicesDictionary.length; devIndex++) {
					if(($scope.devicesDictionary[devIndex].id != $scope.id) && ($scope.item.name == $scope.devicesDictionary[devIndex].id))
					{
						$scope.invalidName = true;
						return false;
					}
				}
			}
			$scope.invalidName = false;
			
			// no empty related Items
			if($scope.item.itemIDs_Local && $scope.item.itemIDs_Local.length > 0 && $scope.item.itemIDs_Local.filter(function(el){return el.value.length == 0}).length > 0) {
				return false;
			}
			
			return automation.CheckRequiredFields($scope.requiredFields, [$scope.item]);
		}
		
		function manageItemData() {
			if($scope.item) {
				if($scope.item.itemIDs_Local && $scope.item.itemIDs_Local.length > 0) {
					$scope.item.sendOption = 5;
				}
				if($scope.item.sendOption == null)
					$scope.item.sendOption = 0;
				if($scope.item.enabled == null)
					$scope.item.enabled = true;
				if($scope.item.enableOff == null)
					$scope.item.enableOff = true;
				if($scope.item.enableOn == null)
					$scope.item.enableOn = true;
			}
		}
		
		function preDeleteItem() {
			$scope.confirmDeleteItem = true;
		}
		
		function deleteItem() {
			$scope.item.__delete = true;
			saveItem();
		}
		
		function saveItem() {
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
			
			$scope.item.__processAction = 0;
			if(!$scope.id)
				$scope.item.__processAction = 1;
			else if($scope.item.__delete)
				$scope.item.__processAction = 2;
				
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
		
		function otherElements(item, dictionary) {
			return dictionary.filter(function(el) {
				return el.value != item.value;
			})
		}
	});
	
})();