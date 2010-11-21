function fetchmashup(myurl,myxpath)
{
    var url=escape(myurl);
    var xpath=escape(myxpath);
    var yql='select%20*%20from%20html%20where%20url%3D%22'+url+'%22%20and%0A%20%20%20%20%20%20xpath%3D\''+xpath+'\'&format=xml&diagnostics=true&callback=ren';
    var title='title';
    var murl='http://www.purplegene.com/mashup?yql='+escape(yql)+'&t='+title;
    chrome.tabs.create({
                        "url": murl
                    });

}
function getMashupListDIV(mashup,i)
{
    
    var html='<li><a href="'+'mashup'+i+'">'
    html=html+mashup.name;
    html=html+'</a></li>';
    return html
}
function getcontenthtml(o){
    var h = "";
    var i;
    var c;
    if (o[0]) {
        c = o.length;
        for (i = 0; i < c; i++) {
        h = h + o[i];
        }
        return h;
    } else if (o) {
        return o;
    } else {
        return 'oops... something went wrong!!!';
    }
}
function getMashupDiv(mashup,i){
    var mashuphtml='<div id="'+'mashup'+i+'">';
    mashuphtml=mashuphtml+getcontenthtml(mashup.result);
    mashuphtml=mashuphtml+'</div';
    return mashuphtml;
}
function drawAllMashup(){
    var list="<ul>";
    var mashuphtml="";
    var allmashups=chrome.extension.getBackgroundPage().allmashups;
    var c=allmashups.length;
    for(var i=0;i<c;++i){
        list=list+getMashupListDIV(allmashups[i],i);
        mashuphtml=mashuphtml+getMashupDiv(allmashups[i],i);
    }
    list=list+"</ul>";
    $("#mashuplist").html(list+mashuphtml);
    
}
function fetchnewmashup(myurl,myxpath){
    var html='<input id="idurl" type="text" value="url"/>';
    html=html+'<input id="idxpath" type="text" value="url"/>';
    html=html+'<input id="idname" type="text" value="url"/>';
    html=html+'<input id="idadd" type="button" value="Add as new"/>';
    $('#newmashup').html(html);
    $('#idname').val("No Name");
    $('#idurl').val(myurl);
    $('#idxpath').val(myxpath);
    $('#idadd').click(function(){
        chrome.extension.getBackgroundPage().AddNewMasup($('#idname').val(),$('#idurl').val(),$('#idxpath').val());
        drawAllMashup();
    }
    );
}

$(document).ready(function(){
  chrome.tabs.getSelected(null, function(tab) {
         chrome.tabs.sendRequest(tab.id, {action: "getxpath"}, function(response) {
           $("#xpathdiv").html(tab.url+'<br/>xpath='+response.xpath);
           fetchnewmashup(tab.url,response.xpath);
        });
        });
        drawAllMashup();
 });
