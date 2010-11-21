function senddata(tab, user) {
    return function() {
	console.log("sending data to user="+user);
	console.log(tab.id);
	chrome.tabs.sendRequest(tab.id, {
            "data": "Hello" + user + "!!"
        }, function(response) {});
    }
}
$(document).ready(function() {
    chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.user) {
	    console.log("request for user="+ request.user);
	    setInterval(senddata(sender.tab, request.user), 120000);
        }
        sendResponse({});
    });
});

