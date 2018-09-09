(function() {
  

  app.directive('powerSwitch', function() {
		return {
			restrict: 'E',
			scope: {
				header: '@',
				image: '@',
				outletId: '@',
				delay: '@',
				enableOn: '@',
				enableOff: '@',
				subType: '@',
				questionOn: '@',
				questionOff: '@',
				regularActions: '@',
			},
			templateUrl: 'templates/directives/powerswitch.html',
			controller: 'RFButtonsController',
		};
	});
	
	app.directive('hoursAndMinutes', function() {
		return {
			restrict: 'E',
			scope: {
				delayValue: '=',
				showDate: '@',
				onDelayedDisableClicked:'&'
			},
			templateUrl: 'templates/directives/hoursandminutes.html',
			controller: 'HoursAndMinutesController'
		};
	});
	
	app.directive('regularSettings', function() {
		return {
			restrict: 'E',
			scope: {
				outletId: '@',
				regularActionData: '@',
				onRegularSettingsSaved:'&'
			},
			templateUrl: 'templates/directives/regularsettings.html',
			controller: 'RegularSettingsController',
		};
	});
	
	app.directive('sensorItem', function() {
		return {
			restrict: 'E',
			scope: {
				header: '@',
				outletId: '@',
				timeUnits: '@',
				onDevices: '@',
				customData: '@'
			},
			templateUrl: 'templates/directives/sensoritem.html',
			controller: 'SensorItemController',
		};
	});
	
	app.directive('sensorDevicesSettings', function() {
		return {
			restrict: 'E',
			scope: {
				outletId: '@',
				sensorDevicesData: '@',
				onSensorDevicesSettingsSaved:'&'
			},
			templateUrl: 'templates/directives/sensordevicessettings.html',
			controller: 'SensorDevicesSettingsController',
		};
	});
	
	app.directive('pager', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/directives/pager.html',
			controller: 'PagerController',
			scope: {
				page: '@'
			},
		};
	});
	
	app.directive('logDetails', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/directives/logdetails.html',
			controller: 'LogDetailsController',
			scope: {
				logName: '@'
			},
		};
	});
	
	app.directive('ngConfirmClick', [
        function() {
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click', function (event) {
                        if (window.confirm(msg)) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
    }]);
  
})();
