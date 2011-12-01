var waitmsg = ['Let me search...', 'I am thinking. ', 'Please wait..', 'Just a sec..', 'hold on..'];
var NoisyImageDataUrls = [];
var NoisyImageDataIndex = 0;
var isAskingQuestion = false;
var questionContext = false;
var AlchemyAPIWaitCount = 0;

var sorrymsg = ['Sorry, i don\'t know about it!', 'No comments from me on that!', 'Not sure abut it.', 'Sorry, i don\'t have answer!', 'I am sorry!, not able to answer you at this time. ', 'can you rephrase your question?', ];

var myInterpretation = ['So you asked about ', 'If Your question is about ', 'I interpreted is as ', 'Cool!  ', 'So, ', 'This is what i got about '];
var ytPlayer;
var ignoreWA = false;
var keys = [];
var AlchemyAPILoaded = [];
var myPos = {};
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/, '');
};

function getSearchCompleteHandler(searchType, searchObject) {
    var searchComplete = function (data) {
            console.log(searchType, searchObject);
        }
    return searchComplete;
}

function doAlchemyAPI_extract(query) {
    var url = 'http://www.purplegene.com/tagme?q=' + escape(query) + '&cb=?';
    $.getJSON(url, function (data) {
        AlchemyAPILoaded[0] = true;
        console.log(data);
        if (!data || !data.entities) {
            return;
        }
        for (var i = 0; i < data.entities.length; i++) {
            keys[keys.length] = {
                'text': data.entities[i].text,
                'relevance': data.entities[i].relevance,
                'type': 'entity'
            };
        }
    });
    return false;
}

function doAlchemyAPI_concept(query) {
    var url = 'http://www.purplegene.com/ctagme?q=' + escape(query) + '&cb=?';
    $.getJSON(url, function (data) {
        AlchemyAPILoaded[1] = true;
        if (!data || !data.concepts) {
            return;
        }
        for (var i = 0; i < data.concepts.length; i++) {
            keys[keys.length] = {
                'text': data.concepts[i].text,
                'relevance': data.concepts[i].relevance,
                'type': 'concept'
            };
        }
    });
    return false;
}

function doAlchemyAPI_keyword(query) {
    var url = 'http://www.purplegene.com/keytagme?q=' + escape(query) + '&cb=?';
    $.getJSON(url, function (data) {
        AlchemyAPILoaded[2] = true;
        if (!data || !data.keywords) {
            return;
        }
        for (var i = 0; i < data.keywords.length; i++) {
            keys[keys.length] = {
                'text': data.keywords[i].text,
                'relevance': data.keywords[i].relevance,
                'type': 'keyword'
            };
        }

    });
    return false;
}

function doAlchemyAPI_wait(callback) {
    for (var i = 0; i < AlchemyAPILoaded.length; i++) {
        if (!AlchemyAPILoaded[i]) {
            AlchemyAPIWaitCount++;
            if (AlchemyAPIWaitCount > 5) {
                break;
            }
            setTimeout(function () {
                doAlchemyAPI_wait(callback)
            }, 1000);
            return;
        }
    }
    if (typeof (callback) == 'function') {
        callback();
    }
}

function doAlchemyAPI(str) {
    keys = [];
    AlchemyAPIWaitCount = 0;
    AlchemyAPILoaded = [];
    AlchemyAPILoaded[AlchemyAPILoaded.length] = doAlchemyAPI_extract(str);
    AlchemyAPILoaded[AlchemyAPILoaded.length] = doAlchemyAPI_concept(str);
    AlchemyAPILoaded[AlchemyAPILoaded.length] = doAlchemyAPI_keyword(str);
    doAlchemyAPI_wait(function () {
        keys.sort(function (a, b) {
            offset = {
                "entity": 2,
                "concept": 1,
                'keyword': 0
            };
            return ((a.relevance + offset[a.type]) - (b.relevance + offset[b.type]));

        });
        console.log(keys);

        if (keys[0]) {
            fallToQwiki(keys[0].text);
        } else {
            fallToQwiki(str);
        }
    });
}

function doSearch(str) {
    var so = new google.search.WebSearch();
    so.setSearchCompleteCallback(this, getSearchCompleteHandler('web', so), null);
    so.execute(str);

    so = new google.search.ImageSearch();
    so.setSearchCompleteCallback(this, getSearchCompleteHandler('image', so), null);
    so.execute(str);

    so = new google.search.VideoSearch();
    so.setSearchCompleteCallback(this, getSearchCompleteHandler('video', so), null);
    so.execute(str);

    so = new google.search.NewsSearch();
    so.setSearchCompleteCallback(this, getSearchCompleteHandler('news', so), null);
    so.execute(str);
}

function isVideoIsEmbedAllowed(videoId, callback) {
    var url = 'http://gdata.youtube.com/feeds/api/videos/' + videoId + '?v=2&alt=json&callback=?';
    $.getJSON(url, function (data) {
        var ret = true;;
        try {
            var count = data.entry.yt$accessControl.length;
            for (var i = 0; i < count; i++) {
                if (data.entry.yt$accessControl[i].action === 'embed') {
                    ret = ret && (data.entry.yt$accessControl[i].permission === 'allowed');
                } else if (data.entry.yt$accessControl[i].action === 'autoPlay') {
                    ret = ret && (data.entry.yt$accessControl[i].permission === 'allowed');
                }
            }
            var count = data.entry.media$group.media$content.length;
            var isFound = false;
            for (i = 0; i < count; i++) {
                var d = data.entry.media$group.media$content[i];
                if (d.yt$format === 5) {
                    isFound = true;
                    break;
                }
            }
            ret = ret && isFound;
        } catch (err) {
            ret = false;
        }
        if (typeof (callback) === 'function') {
            callback(ret);
        }
    });
}
function getPopularSongs(){
    var url="http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.apple.com%2Feuro%2Fitunes%2Fcharts%2Ftop10songs.html%22%20and%0A%20%20%20%20%20%20xpath%3D'%2F%2Fdiv%5B%40id%3D%22main%22%5D%2F%2Fdiv%5B%40class%3D%22padder%22%5D%2F%2Fstrong'&format=json&callback=?";
    $.getJSON(url, function (data) {
        data.query.results.strong.length=20;
        var song=getRandomMsg(data.query.results.strong);
        getYouTube(song);    
    });
}
function getEmbedYouTube(videoID, divID, allowed) {
    if (allowed) {
        var iframe = '<iframe width="300" height="200" src="http://www.youtube.com/embed/' + videoID + '?autoplay=1&loop=1" frameborder="0" allowfullscreen></iframe>';
        //iframe=iframe+"<br> this video is access:"+allowed;
        $("#" + divID).html(iframe);
    } else {
        var url = 'http://www.youtube.com/watch?v=' + videoID + '&loop=1';
        chrome.tabs.create({
            'url': url,
            'selected': false
        }, function (t) {
            ytPlayer = t;
        });
    }
}

function getYouTube(query) {
    var url = 'http://gdata.youtube.com/feeds/api/videos?q=' + escape(query) + '&alt=jsonc&max-results=10&v=2&callback=?';
    $.getJSON(url, function (data) {
        if (data.data && data.data.items.length > 0) {
            $('#utplay').remove();
            if (ytPlayer) {
                chrome.tabs.remove(ytPlayer.id);
            }
            siriSaid('Playing....' + data.data.items[0].title + '<br><br><div id="utplay"></div>', "Playing " + data.data.items[0].title);
            var allowed = ""
            try {
                allowed = (data.data.items[0].status.value !== 'restricted');
                ytPlayer = getEmbedYouTube(data.data.items[0].id, 'utplay', allowed);
            } catch (eerr) {
                isVideoIsEmbedAllowed(data.data.items[0].id, function (gallowed) {
                    ytPlayer = getEmbedYouTube(data.data.items[0].id, 'utplay', gallowed);
                });
            }
            console.log(data.data.items[0].status);

        } else {
            siriSaid("Nothing to play", "Nothing to play");
        }
    });
}

function getTimeString(hour, minutes) {
    var timestr = "";
    if (minutes == 0) {
        timestr = hour + " o clock";
    } else if (minutes < 45) {
        timestr = minutes + " past " + hour;
    } else if (minutes == 45) {
        var next = (hour + 1) % 12;
        timestr = ' quarter to ' + next;
    } else if (minutes > 45) {
        var left = 60 - minutes;
        var next = (hour + 1) % 12;
        timestr = left + ' to ' + next;
    }
    return timestr
}

function getHourIdea(hour) {
    var mm = 'in the morning';
    if (hour >= 0 && hour < 6) {
        mm = 'in the early morning';
    } else if (hour >= 6 && hour < 12) {
        mm = 'in the morning';
    } else if (hour >= 12 && hour < 18) {
        mm = 'in the after noon';
    } else if (hour >= 18 && hour < 22) {
        mm = 'in the evening';
    } else if (hour >= 22 && hour < 24) {
        mm = 'at night';
    }
    return mm;
}

function getLocalTimeFromLocation(place, lat, lng) {
    var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Fwww.earthtools.org%2Ftimezone-1.1%2F" + escape(lat) + "%2F" + escape(lng) + "'&format=json&callback=?";
    $.getJSON(url, function (data) {
        console.log(place + " " + data.query.results.timezone.localtime);
        var match = data.query.results.timezone.localtime.match(/([0-9]{2} [a-zA-Z]{3} [0-9]{4}) ([0-9]{2}):([0-9]{2}):[0-9]{2}/);
        hour = match[2] * 1;
        minutes = match[3] * 1;
        var mm = getHourIdea(hour);
        if (hour > 12) {
            hour = hour - 12;
        }
        if (hour == 0) {
            hour = 12;
        }
        var timestr = getTimeString(hour, minutes);
        var LocationPreFix = "Time in " + place.split(',')[0] + " is ";
        var bIgnoreDate = false;
        if (place === 'here') {
            LocationPreFix = "Current Time is ";
            bIgnoreDate = true;
        }
        var dateSuffix = " and date of " + match[1];
        if (bIgnoreDate) {
            dateSuffix = "";
        }
        var msg = LocationPreFix + " " + timestr + " " + mm + dateSuffix;
        var display = msg + " ( " + data.query.results.timezone.localtime + " )";
        siriSaid(display, msg);

    })
}

function analyseMap(data) {
    if (!data || !data.query || !data.query.results || !data.query.results.matches) {
        return [];
    }
    var match = data.query.results.matches.match;
    var matchC = match.length;

    if (!matchC) {
        return [match.place];
    } else {
        var ret = [];
        for (var i = 0; i < matchC; i++) {
            if (match[i].place.type !== "Continent" && match[i].place.type !== "State" && match[i].place.type !== "Country") {
                ret[ret.length] = match[i].place;
            }
        }
        return ret;
    }

}

function getLocalSearch(location, str) {
    var url = 'http://www.purplegene.com/markermap?loc=' + escape(location) + '&query=' + escape(str.replace(/"/g, ''));
    var frame = '<br><br><iframe width="365" height="310" src="' + url + '" frameborder="0" allowfullscreen></iframe>';
    return frame;
}

function placeMaker(str) {
    var url = 'http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20geo.placemaker%20WHERE%20documentContent%20%3D%20%22' + escape(str.replace(/"/g, '')) + '%22%20AND%20documentType%3D%22text%2Fplain%22&format=json&diagnostics=true&callback=?';
    var bwheather = (str.toLowerCase().indexOf('weather') >= 0) || (str.toLowerCase().indexOf('temperature') >= 0);
    var timeIndex = str.trim().toLowerCase().indexOf('time');
    var timeIndex1 = str.trim().toLowerCase().indexOf('what\'s the time');
    var timeIndex2 = str.trim().toLowerCase().indexOf('what time');
    var dateIndex = str.trim().toLowerCase().indexOf('date');
    var bTime = (timeIndex1 == 0 || timeIndex2==0 || timeIndex == 0 || dateIndex == 0);
    var bLocal = (str.toLowerCase().indexOf('near') >= 0) || (str.toLowerCase().indexOf('around') >= 0);
    $.getJSON(url, function (data) {
        console.log(data, 'placemaker');
        var p = analyseMap(data);
        if (p.length >= 2) {
            ignoreWA = true;
            var from = escape(p[0].name);
            var to = escape(p[1].name);
            var msg = "Here are the directions.";
            var iframe = msg + '<br><iframe width="365" height="504" src="http://www.purplegene.com/map?f=' + from + '&t=' + to + '" frameborder="0" allowfullscreen></iframe>';
            siriSaid(iframe, msg);
        } else if (p.length == 1) {
            if (bLocal) {
                ignoreWA = true;
                var frame = getLocalSearch(p[0].name, str);
                siriSaid('Here you go' + frame, 'Here you go.');
            } else if (bwheather) {
                if (p[0].woeId) {
                    ignoreWA = true;
                    var url = 'http://www.purplegene.com/weather?wid=' + escape(p[0].woeId);
                    var frame = '<br><br><iframe style="background:white" width="320" height="350" src="' + url + '" frameborder="0" allowfullscreen></iframe>';
                    siriSaid('Here you go' + frame, 'Here you go.');
                }
            } else if (bTime) {
                ignoreWA = true;
                getLocalTimeFromLocation(p[0].name, p[0].centroid.latitude, p[0].centroid.longitude);
            }
        } else {
            if (bTime && myPos.coords) {
                ignoreWA = true;
                var lat = myPos.coords.latitude
                var lang = myPos.coords.longitude
                getLocalTimeFromLocation('here', lat, lang);
            }
        }
    });
}


function getWaAttributionString(query) {
    var link = 'http://www.wolframalpha.com/input/?i=' + escape(query);
    var str = 'Wolfram Alpha LLC. 2009. Wolfram|Alpha.<br><a href="' + link + '"' + link + '</a>';
    var str = str + '<br>(access ' + (new Date).toDateString() + ')';
    return str;
}

function setImage(url1, url2) {
    var t = $('#nbck');
    if (t) {
        t.remove();
    }
    var t = $('<style id="nbck">');
    t.text('html{background-image:' + url1 + ';}' + 'body{background-image:' + url2 + ';}');
    $('head').append(t);
}

function generateNoise(opacity) {
    if ( !! !document.createElement('canvas').getContext) {
        return false;
    }
    var count = NoisyImageDataUrls.length;
    if (NoisyImageDataUrls.length >= 12) {
        NoisyImageDataIndex++;
        NoisyImageDataIndex = NoisyImageDataIndex % count;
        var url1 = NoisyImageDataUrls[NoisyImageDataIndex];
        var url2 = NoisyImageDataUrls[(NoisyImageDataIndex + 1) % count];
        setImage(url1, url2);
        //setTimeout(generateNoise,5000)
        return;
    }
    opacity = opacity || 0.04;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    var x, y, number;
    var scalex = 500
    var scaley = 2;
    if (count % 2) {
        canvas.width = scalex;
        canvas.height = scaley;
    } else {
        canvas.width = scaley;
        canvas.height = scalex;
    }

    for (x = 0; x < canvas.width; x++) {
        for (y = 0; y < canvas.height; y++) {
            number = Math.floor(Math.random() * 255);
            ctx.fillStyle = "rgba(" + number + "," + number + "," + number + "," + opacity + ")";
            ctx.fillRect(x, y, 1, 1);
        }
    }
    var url = NoisyImageDataUrls[NoisyImageDataUrls.length] = "url(" + canvas.toDataURL("image/png") + ")";
    //setImage(url,url);
    setTimeout(generateNoise, 3)
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

function isHavingCommand(str, cmd, anyWhere) {
    str = str.toLowerCase();
    cmd = cmd.toLowerCase();
    var match = null;
    if (!anyWhere) {
        match = str.match(new RegExp('^[ \t]*' + cmd + '[ \t]*'));
    } else {
        match = str.match(new RegExp(cmd));
    }

    if (match) {
        return true;
    } else {
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
        recreateSpeechControl();
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
    var content = "<div>" + "&#8220;" + str.replace(/\n*/, '').trim() + "&#8221;</div>"
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
        if (ignoreWA) {
            return;
        }
        if (data.length < 1) {
            var msg = getRandomMsg(sorrymsg);
            siriSaid(msg, msg);
            var url = "http://www.google.co.in/search?q=" + escape(query);
            siriSaid('Would you like to Google about it? <a href="' + url + '" target="_blank">' + query + '</a>', "Would you like to Google about it?");
            isAskingQuestion = true;
            questionContext = url;
            return;
        }
        var html = '<div style="width:500px;">' + data[0].text + '</div><br><div style="height:300px;overflow:hidden"><iframe width="500" height="500" src="' + data[0].embed_url + '" scrolling="no" frameborder="0"></iframe></div>';
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
        if (ignoreWA) {
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
        siriSaid('here you go.', 'here you go.');
        chrome.tabs.create({
            'url': questionContext
        });
    } else if (str.toLowerCase().indexOf('no') >= 0) {
        siriSaid('ok! Is there anything else I can help you with?', 'ok! Is there anything else I can help you with?');
    } else {
        doAnalysis(str);
    }

}

function MathEval(str) {
    try {
        var vars = "var ";
        var isFirst = true;
        for (v in window) {
            if (window.hasOwnProperty(v)) {
                var sep = (isFirst) ? ' ' : ', '
                vars = vars + sep + v;
                isFirst = false;
            }

        }
        vars = vars + ';';
        var estr = 'function e(window,document){ ' + vars + ' return ' + str + '; };e();'
        var ans = eval(estr);
        if (ans == undefined && ans == null) {
            return false;
        }
        var ans = str + ' is equal to ' + ans;
        siriSaid(ans, ans);
        return true;
    } catch (err) {

        return false;
    }
}

function appendTOQueryHistory(str) {
    var str = str.trim();
    var count = autoQuery.length;
    var found = false;
    for (var i = 0; i < count; i++) {
        if (autoQuery[i].trim() === str) {
            found = true;
            break;
        }
    }
    if (!found) {
        autoQuery[autoQuery.length] = str;
    }
    $("#tt").autocomplete({
        source: autoQuery
    });

}

function doAnalysis(str) {
    chrome.tts.stop();
    if (isAskingQuestion) {
        processContext(str);
        return;
    }
    appendTOQueryHistory(str);
    if (str.length < 2) {
        siriSaid('Say Something?', 'Say Something');
        return;
    }

    var res = templateResponse(str);
    if (res != null) {
        siriSaid(res, res);
        return;
    }
    if (MathEval(str)) {
        return;
    }
    if (isHavingCommand(str, 'help')) {
        explainYourself();
        return;
    }
    if (isHavingCommand(str, 'play')) {
        siriSaid('Searching to play..', 'Searching to play..');
        str=str.trim();
        if((str.match(/play[ a-zA-Z]+/ig)===null) || (str.match(/play music/ig)!==null) ){
            getPopularSongs();
        }else{
            getYouTube(str.replace(/play/ig, ''));    
        }
        
        return;
    }
    if (isHavingCommand(str, 'joke', true)) {
        var joke = getRandomMsg(jokes);
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
    //doSearch(str);
    doAlchemyAPI(str);
    
    ignoreWA = false;
/*setTimeout(function(){
        fallToQwiki(str);    
    },1000);*/

    //doWAQuery(str);
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
            $("#tt").autocomplete('close');
            event.preventDefault();
        }
    });
    $('#stop-button').click(function () {
        chrome.tts.stop();
    });
    $("#tt").autocomplete({
        source: autoQuery,
        minLength: 0,
        delay: 0,
        position: {
            my: "left bottom",
            at: "left top"
        }
    });
    generateNoise();
    $("#tt").focus();

    navigator.geolocation.getCurrentPosition(function (position) {
        myPos = position;
    });
});

function startSearch(str) {
    youSaid(str);
    recreateSpeechControl();
}