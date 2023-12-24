import { Utils } from "./utils.js";

let _timer = null;
function flash_updated(){
	document.querySelector('#flash').style.opacity = 1;

	if(_timer != null)
		clearTimeout(_timer);

	_timer = setTimeout(function(){
		document.querySelector('#flash').style.opacity = 0;
		_timer = null;
	}, 2500);

}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

		if (request.act == "pattern_updated"){
			document.querySelector('#pattern').value = request.pattern;
			flash_updated();
		}

		sendResponse({});
});

async function on_loaded(){

	async function update_pattern(p){
		p.value = await Utils.get_url_pattern();
	}

	var pattern = document.querySelector('#pattern');
	await update_pattern(pattern);

	var test_search = document.querySelector('#test_search');
	test_search.innerText = Utils.TEST_SEARCH;


	var restore = document.querySelector('#restore');

	restore.addEventListener('click', async function(){

		await Utils.delete_url_pattern();
		await update_pattern(pattern);

	}, false);


	async function on_change(){
		await Utils.set_url_pattern(this.value);
	}


	pattern.addEventListener('change', on_change, false);
	pattern.addEventListener('keyup', on_change, false);
	pattern.addEventListener('paste', on_change, false);
}


document.addEventListener('DOMContentLoaded', on_loaded, false);
