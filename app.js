/*
For now, lets just leave it as two arrays, before deploy make sure we switch it to an actual file
*/

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
var[] accArray;
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
//Send money gonna find @user and $amount of money
Twitter.stream('statuses/filter', {track: '#send'}, function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
    var isRegistered=false;
    var isReceiverRegistered=false;
    var pos;
    var pos2;
    if(users.length!=0)
    {
    	//This loop checks if both users are registered
    	users.foreach(function(item, index, array)
		{
			if(item==tweet.user.id_str)
			{
				//The user is registered already
				pos = users.indexOf(item);
				isRegistered=true;
			}
			if(item==tweet.user_mentions[0].id_str)
			{
				pos2 = money.indexOf(item);
				isReceiverRegistered=true;
			}
		});
    	if(isRegistered==true)
    	{
    		if(isReceiverRegistered==true)
    		{
    			//For now we'll have it like this it needs to be in between $, we gotta change it to something else tho, gotta do tests
    			var tempStr = tweet.text.match("$(.*)$");
    			var moneySent = parseInt(tempStr[1],10);
    			var answer = {status: "@"+tweet.user.screen_name+" you sent "+moneySent+" to @"+tweet.user_mentions[0].screen_name}
    			money[pos]-=moneySent;
    			money[pos2]+=moneySent;
    			Twitter.post('statuses/update',answer,function(error,tweetReply,response)
				{
					if(error)
					{
						console.log(error);
					}
				console.log(tweetReply.text);
				});
    		}
    		else
    		{
    			//We gotta register the receiver this may break ToS sooooo maybe not

    		}
    	}
	}
});

  stream.on('error', function(error) {
    console.log(error);
  });
});
//Help command
Twitter.stream('statuses/filter', {track: '@twitcoinbank #help'}, function(stream) {
  stream.on('data', function(tweet) {
  	var answer = {status: "@"+tweet.user.screen_name+" #open:Opens account|#sendXXX:Send money(tag a user as well)|#close:Closes account"};
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
	var acc = [parseInt(tweet.user.id_str,10),tweet.user.followers_count];
	accArray.push(acc);
	users.push(tweet.user.id_str);
	money.push(tweet.user.followers_count);
}