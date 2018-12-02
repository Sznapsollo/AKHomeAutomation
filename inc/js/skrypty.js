$(document).ready(function()
{
	$("#bodyContainer").on("click", ".toggleOutlet", function(event)
	{
		toggleOutlet($(this));
	});
});

var toggleOutlet = function(buttonClicked) {
    performAction(buttonClicked.attr('data-outletId'), buttonClicked.attr('data-outletStatus'), buttonClicked.attr('data-outletDelayed'));
};

var performAction = function(id, status, delayed) {
	$.post('executables/toggle.php', {
			outletId: id,
			outletStatus: status,
			outletDelayed: delayed,
			outletSource: 'Web',
		},
		function(data, status) {
			console.log(status);
		});

	$('#deleteModal').modal('hide'); 
}

var itemsPerPageDefault = 48;
var itemsPerPageStorageName = 'itemsPerPage';

function SetLocalStorage(name, value) {
    localStorage[name] = value;
}

function GetLocalStorage(index, defaultValue) {
	if(localStorage[index] == undefined)
		return defaultValue;
	else {
	
		if(typeof defaultValue === 'boolean')
			return JSON.parse(localStorage[index]);
		else
			return localStorage[index];
	}
}

var automation = function() {
	
	_pageFlags = null;
	_translations = null;
	_itemsDictionary = null;
	
	function CheckRequiredFields(requiredFields, collection) {
		if(!collection)
			return false;
		
		for(var requiredIndex = 0; requiredIndex < requiredFields.length; requiredIndex++) {
			for(var devicesIndex = 0; devicesIndex < collection.length; devicesIndex++) {
				if(!collection[devicesIndex][requiredFields[requiredIndex]])
					return false;
			}
		}
		return true;
	}
	
	function GetIcon(name, value) {
		
		switch(name) {
			case "calendar":
				return "calendar_icon"+value+".jpg";
				break;
			case "action":
				return "actions_icon"+value+".jpg";
				break;
			case "alarmTimeUnits":
				return "alarm_time_units_icon"+value+".jpg";
				break;
			case "alarmDevices":
				return "alarm_devices_icon"+value+".jpg";
				break;
			case "setting":
				return "settings_icon"+value+".jpg";
				break;
			default:
				return "";
		} 
		
		return "";
	}
	
	function ProcessPageFlags() {
		if(_pageFlags.serverDateTime) {
			var currentTime = new Date()
			var localTimeStamp = Math.floor(Date.now() / 1000);
			var localTime = currentTime.getHours() + ":" + currentTime.getMinutes();
			var timestampDiff = _pageFlags.serverDateTime.serverTimeStamp - localTimeStamp
			if(timestampDiff > 10 * 60 * 1000) {
				_pageFlags.timeDifferenceDetected = true;
				console.log('Difference in time: ' + timestampDiff);
				console.log('Server time:' + _pageFlags.serverDateTime.serverCompareTime);
				console.log('Local time:' + localTime);
			}
		}
	}
	
	function Translate(code) {
		if(_translations == null)
			return "";
			
		for(var translation of _translations) {
			if(translation.code == code)
				return translation.description;
		}
		
		return code;
	}
	
	function FillAndLaunchLogModal(title, logBody) {
		$('#modalDialog .modal-body-p').html(logBody);
		$('#modalDialog .modal-title').html(title);
		$('#modalDialog').modal('show');
	}
	
	function LaunchItemModal(body) {
		$('#modalItemDialog .modal-content').html(body);
		$('#modalItemDialog').modal('show');
	}
	
	function CloseItemModal() {
		$('#modalItemDialog .modal-content').html('');
		$('#modalItemDialog').modal('toggle');
	}
	
	function Confirm(id, status, delay, message) {
	
		var buttonLabel = status == 'on' ? Translate('enable') : Translate('disable');
		
		$('#deleteModal .confirmTrigger').attr('data-outletId',id);
        $('#deleteModal .confirmTrigger').attr('data-outletStatus',status);
		$('#deleteModal .confirmTrigger').attr('data-outletDelayed',delay);
		$('#deleteModal .confirmTrigger').html(buttonLabel);
        $('#deleteModal .confirmMessage').html(message);

	    $('#deleteModal').modal('show');
	}
	
	function OmitKeys(obj, keys)
	{
		var dup = {};
		for (var key in obj) {
			if (keys.indexOf(key) == -1) {
				dup[key] = obj[key];
			}
		}
		return dup;
	}
	
	return {
		BoolValue: function(value) {
			if (typeof value === "boolean"){
				return value;
			}
			else
				return (value && (value.toLowerCase() == 'true'));
		},
		CheckRequiredFields: function(requiredFields, collection) {
			return CheckRequiredFields(requiredFields, collection);
		},
		GetIcon: function(name, value) {
			return GetIcon(name, value);
		},
		Confirm: function(id, status, delay, message) {
			return Confirm(id, status, delay, message);
		},
		FillAndLaunchLogModal: function(title, logBody) {
			return FillAndLaunchLogModal(title, logBody);
		},
		LaunchItemModal: function(body) {
			return LaunchItemModal(body);
		},
		CloseItemModal: function() {
			return CloseItemModal();
		},
		GetDevicesDictionary: function() {
			return _itemsDictionary;
		},
		GlobalHTACCESSWarning: function() { 
			return Translate("htaccessWarning");
		},
		OmitKeys: function(obj, keys) {
			return OmitKeys(obj, keys);
		},
		Translate: function(code) {
			return Translate(code);
		},
		SetTranslations: function(translations) {
			_translations = translations;
		},
		SetPageFlags: function(pageFlags) {
			_pageFlags = pageFlags;
			ProcessPageFlags();
		},
		PageFlag: function(code) {
			if(!_pageFlags)
				return null;
			else
				return _pageFlags[code];
		},
		SetItemsDictionary: function(itemsDictionary) {
			_itemsDictionary = itemsDictionary;
		}
	}
}();

