function GetNavigator(domTxt,domDisp,argXpath)
{
	var lxpath='/html/body[@id="styleguide-v2"]/div[@id="wrapper"]/div[@id="root"]/layer/div[@id="pagecontent"]/div[@id="content-3"]/div[@id="main"]/table[1]';
	if(argXpath != null)
	{	
		lxpath=argXpath;
	}
        var splittedPaths=lxpath.split('/');
        var xpath=splittedPaths;
	var cur =splittedPaths.length-1;
	function getHashedName(node,isCur){
		var hashednode=node;
		if(node.length>8){
			hashednode= node.substring(0,8);
		}		
		if(isCur){
			return '<div class="node cur">'+hashednode+"</div>";
		}
		else{
			return   '<div class="node">'+hashednode+"</div>";
		}
	}
	function getObjects(count){
		rightLen=(splittedPaths.length)-cur;
		leftLen=cur-1;
		var halfcount=Math.floor(count/2);
		var rightEffectiveLen=0
		var leftEffectiveLen=0
		if(rightLen>halfcount){
			leftEffectiveLen=(leftLen>halfcount)?(halfcount):(leftLen);
			rightEffectiveLen=(halfcount+halfcount-leftEffectiveLen);
		}
		else{
			rightEffectiveLen=rightLen;
			leftEffectiveLen=(leftLen>halfcount)?(halfcount+(halfcount-rightLen)):(leftLen);
		}
		if(cur-leftEffectiveLen<1)
		{
			leftEffectiveLen=leftLen;
		}
		if(cur+rightEffectiveLen>=splittedPaths.length){
			rightEffectiveLen=rightLen;
		}
		var str="";	
		for(var i=cur-leftEffectiveLen;i<cur+rightEffectiveLen;i++){
			if(str!=""){
				str=str+"/"+getHashedName(splittedPaths[i],i==cur);
			}else{
				str=str+getHashedName(splittedPaths[i],i==cur);
			}
		}
		if(cur-leftEffectiveLen>1)
		{
			str="..."+str;
		}
		if(cur+rightEffectiveLen<splittedPaths.length)
		{
			str=str+"...";
		}
		str ='<div class="path">'+str+'</path>';
		
		return str;

	}
	function GetXPath(i){
		 var p=[];
		 while(i>=1){
			p.push(xpath[i]);
			if(xpath[i].indexOf('@id')>0){
				break;
			}
                        i=i-1;
		 }
		 var curPath='';
		 if(i==1){
                   curPath = "/" + p.reverse().join('/');
		 }
		 else{
		   curPath = "//" + p.reverse().join('/');
		 }
		return curPath;
	}
	function parseXPathBack(curstring){
		for(var i=1;i<xpath.length;i++){
			var calstr=GetXPath(i);
			if(GetXPath(i)==curstring){
				return i;
			}
		}
		return -1;
	}
	var xpathnavigator={
		"handlechange":function(){
			if($(domTxt).val().length<1){
				 if(cur>1){			 
				 	xpathnavigator.prev();
				 }
				 return;
			}
			var curtry=parseXPathBack($(domTxt).val());
			if(curtry>0 && curtry!=cur){
				cur= curtry;
				xpathnavigator.setcurrent();
			}
				
		   },
		"setcurrent":function(){
		
			 		$(domTxt).val(GetXPath(cur));
			 		$(domDisp).html(getObjects(8));
				},
		"next":function(){
				 if(cur<xpath.length-1){
					cur=cur+1;
				 }
				 xpathnavigator.setcurrent();
			},
		"prev":function(){
				  if(cur>1){
					cur=cur-1;
				 }
				 xpathnavigator.setcurrent();
			}
	};
        return xpathnavigator;
}

function isChrome() {
    if (chrome.tabs === undefined) {
        return false;
    }
    return true;
}

function fetchmashup(arg_url, arg_myxpath, arg_title) {
    var url = escape(arg_url);
    var myxpath = escape(arg_myxpath);
    var yql = 'select%20*%20from%20html%20where%20url%3D%22' + url + '%22%20and%0A%20%20%20%20%20%20xpath%3D\'' + myxpath + '\'&format=xml&diagnostics=true&callback=ren';
    var title = arg_title;
    var murl = 'http://www.purplegene.com/mashup?yql=' + escape(yql) + '&t=' + title;
    if (isChrome()) {
        chrome.tabs.create({
            "url": murl
        });
    }
}

function debugmashup(arg_url, arg_myxpath, arg_title) {
    var url = escape(arg_url);
    var myxpath = escape(arg_myxpath);
    var yql = 'select%20*%20from%20html%20where%20url%3D%22' + url + '%22%20and%0A%20%20%20%20%20%20xpath%3D\'' + myxpath + '\'&format=xml&diagnostics=true&callback=ren';
    var title = arg_title;
    var murl = 'http://developer.yahoo.com/yql/console/#h=' + yql;
    if (isChrome()) {
        chrome.tabs.create({
            "url": murl
        });
    }
}

function preview_mashup(arg_url, arg_myxpath, arg_title) {
    var url = escape(arg_url);
    var myxpath = escape(arg_myxpath);
    $("#previewcontainer").text('fetching....');
    var yql = 'select%20*%20from%20html%20where%20url%3D%22' + url + '%22%20and%0A%20%20%20%20%20%20xpath%3D\'' + myxpath + '\'&format=xml&diagnostics=true&callback=?';
    yql = 'http://query.yahooapis.com/v1/public/yql?q=' + yql;
    $.getJSON(yql, function(data) {
        $("#previewcontainer").val("" + getResultString(data));
    });
}

function getResultString(o) {
    var h = "";
    var i;
    var c;
    var resultString = "aaa";
    if (resultString) {
        if (o.results[0]) {
            c = o.results.length;
            for (i = 0; i < c; i++) {
                h = h + o.results[i] + '<br/' + '>';
            }
            resultString = h;
        } else if (o.results.length>0) {
            resultString = o.results;
        } else {
			if(o.query.diagnostics.url.error != undefined)
			{
				resultString = o.query.diagnostics.url.error;
			}
			else
			{
				resultString ="Something went wrong!!";
			}
        }
    }
    return resultString;
}
function getParam() {
    var result = {};
    result.url = $("#txturl").val();
    result.xpath = $("#Xpath").val();
    result.title = $("#txttitle").val();
    return result;
}
function validateURL() {
    var urlre = /http:\/\/[A-Za-z0-9\.-]{3,}\.[A-Za-z]{3}/;
	var urlsecurere = /https:\/\/[A-Za-z0-9\.-]{3,}\.[A-Za-z]{3}/;
    var paramre = /\$[A-Z0-9]+/;
    var url = $("#txturl").val();
	url = url.replace(/\+/gi,"%20");
	$("#txturl").val(url);
    if (urlre.test(url)) {
        return true;
    }
    else if(paramre.test(url)){
		return true;
    }else if(urlsecurere.test(url)){
		return true;
    }
    return false;
}
function init_buttons(){
	   var navi=GetNavigator("#Xpath","#xpathpos");
	   $("#btDwnXpath").click(navi.next);
	    $("#btUpXpath").click(navi.prev);
	    navi.setcurrent();
	    $('#Xpath').keyup(navi.handlechange);
	    $("#btgetmshup").click(function() {
                if (validateURL()) {
                    $('#errodiv').html('');
		    var res = getParam();
                    fetchmashup(res.url, res.xpath, res.title);
                }
                else {
                    $('#errodiv').html('This dont look line an URL :P');
                }
            });
            $("#btget").click(function() {
                if (validateURL()) {
                    $('#errodiv').html('');
		    var res = getParam();
                    preview_mashup(res.url, res.xpath, res.title);
                }
                else {
                    $('#errodiv').html('This dont look line an URL :P');
                }
            });
	    $("#btyqlconsole").click(function() {
                if (validateURL()) {
                    $('#errodiv').html('');
		    var res = getParam();
                    debugmashup(res.url, res.xpath, res.title);
                }
                else {
                    $('#errodiv').html('This dont look line an URL :P');
                }
            });
	    $("#aboutme").click(function() {
		        var murl = 'http://www.markandey.com';
			if (isChrome()) {
			   chrome.tabs.create({
			    "url": murl
			   });
			}
	    });
		 $("#yqlc").click(function() {
		        var murl = 'http://developer.yahoo.com/yql/';
			if (isChrome()) {
			   chrome.tabs.create({
			    "url": murl
			   });
			}
	    });
		 $("#bca").click(function() {
		        var murl = 'http://developer.yahoo.net/blog/archives/2010/07/open_hack_day_bangalore_by_the_numbers.html';
			if (isChrome()) {
			   chrome.tabs.create({
			    "url": murl
			   });
			}
	    });
}
$(document).ready(function() {
    init_buttons();
    /*$('#xpathnavi').hide();*/
    if(chrome.tabs != undefined)
    {
	    chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {
		    action: "getxpath"
		}, function(response) {
		    $("#txturl").val(tab.url);
		    /*$("#Xpath").val(response.xpath);*/
		    var navi=GetNavigator("#Xpath","#xpathpos",response.xpath);
	 	    $("#btDwnXpath").click(navi.next);
	            $("#btUpXpath").click(navi.prev);
	            navi.setcurrent();
		    $('#Xpath').keyup(navi.handlechange);
		    $("#txttitle").val(tab.title);
				if(validateURL()){
				    var res = getParam();
					preview_mashup(res.url, res.xpath, res.title);
				}
				else{
						$('#errodiv').html('This dont look line an URL :P');
				}
		    
		   $('#errodiv').html(''); 
		 });
	    });
   };
});

