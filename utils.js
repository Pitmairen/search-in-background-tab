
export const Utils = {
	TEST_SEARCH : 'fdmKp5WB8ZHmItVEaaoGUjVsdgFpGSoz3opDi5g5CyunHVGyy8dMWpM',
	DEFAULT_PATTERN : 'https://www\\.google\\.\\w+?/search\\?q=.*?&sourceid=chrome.*',

	get_url_pattern: async function(){
		var value = await chrome.storage.local.get("pattern");
		if (!value.pattern) {
			return this.DEFAULT_PATTERN;
		}
		return value.pattern;
	},

	set_url_pattern: async function(pattern){
		await chrome.storage.local.set({"pattern": pattern});
	},

	delete_url_pattern : async function(){
		await chrome.storage.local.remove("pattern");
	},

	get_url_regexp : async function(){
		return new RegExp(await this.get_url_pattern(), 'i');
	},

	escape_regexp : function(str){
		return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	},

	is_search_url : async function(url){

		if(!url){
			return false
		}

		if(this.is_test_search_url(url)){
			let pat = this.escape_regexp(url);
			pat = pat.replace(new RegExp(this.TEST_SEARCH, 'g'), '.*?');
			pat = pat.replace(/gcx=\w+/ig, 'gcx=.*?');
			pat = pat.replace(/aqs=[\.\w\d\\]+/gi, 'aqs=.*?');
			await this.set_url_pattern(pat);

			await chrome.runtime.sendMessage({act:'pattern_updated', pattern:pat});

			return true;
		}
		return Boolean(url.match(await this.get_url_regexp()));
	},

	is_test_search_url : function(url){
		if(!url){
			return false
		}
		return url.indexOf(this.TEST_SEARCH) != -1;
	}
}
