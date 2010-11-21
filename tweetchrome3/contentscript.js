var doit = function(data) {
    var sampletext = data;
    var mydiv = document.getElementById("TLCONTENT");
    if (mydiv === null) {
        console.log("mydiv is null");
        var divhtml = '<div id="dTLInfo" class="TLinfo"></div>';
        mydiv = document.createElement("div");
        mydiv["id"] = "TLCONTENT";
        mydiv.innerHTML = divhtml;
        document.body.appendChild(mydiv);
    }
    $("#dTLInfo").append("<p>" + sampletext + "</p>");
    console.log("doit done");
}
$(document).ready(function() {

    chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.data) {
            doit(request.data);
            console.log("data request!!!");
        }
        sendResponse({});
    });

    var currenturl = document.location.href;
    var twitteruserurlpat = /^(http|https)\:\/\/twitter\.com\/[a-zA-Z0-9_]+$/;
    if (twitteruserurlpat.test(currenturl)) {
        var currentUser = currenturl.replace(/(http|https)\:\/\/twitter\.com\//g, '');
        chrome.extension.sendRequest({
            "user": currentUser
        }, function() {
            console.log("presense posted!!")
        });
        console.log("chrome.extension.sendRequest sent");
    }
    else {
        console.log("not a twitter user page");
    }

});

