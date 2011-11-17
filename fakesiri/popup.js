var waitmsg = ['Let me search...', 'I am thinking. ', 'Please wait..', 'Just a sec..', 'hold on..'];
var NoisyImageDataUrl = null;
var isAskingQuestion = false;

var questionContext = false;

var sorrymsg = ['Sorry, i don\'t know about it!', 'No comments from me on that!', 'Not sure abut it.', 'Sorry, i don\'t have answer!', 'I am sorry!, not able to answer you at this time. ', 'can you rephrase your question?', ];

var myInterpretation = ['So you asked about ', 'If Your question is about ', 'I interpreted is as ', 'Cool!  ', 'So, ', 'This is what i got about '];
var ytPlayer;
var ignoreWA=false;
function getYouTube(query) {
    var url = 'http://gdata.youtube.com/feeds/api/videos?q=' + escape(query) + '&alt=jsonc&max-results=1&v=2&callback=?';
    $.getJSON(url, function (data) {
        if (data.data && data.data.items.length > 0) {
            $('#utplay').remove();
            if (ytPlayer) {
                chrome.tabs.remove(ytPlayer.id);
            }
            siriSaid('Playing....' + data.data.items[0].title + '<br><br><div id="utplay"></div>', "Playing " + data.data.items[0].title);
            ytPlayer = getEmbedYouTube(data.data.items[0].id, 'utplay');
        } else {
            siriSaid("Nothing to play", "Nothing to play");
        }
    });
}
function analyseMap(data){
    if(!data || !data.query || !data.query.results || !data.query.results.matches){
        return [];
    }
    var match=data.query.results.matches.match;
    var matchC=match.length;

    if(!matchC){
        return [match.place];
    }
    else{
        var ret=[];
        for(var i=0;i<matchC;i++){
            if(match[i].place.type!=="Continent" && match[i].place.type!=="State" && match[i].place.type!=="Country" ){
                ret[ret.length]=match[i].place;
            }
        }
        return ret;
    }

}
function placeMaker(str){
    var url='http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20geo.placemaker%20WHERE%20documentContent%20%3D%20%22'+ escape(str)+'%22%20AND%20documentType%3D%22text%2Fplain%22&format=json&diagnostics=true&callback=?';
    $.getJSON(url, function (data) {
       var p=analyseMap(data);
       if(p.length>=2){
           ignoreWA=true;
           var from=escape(p[0].name);
           var to=escape(p[1].name);
           var msg="Here are the directions.";
           var iframe=msg+'<br><iframe width="365" height="504" src="http://www.purplegene.com/map?f='+from+'&t='+to+'" frameborder="0" allowfullscreen></iframe>';
           siriSaid(iframe, msg);
       }
    });
}
function getEmbedYouTube(videoID, divID) {
    //var iframe='<iframe width="300" height="200" src="http://www.youtube.com/embed/'+videoID+'?autoplay=1" frameborder="0" allowfullscreen></iframe>';
    //$("#"+divID).html(iframe);
    var url = 'http://www.youtube.com/watch?v=' + videoID;
    chrome.tabs.create({
        'url': url,
        'selected': false
    }, function (t) {
        ytPlayer = t;
    });
}

function getWaAttributionString(query) {
    var str = 'Wolfram Alpha LLC. 2009. Wolfram|Alpha.<br> http://www.wolframalpha.com/input/?i=' + escape(query);
    var str = str + '<br>(access ' + (new Date).toDateString() + ')';
    return str;
}

function generateNoise(opacity) {
    if (NoisyImageDataUrl !== null) {
        $('html').css('backgroundImage', NoisyImageDataUrl);
        return true;
    }
    if ( !! !document.createElement('canvas').getContext) {
        return false;
    }
    opacity = opacity || 0.2;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    var x, y, number;

    canvas.width = 5;
    canvas.height = Math.round(3 + Math.random(0, 1) * 5);
    for (x = 0; x < canvas.width; x++) {
        for (y = 0; y < canvas.height; y++) {
            number = Math.floor(Math.random() * 255);
            ctx.fillStyle = "rgba(" + number + "," + number + "," + number + "," + opacity + ")";
            ctx.fillRect(x, y, 1, 1);
        }
    }
    NoisyImageDataUrl = "url(" + canvas.toDataURL("image/png") + ")";
    var t = $('<style>');
    t.text('html,body{background-image:' + NoisyImageDataUrl + ';}')
    $('head').append(t);

    return true;

}

function explainYourself() {
    var v = "Here is what I can help you with!"
    v = v + "<br>Ask for Time, like time in New Delhi.";
    v = v + "<br>Ask for Person, like who is steve jobs.";
    v = v + "<br>Ask math, like multiply 1234 by 786.";
    v = v + "<br>Ask for temperature, like What is the temperature in Boston?";
    v = v + "<br>You can Ask for a joke!";
    v = v + "<br>You can ask to simplify a relationship, like mother's father's son";
    v = v + "<br>You can ask some data, revenue of microsoft";
    v = v + "<br>You can express your feeling if you love me!";

    var utter = v.replace(/\<br\>/g, ' ');
    siriSaid(v, utter);
}
var QueryTimer = null;

function getRandomMsg(msg) {
    var c = msg.length;
    var index = Math.round(Math.random(0, 1) * c);
    index = index % c;
    return msg[index];
}
function isHavingCommand(str,cmd,anyWhere){
    str=str.toLowerCase();
    cmd=cmd.toLowerCase();
    var match=null;
    if(!anyWhere){
        match=str.match(new RegExp('^[ \t]*'+cmd+'[ \t]+'));
    }else{
        match=str.match(new RegExp(cmd));
    }
    
    if(match){
        return true;
    }else{
        return false;
    }
}
function fallToQwiki(str) {
    doQWIKIQuery(str);
}

function recreateSpeechControl() { /*this is to solve bug with chrome*/
    $("#speech-s").html('');
    $("#speech-s").html('<input id="speech" type="text" x-webkit-speech onspeechchange="startSearch">');
    var mike = document.getElementById('speech');
    mike.onwebkitspeechchange = function (e) {
        startSearch(mike.value);
    };
}

function handleSpeakEvent(event) {
    if (event.type == 'error') {
        console.log('Error: ' + event.errorMessage);
    } else if (event.type == 'end' || event.type == 'interrupted' || event.type == 'interrupted') {
        $('#stop-button').hide();
        $('#speech-s').show();
    } else if (event.type == 'start') {
        $('#stop-button').show();
        $('#speech-s').hide();
    }
}

function siriSaid(content, tts) {
    var notch = '<div class="left-arrow-outer"><div class="left-arrow-inner"></div></div>';
    var content = "<div>" + content + "</div>"
    var leftWrap = '<div class="left">' + content + notch + "</div>";
    var sep = '<div class="sep">&nbsp;&nbsp;&nbsp;</div>';
    $("#console").append(sep);
    $("#console").append(leftWrap);
    $('html,body').stop();
    $('html,body').animate({
        scrollTop: $(document).height()
    }, {
        duration: 'slow',
        easing: 'swing'
    });
    if (tts) {
        tts = tts.replace(/\|/g, ':');
        chrome.tts.speak(tts, {
            'enqueue': true,
            'gender': 'female',
            onEvent: handleSpeakEvent
        });
    }
}

function youSaid(str) {
    var notch = '<div class="right-arrow-outer"><div class="right-arrow-inner"></div></div>';
    var content = "<div>" + "&#8220;" + str.replace(/\n*/, '').replace(/^\s*/, '').replace(/\s*$/, '') + "&#8221;</div>"
    var rightWrap = '<div class="right">' + content + notch + "</div>";
    var sep = '<div class="sep">&nbsp;&nbsp;&nbsp;</div>';
    $("#console").append(sep);
    $("#console").append(rightWrap);
    $("#console").append(sep);
    $('html,body').stop();
    $('html,body').animate({
        scrollTop: $(document).height()
    }, {
        duration: 'slow',
        easing: 'swing'
    });
    doAnalysis(str);
}

function doQWIKIQuery(query) {
    var url = 'http://embed-api.qwiki.com/api/v1/search.json?q=' + escape(query) + '&callback=?';
    $.getJSON(url, function (data) {
        if (data.length < 1) {
            var msg = getRandomMsg(sorrymsg);
            siriSaid(msg, msg);
            var url = "http://www.google.co.in/search?q=" + escape(query);
            siriSaid('Would you like to Google about it? <a href="' + url + '" target="_blank">' + query + '</a>', "Would you like to Google about it?");
            isAskingQuestion = true;
            questionContext = url;
            return;
        }
        var html = '<div style="width:300px">' + data[0].text + '</div><br><iframe width="300" height="300" src="' + data[0].embed_url + '" scrolling="no" frameborder="0"></iframe>';
        siriSaid(html, data[0].text);
    });
}

function doWAQuery(query) {
    var url = 'http://www.purplegene.com/wa?q=' + escape(query) + '&cb=?';
    QueryTimer = setTimeout(function () {
        fallToQwiki(query)
    }, 10000);
    $.getJSON(url, function (data) {
        if (data.img.length > 1) {
            clearTimeout(QueryTimer);
        }
        if(ignoreWA){
            clearTimeout(QueryTimer);
            return;
        };
        for (var i = 0; i < data.img.length; i++) {
            var text = "";
            if (i == 0) {
                var prefix = getRandomMsg(myInterpretation);
                text = prefix + data.text[i];
            } else if (i == 1) {
                text = data.text[i];
            } else {
                text = undefined;
            }
            if (i > 4) {
                break;
            }
            var waImg = data.img[i];
            if ((i == (data.img.length - 1)) || (i == 4)) {
                waImg = data.img[i] + '<br><span class="wa-atr">' + getWaAttributionString(query) + '</span>';
            }
            siriSaid(waImg, text);
        }
    });
}

function processContext(str) {
    isAskingQuestion = false;
    if (str.toLowerCase().indexOf('yes') >= 0) {
        chrome.tabs.create({
            'url': questionContext
        });
    } else {
        doAnalysis(str);
    }

}

function doAnalysis(str) {
    chrome.tts.stop();
    if (isAskingQuestion) {
        processContext(str);
        return;
    }
    if (str.length < 2) {
        siriSaid('Say Something?', 'Say Something');
        return;
    }
    if (isHavingCommand(str,'help')) {
        explainYourself();
        return;
    }
    if (isHavingCommand(str,'play')) {
        siriSaid('Searching to play..', 'Searching to play..');
        getYouTube(str.replace(/play/ig, ''));
        return;
    }
    if (isHavingCommand(str,'joke',true)) {
        var joke=getRandomMsg(jokes);
        siriSaid(joke, joke);
        return;
    }
    $('#utplay').remove();
    if (ytPlayer) {
        chrome.tabs.remove(ytPlayer.id);
    }
    var msg = getRandomMsg(waitmsg)
    siriSaid(msg, msg);
    placeMaker(str);
    ignoreWA=false;
    doWAQuery(str);
}

$(document).ready(function () {
    var mike = document.getElementById('speech');
    mike.onwebkitspeechchange = function (e) {
        startSearch(mike.value);
    };
    $('#bt').click(function () {
        var v = $("#tt").val();
        youSaid(v);
        $("#tt").val('');
    });
    $("#tt").keypress(function (event) {
        if (event.which == 13) {
            var v = $("#tt").val();
            youSaid(v);
            $("#tt").val('');
            event.preventDefault();
        }
    });
    $('#stop-button').click(function () {
        chrome.tts.stop();
    });
    generateNoise(0.1);
});

function startSearch(str) {
    youSaid(str);
    recreateSpeechControl();
}