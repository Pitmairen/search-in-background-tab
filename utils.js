
var Utils = {
	TEST_SEARCH : 'fdmKp5WB8ZHmItVEaaoGUjVsdgFpGSoz3opDi5g5CyunHVGyy8dMWpM',
	DEFAULT_PATTERN : 'https://www\\.google\\.\\w+?/search\\?q=.*?&sourceid=chrome.*',

	get_url_pattern: function(){

		var pattern = localStorage["pattern"];
		if (!pattern) {
			return this.DEFAULT_PATTERN;
		}
		return pattern;
	},

	set_url_pattern: function(pattern){

		localStorage["pattern"] = pattern;
	},

	delete_url_pattern : function(){
		localStorage.removeItem("pattern");
	},

	get_url_regexp : function(){

		return new RegExp(this.get_url_pattern(), 'i');
	},

	escape_regexp : function(str){

		return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	},

	is_search_url : function(url){

		if(this.is_test_search_url(url)){
			pat = this.escape_regexp(url);
			pat = pat.replace(new RegExp(this.TEST_SEARCH, 'g'), '.*?');
			pat = pat.replace(/gcx=\w+/ig, 'gcx=.*?');
			pat = pat.replace(/aqs=[\.\w\d\\]+/gi, 'aqs=.*?');
			this.set_url_pattern(pat);

			chrome.extension.sendRequest({act:'pattern_updated', pattern:pat});

			return true;
		}
		return Boolean(url.match(this.get_url_regexp()));
	},

	is_test_search_url : function(url){
		return url.indexOf(this.TEST_SEARCH) != -1;
	}

}
