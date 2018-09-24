$(document).ready(function()
{
	$("#bodyContainer").on("click", ".toggleOutlet", function(event)
	{
        toggleOutlet($(this));
    });	

    $('#deleteModal').on('show', function() {
	    
	    
	});

    $('.nav a').on('click', function(){
        $('.navbar-toggle').click() //bootstrap 3.x by Richard
    });
});

var toggleOutlet = function(buttonClicked) {
    performAction(buttonClicked.attr('data-outletId'), buttonClicked.attr('data-outletStatus'), buttonClicked.attr('data-outletDelayed'));
};

var performAction = function(id, status, delayed) {
	$.post('executables/toggle.php', {
			outletId: id,
			outletStatus: status,
			outletDelayed: delayed
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
			default:
				return "";
		} 
		
		return "";
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
        $('#logsModal .logBody').html(logBody);
		$('#logsModal .modal-title').html(title);
	    $('#logsModal').modal('show');
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
	
	return {
		GetIcon: function(name, value) {
			return GetIcon(name, value);
		},
		Confirm: function(id, status, delay, message) {
			return Confirm(id, status, delay, message);
		},
		FillAndLaunchLogModal: function(title, logBody) {
			return FillAndLaunchLogModal(title, logBody);
		},
		GetDevicesDictionary: function() {
			return _itemsDictionary;
		},
		Translate: function(code) {
			return Translate(code);
		},
		SetTranslations: function(translations) {
			_translations = translations;
		},
		SetPageFlags: function(pageFlags) {
			_pageFlags = pageFlags;
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

