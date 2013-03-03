
var _timer = null;
function flash_updated(){
	document.querySelector('#flash').style.opacity = 1;

	if(_timer != null)
		clearTimeout(_timer);

	_timer = setTimeout(function(){
		document.querySelector('#flash').style.opacity = 0;
		_timer = null;
	}, 2500);

}



chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

		if (request.act == "pattern_updated"){
			document.querySelector('#pattern').value = request.pattern;
			flash_updated();
		}

		sendResponse({});
});

function on_loaded(){

	function update_pattern(p){
		p.value = Utils.get_url_pattern();
	}

	var pattern = document.querySelector('#pattern');
	update_pattern(pattern);

	var test_search = document.querySelector('#test_search');
	test_search.innerText = Utils.TEST_SEARCH;


	var restore = document.querySelector('#restore');

	restore.addEventListener('click', function(){

		Utils.delete_url_pattern();
		update_pattern(pattern);

	}, false);


	function on_change(){
		Utils.set_url_pattern(this.value);
	}


	pattern.addEventListener('change', on_change, false);
	pattern.addEventListener('keyup', on_change, false);
	pattern.addEventListener('paste', on_change, false);
}


document.addEventListener('DOMContentLoaded', on_loaded, false);


