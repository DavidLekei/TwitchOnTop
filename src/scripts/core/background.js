//Set the badge text on the icon to be the number of followed streams that are //currently live.
//For now, until we implement the Twitch API, we will always set the value to 5

//TODO: Store CLIENT_ID in chrome.storage
//		Figure out a way not to store CLIENT_SECRET
//		Store OAuth token in chrome.storage
//			- Retrieve OAuth token
//			- Check if still valid (expires in about 30 days)
//			- If expired, get a new one, repeat

function storeOAuthToken(token){
	chrome.storage.sync.set({'oauth_token': token}, function(){
		if(chrome.runtime.error){
			console.log('Runtime Error: Could Not Store OAuth Token');
		}
		chrome.storage.sync.get(['oauth_token'], function(result) {
			console.log('OAuth Token : ' + result.oauth_token + ' Stored');
		});
	});
}


function requestOAuthToken(){
	//TODO: Store Client ID in chrome.storage
	// const CLIENT_ID = '53kofil8rhhvjys3tksz8rixg65tc4';
	// const CLIENT_SECRET = 'kuc7n1itvd62rpp70bax5gpx2qkn2p';
	// var params = "client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&grant_type=client_credentials";

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			console.log('OAuth Token Recieved: ' + xhr.responseText);
			response = JSON.parse(xhr.responseText);
			token = response['access_token'];
			console.log('Got New OAuth Token: ' + token)
			storeOAuthToken(token);
		}
		if(this.status == 400){
			console.log('400: ' + xhr.responseText);
		}
	};
	xhr.open("GET", "http://localhost:5000/oauth/TwitchOnTop/?passwd=BadPassword321")
	// xhr.open("POST", "https://id.twitch.tv/oauth2/token?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&grant_type=client_credentials");
	xhr.send();
}

function twitchGetLiveFollowed(){
	return "5";
}

function initTwitchSettings(){
	var liveFollowed = twitchGetLiveFollowed();
	requestOAuthToken();
	chrome.browserAction.setBadgeText({text: liveFollowed}, null);
}

function init(){
	chrome.storage.sync.clear();
	console.log("Initializing TwitchOnTop");
	initTwitchSettings();
}


chrome.runtime.onStartup.addListener(init);
chrome.runtime.onInstalled.addListener(init);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		console.log('Action Recieved: ' + request.action);
		if(request.action === 'twitchGetId'){
			twitch_id = twitchGetId();
			sendResponse({twitch_id: twitch_id}, function(){});
		}
		else if(request.action == 'twitchGetOAuthToken'){
			chrome.storage.sync.get(['oauth_token'], function(result) {
				console.log('OAuth Token : ' + result.oauth_token + ' Stored');
				sendResponse({oauth_token: result.oauth_token}, function(){});
			});
		}
	}
);