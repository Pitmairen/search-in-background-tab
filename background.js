
var _last_selected = {}
var _search_opened = {}



chrome.tabs.onCreated.addListener(function (tab){

	if(Utils.is_search_url(tab.url)){
		_search_opened[tab.id] = new Date().getTime();
	}


});

chrome.tabs.onRemoved.addListener(function (tabid){

	if(tabid in _search_opened)
		delete _search_opened[tabid];

});


chrome.tabs.onSelectionChanged.addListener(function(tabid, selectinfo) {


	if((tabid in _search_opened) && (_search_opened[tabid] > (new Date().getTime() - 50))){

		if(selectinfo.windowId in _last_selected){

			chrome.tabs.update(_last_selected[selectinfo.windowId], {selected: true});

			chrome.tabs.get(tabid, function(tab){
				if(Utils.is_test_search_url(tab.url))
					chrome.tabs.remove(tab.id);
			});

		}
	}
	else{
		_last_selected[selectinfo.windowId] = tabid;
	}
});


chrome.windows.onRemoved.addListener(function(windowId){

	if(windowId in _last_selected)
		delete _last_selected[windowId];

});



chrome.windows.getCurrent(function(window){

	chrome.tabs.getSelected(window.id, function (tab){

		_last_selected[window.id] = tab.id;

	});

});
