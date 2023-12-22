
var _last_selected = {}
var _search_opened = {}



chrome.tabs.onCreated.addListener(function (tab){

	if(Utils.is_search_url(tab.url || tab.pendingUrl)){
		_search_opened[tab.id] = new Date().getTime();
	}


});

chrome.tabs.onRemoved.addListener(function (tabid){

	if(tabid in _search_opened)
		delete _search_opened[tabid];

});


chrome.tabs.onActivated.addListener(function(activeInfo) {

	if((activeInfo.tabId in _search_opened) && (_search_opened[activeInfo.tabId] > (new Date().getTime() - 50))){

		if(activeInfo.windowId in _last_selected){

			chrome.tabs.update(_last_selected[activeInfo.windowId], {selected: true});

			chrome.tabs.get(activeInfo.tabId, function(tab){
				if(Utils.is_test_search_url(tab.url || tab.pendingUrl))
					chrome.tabs.remove(tab.id);
			});

		}
	}
	else{
		_last_selected[activeInfo.windowId] = activeInfo.tabId;
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

