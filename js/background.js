chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
	var searches = {};
	try {
		searches = JSON.parse(localStorage['searches']);
	} catch(e) {

	}
	var text = text.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
	var search_array = [];
	for(var d in searches) {
		if(d.match(new RegExp(text, "i"))) {
			search_array.push({
				content:    d,
				description:d
			});
		}
	}
	suggest(search_array);
});
/** */
chrome.omnibox.onInputEntered.addListener(function(text) {
	var searches = {};
	try {
		searches = JSON.parse(localStorage['searches']);
	} catch(e) {

	}
	if(text && !/^\s*$/.test(text)) {
		searches[text] = true;
		localStorage['searches'] = JSON.stringify(searches);
		window.open('http://www.amazon.com/gp/search?keywords=' + text + '&tag=top10com05-20');
	} else {
		window.open('http://www.amazon.com?tag=top10com05-20');
	}
});