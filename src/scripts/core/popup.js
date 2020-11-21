const CLIENT_ID = '53kofil8rhhvjys3tksz8rixg65tc4';

twitchGetInfoFromStorage();

function init(twitch_username, twitch_id){
	console.log("twitch_id = " + twitch_id);

	if(twitch_id === null || twitch_id === undefined){
		console.log("Asking User for Username");
		promptUserForUsername();
	}
	else{
		a_twitchGetFollowingFromAPI(twitch_username, twitch_id);
	}
}

function twitchGetInfoFromStorage(){
	chrome.storage.sync.get(['twitch_id', 'twitch_username'], function(result){
				init(result.twitch_username, result.twitch_id);
			});

}

function setTwitchId(id){
	chrome.storage.sync.set({'twitch_id': id}, function(){
		if(chrome.runtime.error){
			console.log('Runtime error');
		}
	});
}

function getLiveUserNames(live_streams){
	var user_names = [];
	for(var i = 0; i < live_streams.length; i++){
		user_names.push(live_streams[i]['user_name']);
	}
	return user_names;
}

function getFollowingUserIDs(following){
	var user_ids = [];
	for(var i = 0; i < following.length; i++){
		user_ids.push(following[i]['channel']['_id']);
	}	

	return user_ids;
}

async function a_twitchGetLiveStreams(twitch_username, following, oauth_token){
	var user_ids = getFollowingUserIDs(following);
	var params = user_ids.join('&user_id=');

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			response = JSON.parse(xhr.responseText);
			console.log(response);
			live_users = getLiveUserNames(response['data']);
			console.log('Currently Live Streams: ' + live_users);
			showLiveFollowing(twitch_username + " - Following", live_users);
		}
	};

	xhr.open("GET", "https://api.twitch.tv/helix/streams/?user_id=" + params);
	xhr.setRequestHeader('Client-ID', CLIENT_ID);
	xhr.setRequestHeader('Authorization', 'Bearer ' + oauth_token);
	xhr.send();
}

async function a_getOAuthToken(twitch_username, following){
	chrome.storage.sync.get(['oauth_token'], function(result){
		console.log('Retrieved OAuth Token: ' + result.oauth_token);
		a_twitchGetLiveStreams(twitch_username, following, result.oauth_token);
	});
	// chrome.runtime.sendMessage({'action': 'twitchGetOAuthToken'}, function(response){
	// 	console.log('Recieved OAuth Token: ' + response.oauth_token + ' from background.js');
	// 	a_twitchGetLiveStreams(twitch_username, following, response.oauth_token);
	// });
}

async function a_twitchGetFollowingFromAPI(twitch_username, twitch_id){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			response = JSON.parse(xhr.responseText);
			console.log('Following: ' + response['follows'][2]['channel']['display_name']);
			a_getOAuthToken(twitch_username, response['follows']);
		}
	};

	xhr.open("GET", "https://api.twitch.tv/v5/users/" + twitch_id + "/follows/channels?client_id=" + CLIENT_ID + "&limit=100");
	xhr.send();
}

async function a_twitchGetIdFromAPI(twitch_username){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			response = JSON.parse(xhr.responseText);
			_id = response['users'][0]['_id'];
			setTwitchId(_id);
			a_twitchGetFollowingFromAPI(twitch_username, _id);
		}
	};

	xhr.open("GET", "https://api.twitch.tv/v5/users/?login=" + twitch_username + "&client_id=" + CLIENT_ID);
	xhr.send();
}

function addStreamToContentArea(streamName){
		const content_area = document.getElementById("content-area");

		var name = document.createElement("p");
		name.innerHTML = streamName;

		content_area.appendChild(name);
	};

function showLiveFollowing(username, following_list){
	// const followed = ["Tyler1", "b0aty", "shroud", "broesser", "xQc"];

	const cont = document.getElementById("content-area");
	cont.innerHTML = "";
	const h1 = document.createElement("h1");
	h1.innerHTML = username;
	cont.appendChild(h1);

	const clear_btn = document.createElement("button");
	clear_btn.innerHTML = "Clear Storage";
	clear_btn.onclick = function(){
		chrome.storage.sync.clear(function(){
			console.log("Local Storage Cleared");
		});
	}
	cont.appendChild(clear_btn);

	for(var i = 0; i < following_list.length; i++){
		addStreamToContentArea(following_list[i]);
	}

}
function promptUserForUsername(){
	const cont = document.getElementById("content-area");
	cont.innerHTML = "";
	const h1 = document.createElement("h1");
	h1.innerHTML = "Please Enter Your Twitch Username";
	const input = document.createElement("input");
	input.setAttribute("type", "text");
	const btn = document.createElement("button");
	btn.innerHTML = "Autheticate Twitch";

	btn.onclick = (twitch_username) => buttonOnClick(input.value);

	// btn.onclick = function(){
	// 	id = twitchGetIdFromAPI(this.value);
	// 	a_twitchGetIdFromAPI(this.value);
	// 	chrome.storage.sync.set({'twitch_id': id}, function(){
	// 		if(chrome.runtime.error){
	// 			console.log('Runtime error');
	// 		}
	// 	});
	// 	showUserFollowing("1klks - Following");
	// };
	cont.appendChild(h1);
	cont.appendChild(input);
	cont.appendChild(btn);
}

function buttonOnClick(twitch_username){
	a_twitchStoreUsername(twitch_username);
	a_twitchGetIdFromAPI(twitch_username);
	// showUserFollowing(twitch_username + " - Following");
}

async function a_twitchStoreUsername(twitch_username){
	chrome.storage.sync.set({'twitch_username': twitch_username}, function(){
		if(chrome.runtime.error){
			console.log('Runtime Error while saving Twitch Username');
		}
	});
}