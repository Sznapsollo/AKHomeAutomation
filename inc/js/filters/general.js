(function(){
	'use strict';
	app.filter('htmlToPlaintext', function() {
		return function(text) {
			return  text ? String(text).replace(/<[^>]+>/gm, '').replace(/\//g, '') : '';
		};
	  }
	);
})();