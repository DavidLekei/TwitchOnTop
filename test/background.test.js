//Set the badge text on the icon to be the number of followed streams that are //currently live.
//For now, until we implement the Twitch API, we will always set the value to 5

//TODO: Store CLIENT_ID in chrome.storage
//		Figure out a way not to store CLIENT_SECRET
//		Store OAuth token in chrome.storage
//			- Retrieve OAuth token
//			- Check if still valid (expires in about 30 days)
//			- If expired, get a new one, repeat

const CLIENT_ID = '53kofil8rhhvjys3tksz8rixg65tc4';
var notified = [];
var notification_list = null;
var OAUTH_TOKEN = null;

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

function getOAuthToken(){
	chrome.storage.sync.get(['oauth_token'], function(result){

	});
}

function requestOAuthToken(){
	console.log('Requesting OAuth Token...');
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			//response = JSON.parse(xhr.responseText);
			token = xhr.responseText;
			console.log('Got New OAuth Token: ' + token)
			OAUTH_TOKEN = token;
			storeOAuthToken(token);
		}
		if(this.status == 400){
			console.log('400: ' + xhr.responseText);
		}
	};
	xhr.open("GET", "https://oauth2-serv.herokuapp.com/oauth/TwitchOnTop/?passwd=BadPassword321")
	xhr.send();
}

//TODO: Query user_id instead of user_name so that we don't get a response of multiple channels.
function isLive(user_name){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.twitch.tv/helix/search/channels?query=" + user_name, false);
	xhr.setRequestHeader('Client-ID', CLIENT_ID);
	xhr.setRequestHeader('Authorization', 'Bearer ' + OAUTH_TOKEN);
	xhr.send();

	if(xhr.status == 200)
	{
		json = JSON.parse(xhr.responseText);
		console.log('isLive response: ' + json['data'][0]['is_live']);
		return json['data'][0]['is_live'];
	}
	return false;
}

function initNotificationsList(){
	chrome.storage.sync.set({notification_list: []}, function(result){
		console.log('Initialized empty notification list.');
	});
}

function getNotificationsList(){
	chrome.storage.sync.get(['notification_list'], function(result){
		notification_list = result.notification_list;
	});
}

//Check if any users in the notifications_list have gone live since last check.
function checkNotificationsLive(){
	if(notification_list == null){
		console.log('Notification list is null');
		return;
	}
	chrome.notifications.create("_" + i, {type: 'basic', title: 'TwitchOnTop', message: '' + notification_list[i] + ' is now live!', iconUrl: 'images/icon.png'}, function(e){
				console.log('created notification');
			} );
	// console.log('Checking Notifications List for Live users - length: ' + notification_list.length);
	// for(var i = 0; i < notification_list.length; i++){
	// 	if(isLive(notification_list[i]) == true){
	// 		chrome.notifications.create("_" + i, {type: 'basic', title: 'TwitchOnTop', message: '' + notification_list[i] + ' is now live!', iconUrl: 'images/icon.png'}, function(e){
	// 			console.log('created notification');
	// 		} );
	// 		notified.push(notification_list[i]);
	// 		notification_list.splice(i, 1);
	// 	}
	// }
}

function checkNotifiedOffline(){
	for(var i = 0; i < notified.length; i++){
		if(!isLive(notified[i])){
			notification_list.push(notified[i]);
			notified.splice(i, 1);
		}
	}
}

function getLive(){
	console.log('Alarm fired.');
}

//TODO: Allow user to specify period in options.js
function createAlarms(){
	chrome.alarms.create('getLive', {periodInMinutes: 5});
	chrome.alarms.create('checkNotificationsLive', {periodInMinutes: 1});
	chrome.alarms.create('checkNotifiedOffline', {periodInMinutes: 30});
}

function initListeners(){

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
			else if(request.action == 'refreshNotificationList'){
				chrome.storage.sync.get(['notification_list'], function(result){
					notification_list = result.notification_list;
				});
			}
		}
	);

	chrome.alarms.onAlarm.addListener(
		function(alarm){
			//Get live following and update badge
			if(alarm.name == 'getLive'){
				console.log('Alarm for getLive');
			}
			else if(alarm.name == 'checkNotificationsLive'){
				checkNotificationsLive();
			}
			else if(alarm.name == 'checkNotifiedOffline'){
				checkNotifiedOffline();
			}
		}	
	);
}

function startup(){
	//TODO: Remove the clear()
	chrome.storage.sync.clear();
	console.log("Initializing TwitchOnTop");
	requestOAuthToken();
	initListeners();
	createAlarms();
	getNotificationsList();
}

function installed(){
	requestOAuthToken();
	createAlarms();
	initNotificationsList();
}

// chrome.runtime.onStartup.addListener(startup);
// chrome.runtime.onInstalled.addListener(installed);

module.exports = {
	StoreOAuthToken: (token) => storeOAuthToken(token),
	GetOAuthToken: () => getOAuthToken(),
	RequestOAuthToken: () => requestOAuthToken(),
	IsLive: (user_name) => isLive(user_name),
	InitNotificationsList: () => initNotificationsList(),
	GetNotificationsList: () => getNotificationsList(),
	CheckNotificationsLive: () => checkNotificationsLive(),
	CheckNotifiedOffline: () => checkNotifiedOffline(),
	GetLive: () => getLive(),
	CreateAlarms: () => createAlarms(), 
	globals: {
		notification_list: []
	}
}