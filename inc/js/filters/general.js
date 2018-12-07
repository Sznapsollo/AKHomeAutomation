(function(){
	'use strict';
	app.filter('htmlToPlaintext', function() {
		return function(text) {
			return  text ? String(text).replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') : '';
		};
		}
	);
	
	app.filter('excludeFrom', function() {
		return function(inputArray,filterCriteria) {
			return inputArray.filter(function(item){
				return !filterCriteria || filterCriteria.filter(function(el) { return el.value == item.id }).length == 0;
			});
		};
	});
})();