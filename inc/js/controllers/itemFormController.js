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
		$scope.categoriesDictionary = [{id:'general',description:'General'}, {id:'advanced',description: 'Advanced'}];
		$scope.sendOptionDictionary = [{id:0,description:'Radio Type 1'}, {id:1,description: 'Radio Type 2'}, {id:2,description: 'Web Type'},{id:3,description: 'Mac Addr. Type'}, {id:4,description: 'Shell Type'}];
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
			return automation.CheckRequiredFields($scope.requiredFields, [$scope.item]);
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