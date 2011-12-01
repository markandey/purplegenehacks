var response=[
['how are you','I am fine, thank you.'],
['how are u','I am fine, thank you.'],
['will you marry me','I am a machine.'],
['will u marry me','I am a machine.'],
['you are beautiful','Thank You!'],
['you are slow','ok'],
['u are slow','ok'],
['ok','I\'m OK, If You\'re OK.'],
['I\'m OK','I\'m OK, If You\'re OK.'],
['I am ok','I\'m OK, If You\'re OK.'],
['thanks','Welcome!'],
['thank you','Welcome!'],
['thank u','Welcome!'],
['bye','bye!'],
['fuck','that\'s not nice'],
['bitch','that\'s not nice'],
['suck my','that\'s not nice'],
['blowjob','that\'s not nice'],
['kill','that\'s not nice'],
['shit','that\'s not nice'],
['shut up','ok!'],
['What is your name','My name is Fake Siri'],
['Whats your name','My name is Fake Siri'],
['What is my name','I don\'t know'],
['what\'s up','Nothing much! oh wait, gas prices are up!'],
['What\'s going on','Nothing much, how can I help you?'],
['hi','hello'],
['hello','hi'],
['i love you','is it?, I love everyone!'],
['i love u','is it?, I love everyone!'],
['i like u','is it?, Thank You!'],
['i like you','is it?, Thank You!'],
['you are idiot','I don\'t think so!'],
['u are idiot','I don\'t think so!'],
['you are an idiot','are you sure?'],
['u are an idiot','are you sure?'],
['kiss me','muaaah'],
['Who are you','I am siri, but fake one!'],
['What is your name','I am siri, but fake one!'],
['your name','I am siri, but fake one!'],
['Who made you?','I was created by Markandey Singh'],
['Who created you?','I was created by Markandey Singh'],
['Who is your daddy','Lets talk about work?'],
['Who is your father','I was created by Markandey Singh'],
['Who invented you','I was created by Markandey Singh'],
['where are you from','I am made of HTML5 and chrome extension API and I live on internet.'],
['where are u from','I am made of HTML5 and chrome extension API and I live on internet.'],
['where do you live','I am made of HTML5 and chrome extension API and I live on internet.'],
['where do u live','I am made of HTML5 and chrome extension API and I live on internet.'],
['sing','pv zk pv pv zk pv zk kz zk pv pv pv zk pv zk zk pzk pzk pvzkpkzvpvzk kkkkkk bsch']
];
function wordMatch(str1,str2){

	var split1=str1.replace(/^[ \?,.;]+|[ \?,.;]+$/g,"").split(/[ \?,.;]/);
	var split2=str2.replace(/^[ \?,.;]+|[ \?,.;]+$/g,"").split(/[ \?,.;]/);
	var diff=(split1.length-split2.length)
	if(diff<0){
		diff= -1*diff;
	}
	if(diff>0){
		return false;
	}
	var map={};
	var isMissingWord=false;
	split1.forEach(function(e){
			if(e.replace(/^\s+|\s+$/g,"").length>0){
				map[e]=true;
			}
	});
	split2.forEach(function(e){
			if(e.replace(/^\s+|\s+$/g,"").length>0){
				if(map[e]!==true){
					isMissingWord=true;
				}
			}
	});
	if(isMissingWord){
		return false;	
	}
	return true;
	
}
function templateResponse(str){
    str=str.toLowerCase().replace(/['"]+/g,'');
    for(var i=0;i<response.length;i++){
        var res=response[i][0].toLowerCase().replace(/['"]+/g,''); 
        if(str.indexOf(res)>=0){
        	if(wordMatch(str,res)){
        		return response[i][1];
        	}
        }
    }
    return null
}