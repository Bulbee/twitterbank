var TwitterPackage = require('twitter');
//Gotta change this to a new account
var secret = {
	consumer_key: 'x',
	consumer_secret: 'x',
	access_token_key: 'x-x',
	access_token_secret: 'x'
}

var Twitter = new TwitterPackage(secret);
var[] users;
var[] money;
//This stream allows us to find users that want to subscribe
Twitter.stream('statuses/filter', {track: '@twitcoinbank #open'}, function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
	
	if(users.length!=0)
	{
		var isRegistered=false;
		users.foreach(function(item, index, array)
		{
			if(item==tweet.user.id_str)
			{
				//The user is registered already
				isRegistered=true;
			}
		});
		if(isRegistered==true)
		{
			var answer = {status: "@"+tweet.user.screen_name+" you already have an account."};
		}
		else
		{
			register();
		}
	}
	else
	{
		register();
	}
	Twitter.post('statuses/update',answer,function(error,tweetReply,response)
	{
		if(error)
		{
			console.log(error);
		}
		console.log(tweetReply.text);
	});
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
//This stream unsubscribes people
Twitter.stream('statuses/filter', {track: '@twitcoinbank #close'}, function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
    var isRegistered=false;
    var pos;
    if(users.length!=0)
    {
    	users.foreach(function(item, index, array)
		{
			if(item==tweet.user.id_str)
			{
				//The user is registered already
				pos = users.indexOf(item);
				isRegistered=true;
			}
		});
		if(isRegistered==false)
    	{
   		 	var answer = {status: "@"+tweet.user.screen_name+" you don't have an account."}
    	}
    	else
    	{
    		var answer = {status: "@"+tweet.user.screen_name+" your account has been closed."}
    		var removedUser = users.splice(pos,1);
    		var removedMoney = money.splice(pos,1);
    	}
	}
	else
	{
		var answer = {status: "@"+tweet.user.screen_name+" you don't have an account."}
	}
    
	Twitter.post('statuses/update',answer,function(error,tweetReply,response)
	{
		if(error)
		{
			console.log(error);
		}
		console.log(tweetReply.text);
	});
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});


//Function to register users
function register(){
	var answer = {status: "@"+tweet.user.screen_name+" you have opened an account and you have "+tweet.user.followers_count+" coins!"};
	users.push(tweet.user.id_str);
	money.push(tweet.user.followers_count);
}