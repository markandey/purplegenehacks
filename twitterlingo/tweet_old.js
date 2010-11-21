// <![CDATA[
function isChrome()
{
    if(chrome.tabs===undefined)
    {
        return false;
    }
    return true;
}
function create_link(element,link)
{
      if(isChrome())
      {
        $(element).click(function () {
          chrome.tabs.create({
              "url": link
            });
        });
      }
      else
      {
        $(element).wrap('<a href="' + link + '">');
      }
}
var tweeps = {
    "tweets":null,
    "getWhenIJoinedTwitter": function (user, element) {
        var propertyname = '<span class="prop">Joined twitter On:</span><span class="val">';
        $(element).html(propertyname + "Loading..." + "</span>");
        var url = "http://twitter.com/users/show/" + user + ".json?callback=?";
        $.getJSON(url, function (data) {
            if (data.created_at) {
                var myArray = data.created_at.split(' ');
                var input = myArray[0] + ', ' + myArray[2] + ' ' + myArray[1] + ' ' + myArray[3] + ' ' + myArray[5].substring(0, 4);
                var dateMillis = Date.parse(input);
                var theDate = new Date(dateMillis);
                var month_names = new Array();
                month_names[month_names.length] = "January";
                month_names[month_names.length] = "February";
                month_names[month_names.length] = "March";
                month_names[month_names.length] = "April";
                month_names[month_names.length] = "May";
                month_names[month_names.length] = "June";
                month_names[month_names.length] = "July";
                month_names[month_names.length] = "August";
                month_names[month_names.length] = "September";
                month_names[month_names.length] = "October";
                month_names[month_names.length] = "November";
                month_names[month_names.length] = "December";
                var myDateStr = theDate.getDate() + " " + month_names[theDate.getMonth()] + " " + theDate.getFullYear();
                $(element).html(propertyname + myDateStr + "</span>");
                var link = "http://www.whendidyoujointwitter.com/";
                create_link(element,link);
                
            }
            else {
                $(element).html(propertyname + "Error!! Not Found" + "</span>");
            }
        });
    },
    "getTweepsInfo": function (user, element) {
        var propertyname = '<span class="prop">Info: </span><span class="val">';
        $(element).html(propertyname + "Loading..." + "</span>");
        var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftweeps.info%2Fprofile%2F" + user + "%22%20and%0A%20%20%20%20%20%20xpath%3D'%2F%2Fdiv%5B%40id%3D%22summary%22%5D%2F%2Fstrong'&format=json&diagnostics=false&callback=?"
        $.getJSON(url, function (data) {
            if (data.query.results.strong) {
                var TwitterAddict = data.query.results.strong[1];
                var socialanimal = data.query.results.strong[2];
                var rarelyusehashtags = data.query.results.strong[3];
                var URL_sharer = data.query.results.strong[4];
                var url2 = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftweeps.info%2Fprofile%2F" + user + "%22%20and%0A%20%20%20%20%20%20xpath%3D'%2F%2Fdiv%5B%40id%3D%22summary%22%5D%2F%2Fa'&format=json&diagnostics=false&callback=?"
                $.getJSON(url2, function (data2) {
                    if (data2.query.results.a) {
                        var key1 = data2.query.results.a[0].content;
                        var key2 = data2.query.results.a[1].content;
                        var key3 = data2.query.results.a[2].content;
                        var text = 'Right now ' + user + ' is tweeting about ';
                        text = text + '"' + key1 + '","' + key2 + '" and "' + key3 + '".';
                        text = text + ' ' + user + ' is ' + TwitterAddict + ', and tends to be ' + socialanimal + '.' + user + ' ' + rarelyusehashtags + ', and is ';
                        text = text + URL_sharer + '.';
                        $(element).html(propertyname + text + "</span>");
                        var link = "http://tweeps.info/profile/" + user;
                        create_link(element,link);
                    }
                    else {}
                });
            }
            else {
                $(element).html(propertyname + "Error!! Not Found" + "</span>");
            }
        });
    },
    "getTwitterQuotient": function (user, element) {
        var propertyname = '<span class="prop">Quotient: </span><span class="val">';
        $(element).html(propertyname + "Loading..." + "</span>");
        var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftools.forret.com%2Ftwitter%2Ftwitter-tq.php%3Fn%3D" + user + "%22%20and%0A%20%20%20%20%20%20xpath%3D'%2F%2Fdiv%5B%40id%3D%22main%22%5D%2Fdiv%5B%40class%3D%22index%22%5D%2Fp'&format=json&diagnostics=false&callback=?";
        $.getJSON(url, function (data) {
            if (data.query.results.p) {
                var he_she_string = 'He/She has ';
                if (user == 'markandey' || user == 'bhaskar_priya' || user == 'vemana' || user == 'munichlinux' || user == 'psam') {
                    he_she_string = 'He has ';
                }
                if (user == 'rencyphilip' || user == 'sunayana' || user == 'div_r') {
                    he_she_string = 'She has ';
                }
                var text = user + ' is proud because "' + data.query.results.p[0] + '".';
                text = text + he_she_string + data.query.results.p[1] + '.';
                text = text + he_she_string + data.query.results.p[2] + '.';
                text = text + he_she_string + data.query.results.p[3] + '.';
                $(element).html(propertyname + text + "</span>");
                var link = "http://web.forret.com/tools/twitter-tq.asp?name=" + user;
                create_link(element,link);
            }
            else {
                $(element).html(propertyname + "Error!! Not Found" + "</span>");
            }
        });
    },
    "getTwitterHappiness": function (user, element) {
        var propertyname = '<span class="prop">Happiness: </span><span class="val">';
        $(element).html(propertyname + "Loading..." + "</span>");
        var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fhappytweets.com%2FTweetAnalysis.aspx%3Fu%3D" + user + "%22%20and%20%20xpath%3D'%2F%2Fdiv%5B%40id%3D%22score%22%5D%2Fp'&format=json&diagnostics=false&callback=?"
        $.getJSON(url, function (data) {
            if (data.query.results.p[1].strong) {
                var text = user + ' is ' + data.query.results.p[1].strong + '.';
                $(element).html(propertyname + text + "</span>");
                var link = "http://happytweets.com/";
                create_link(element,link);
            }
            else {
                $(element).html(propertyname + "Error!! Not Found" + "</span>");
            }
        });
    },
    "gettwitterholicGR": function (user, element) {
        var propertyname = '<span class="prop">Global Rank: </span><span class="val">';
        /*$(element).html(propertyname + "Loading..." + "</span>");*/
         $(element).html('');
        var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftwitterholic.com%2F" + user + "%22%20and%20%20xpath%3D'%2F%2Fdiv%5B%40id%3D%22user_details%22%5D%2Fp%5B%40id%3D%22rank%22%5D%2Fstrong'&format=json&diagnostics=false&callback=?";
        $.getJSON(url, function (data) {
            if (data.query.results.strong) {
                var rank = data.query.results.strong;
                if (rank.length < 2) {
                    $(element).html(propertyname + "Error!! Not Found" + "</span>");
                    return;
                }
                $(element).html(propertyname + rank + "</span>");
                var link = "http://twitterholic.com/" + user;
                create_link(element,link);
            }
            else {
                $(element).html(propertyname + "Error!! Not Found" + "</span>");
            }
        });
    },
    "gettwitpic": function (user, element) {
        var propertyname = '<span class="prop">TwitPics: </span><span class="val">';
        /*$(element).html(propertyname + "Loading..." + "</span>");*/
         $(element).html('');
        var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftwitpic.com%2Fphotos%2F" + user + "%22%20and%0A%20%20%20%20%20%20xpath%3D'%2F%2Fdiv%5B%40class%3D%22profile-photo-img%22%5D%2F%2Fimg'&format=json&callback=?";
        $.getJSON(url, function (data) {
            if (data.query.results.img) {
                var images = data.query.results.img;
                var i = 0;
                var count;
                var imghtml = "";
                if (images.length < 4) {
                    count = images.length;
                }
                else {
                    count = 4;
                }
                for (i = 0; i < count; i++) {
                    imghtml = imghtml + '<img src="' + images[i].src + '"/' + '>';
                }
                $(element).html(propertyname + imghtml + "</span>");
                var link = "http://twitpic.com/photos/" + user;
                create_link(element,link);
            }
            else {
                $(element).html(propertyname + "Error!! Not Found" + "</span>");
            }
        });
    },
    "getfacebook": function (user, element) {
        var propertyname = '<span class="prop">On Facebook(Possible): </span><span class="val">';
        /*$(element).html(propertyname + "Loading..." + "</span>");*/
         $(element).html('');
        var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.facebook.com%2F" + user + "%22%20and%20xpath%3D'%2F%2Fdiv%5B%40class%3D%22picture_container%22%5D'&format=json&callback=?";
        $.getJSON(url, function (data) {
            if (data.query.results.div.img.src) {
                var image_src = "http://www.facebook.com/" + data.query.results.div.img.src;
                var imghtml = "";
                imghtml = imghtml + '<img src="' + image_src + '" style="width=150px;"/' + '>';
                $(element).html(propertyname + imghtml + "</span>");
                var link = "http://www.facebook.com/" + user;
                create_link(element,link);
            }
            else {
                $(element).html(propertyname + "Error!! Not Found" + "</span>");
            }
        });
    },
    "gettwitterholicLR": function (user, element) {
        var propertyname = '<span class="prop">Location Rank: </span><span class="val">';
       /* $(element).html(propertyname + "Loading..." + "</span>");*/
       $(element).html('');
        var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Ftwitterholic.com%2F" + user + "%22%20and%20%20xpath%3D'%2F%2Fdiv%5B%40id%3D%22user_details%22%5D%2Fp%5B%40id%3D%22locationrank%22%5D%2Fstrong'&format=xml&diagnostics=false&callback=?";
        $.getJSON(url, function (data) {
            if (data.results) {
                var rank = "" + data.results;
                if (rank.length < 2) {
                    $(element).html(propertyname + "Error!! Not Found" + "</span>");
                    return;
                }
                $(element).html(rank);
                rank = $(element).text();
                $(element).html(propertyname + rank + "</span>");
                var link = "http://twitterholic.com/" + user;
                create_link(element,link);
            }
            else {
                $(element).html(propertyname + "Error!! Not Found" + "</span>");
            }
        });
    },
    "getHisTweetSplit": function (user, element) {
        var i=0;
        if(this.tweets===null){
            /*$(element).append('tweets are null');*/
            return;
        }
        $(element).html('');
        var all=this.tweets.length;
        var atReplyCount=0;
        var linkPostCount=0;
        var postCount=0;
        for (i = 0; i < all; i++) {
            var text=this.tweets[i].text;
            if(text) {
               if(/^@/.test(text)){
                    atReplyCount=atReplyCount+1;
               }
               else if (/http\:\/\/[a-z]+/.test(text))
               {
                     linkPostCount=linkPostCount+1;
               }
               else{
                    postCount=postCount+1;
               }
            }
        }
        var charturl='http://chart.apis.google.com/chart?cht=p3&chds=0,169&chs=300x150&chtt=Tweets+Split&chdl=At+Reply|Post+with+Link|Simple+Post&chma=0,0,0,0|70&chco=3366CC|DC3912|FF9900|109618&chts=FFFFFF,10&chp=4.7&chf=bg,s,000000&chd=t:';
        var chardata=(atReplyCount*100/all)+','+(linkPostCount*100/all)+','+(postCount*100/all);
        charturl=charturl+chardata;
        $(element).append('<img src="'+charturl+'"/>');
    },
    "gettweeteffect": function (user, element,tselement) {
        var mytweeps=this;
        var propertyname = '<span class="prop">TweetEffect: </span><span class="val">';
        $(element).html(propertyname + "Loading..." + "</span>");
        $(tselement).html('');
        var url = 'http://twitter.com/statuses/user_timeline/' + user + '.json?count=200&suppress_response_codes&callback=?';
        $.getJSON(url, function (o) {
            mytweeps.tweets=o;
            var ou, all, s, e, f, l = 0,
                g = 0,
                i = 0,
                cur, next;
            ou = document.getElementById('tweeteffect');
            if (o[0].user.screen_name) {
                all = o.length;
                s = o[0].user.followers_count;
                e = o[all - 1].user.followers_count;
                f = s - e;
                l = 0;
                g = 0;
                for (i = 0; i < all - 1; i++) {
                    cur = o[i].user.followers_count;
                    next = o[i + 1].user.followers_count;
                    if (cur > next) {
                        g++;
                    };
                    if (cur < next) {
                        l++;
                    };
                }
                var myeffect = '' + user + ' gained ' + g + ' followers and lost ' + l + ' in the last ' + all + 'updates.';
                $(element).html(propertyname + myeffect + "</span>");
                var link = "http://www.tweeteffect.com/";
                create_link(element,link);
                mytweeps.getHisTweetSplit(user,tselement);
            }
            else {
                $(element).html(propertyname + "Error!! Not Found" + "</span>");
            }
        });
    },
    "getAll": function (user, element) {
        $(element).append('<DIV ID="twitterholic"></DIV');
        $(element).append('<DIV ID="LocalRank"></DIV');
        $(element).append('<DIV ID="whenjoined"></DIV');
        $(element).append('<DIV ID="info"></DIV');
        $(element).append('<DIV ID="quotient"></DIV');
        $(element).append('<DIV ID="happiness"></DIV');
        $(element).append('<DIV ID="tweeteffect"></DIV');
        $(element).append('<DIV ID="twitpics"></DIV');
        $(element).append('<DIV ID="facebookpic"></DIV');
        $(element).append('<DIV ID="tweetsplit"></DIV');
        tweeps.getWhenIJoinedTwitter(user, "#whenjoined");
        tweeps.getTweepsInfo(user, "#info");
        tweeps.getTwitterQuotient(user, "#quotient");
        tweeps.getTwitterHappiness(user, "#happiness");
        tweeps.gettwitterholicGR(user, "#twitterholic");
        tweeps.gettwitterholicLR(user, "#LocalRank");
        tweeps.gettweeteffect(user, "#tweeteffect",'#tweetsplit');
        tweeps.gettwitpic(user, "#twitpics");
        tweeps.getfacebook(user, "#facebookpic");
        
    }
};
function addaDivInUserList(element,user){
    var divHTMLstart='<span ID="username_'+user+'" class="userlink">';
    var divHTMLend='</span>&nbsp;';
    $(element).append(divHTMLstart+'@'+user+divHTMLend);
    $('#username_'+user).click(function(){
         $("#tu").val(user);
    });
}
$(document).ready(function () {
    
    if(isChrome())
    {
    chrome.tabs.getAllInWindow(undefined, function (tabs){
        var t='';
        for(var i=0;i<tabs.length;i++)
        {
            var twitteruserurlpat=/^http\:\/\/twitter\.com\/[a-zA-Z0-9_]+$/;
            if(twitteruserurlpat.test(tabs[i].url))
            {
                var username=tabs[i].url.replace('http://twitter.com/','');
                addaDivInUserList("#userlist",username);
                $("#tu").val(username);
            }
        }
    });  
    }  
    
    $("#do").click(function () {
        var user = $("#tu").val();
        user = escape(user);
        tweeps.getAll(user, "#main");
        $("#username").text(user);
    });
    $("#aboutme").click(function () {
        chrome.tabs.create({
            "url": "http://www.twitter.com/markandey"
        });
    });
});
// ]]>
