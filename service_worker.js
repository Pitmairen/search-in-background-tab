import { Utils } from './utils.js';

chrome.tabs.onCreated.addListener(async function (tab){
	if(await Utils.is_search_url(tab.url || tab.pendingUrl)){
		if(tab.openerTabId){
			await chrome.tabs.update(tab.openerTabId, {selected: true});
			if(Utils.is_test_search_url(tab.url || tab.pendingUrl)){
				await chrome.tabs.remove(tab.id);
			}
		}
	}
});

