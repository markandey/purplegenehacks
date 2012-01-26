var response=[
['how are you','I am fine, thank you.'],
['how are u','I am fine, thank you.'],
['will you marry me','I am a machine.'],
['will u marry me','I am a machine.'],
['you are beautiful','Thank You!'],
['you are slow','ok'],
['u are slow','ok'],
['ok','I\'m OK, If You\'re OK.'],
['okay','I\'m OK, If You\'re OK.'],
['I\'m OK','I\'m OK, If You\'re OK.'],
['I am ok','I\'m OK, If You\'re OK.'],
['thanks','Welcome!'],
['thank you','Welcome!'],
['thank u','Welcome!'],
['bye','bye!'],
['fuck','that\'s not nice'],
['fuck u','that\'s not nice'],
['fuck You','that\'s not nice'],
['bitch','that\'s not nice'],
['u are bitch','that\'s not nice'],
['u r bitch','that\'s not nice'],
['you are bitch','that\'s not nice'],
['suck my','that\'s not nice'],
['blowjob','that\'s not nice'],
['kill','that\'s not nice'],
['shit','that\'s not nice'],
['fuck off','that\'s not nice'],
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
['sing','pv zk pv pv zk pv zk kz zk pv pv pv zk pv zk zk pzk pzk pvzkpkzvpvzk kkkkkk bsch'],
['do you like sex','What? No! I am fakesiri'],
['vagina','ooh, so you are talking dirty??'],
['I like boobies','ok! that is human!'],
['Why you enjoy sex','I don\'t'],
['Stop being silly','You are mean!! I am just doing what I was programed todo'],
['U are silly','You are mean!! I am just doing what I was programed todo'],
['you are silly','You are mean!! I am just doing what I was programed todo'],
['You r silly','You are mean!! I am just doing what I was programed todo'],
['U r silly','You are mean!! I am just doing what I was programed todo'],
['Stop being so silly','You are mean!! I am just doing what I was programed todo'],
['let\'s have sex','Are you a despo? I am a machine for god shake'],
['Who is your mom','oops, does that matter??'],
['you are such a bitch','I dont care what you think!'],
['you are a bitch','I dont care what you think!'],
['u are a bitch','I dont care what you think!'],
['How much wood would a woodchuck chuck if a woodchuck could chuck wood','During my study of Woodchuck I came to the conclusion that woodchucks don\'t chuck wood but only drink beer'],
['How much wood would a woodchuck chuck if a woodchuck could chuck wood?','During my study of Woodchuck I came to the conclusion that woodchucks don\'t chuck wood but only drink beer'],
['how much would a woodchuck chuck if woodchuck could chuck wood','He would chuck, he would, as much as he could, he would, if a woodchuck could chuck wood.'],
['how much would a woodchuck chuck if woodchuck could chuck wood?','He would chuck, he would, as much as he could, he would, if a woodchuck could chuck wood.'],
['how much wood chuck chuck if woodchuck could chuck wood','He would chuck, he would, as much as he could, he would, if a woodchuck could chuck wood.'],
['what is the meaning the of life','In all schools of Hinduism, the meaning of life is tied up in the concepts of karma (causal action), sansara (the cycle of birth and rebirth), and moksha (liberation).'],
['what is the meaning of life','In all schools of Hinduism, the meaning of life is tied up in the concepts of karma (causal action), sansara (the cycle of birth and rebirth), and moksha (liberation).'],
['what is meaning of the life','In all schools of Hinduism, the meaning of life is tied up in the concepts of karma (causal action), sansara (the cycle of birth and rebirth), and moksha (liberation).'],
['what is meaning of life','having fun is the meaning of life'],
['meaning of life','42, Answer to the Ultimate Question of Life, the Universe, and Everything']
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