$(document).ready(function()
{
	$("#bodyContainer").on("click", ".toggleOutlet", function(event)
	{
        toggleOutlet($(this));
    });	

    $('#deleteModal').on('show', function() {
	    
	    
	});

    $("#bodyContainer").on("click", ".confirm-action", function(event) {
	    event.preventDefault();

        $('#deleteModal .confirmTrigger').attr('data-outletId',$(this).attr('data-outletId'));
        $('#deleteModal .confirmTrigger').attr('data-outletStatus',$(this).attr('data-outletStatus'));
        $('#deleteModal .confirmMessage').html($(this).attr('data-outletMessage'));

	    $('#deleteModal').modal('show');
	});

    $('.nav a').on('click', function(){
        $('.navbar-toggle').click() //bootstrap 3.x by Richard
    });
});

var toggleOutlet = function(buttonClicked) {
    performAction(buttonClicked.attr('data-outletId'), buttonClicked.attr('data-outletStatus'), 0);
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

	if(id === "666") {
		$('#deleteModal .modal-body').html(automation.Translate('rpiOffMessage'));
		$('#deleteModal .modal-header').hide();
		$('#deleteModal .modal-footer').hide();
		window.setTimeout(function() {
		location.reload();	
		},5000);
	}
	if(id === "667") {
		$('#deleteModal .modal-body').html(automation.Translate('rpiResetMessage'));
		$('#deleteModal .modal-header').hide();
		$('#deleteModal .modal-footer').hide();
		window.setTimeout(function() {
		location.reload();	
		},20000);
	}
	else {
	   $('#deleteModal').modal('hide'); 
	}
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
	
	function CalendarIconName(value) {
		return "calendar_icon"+value+".jpg";
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
	
	return {
		CalendarIconName: function(value) {
			return CalendarIconName(value);
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

