const CLIENT_ID = '53kofil8rhhvjys3tksz8rixg65tc4';

twitchGetInfoFromStorage();

function init(twitch_username, twitch_id){

	if(twitch_id === null || twitch_id === undefined){
		promptUserForUsername();
	}
	else{
		a_twitchGetFollowingFromAPI(twitch_username, twitch_id);
	}
}

function a_twitchOpenStream(url){
	chrome.windows.create({url: url, focused: true, width: 800, height: 600, type: 'popup'}, function(){
		chrome.windows.getCurrent(function(window){
			chrome.windows.update(window.id, {alwaysOnTop: true});
		});
	});
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
			showLiveFollowing(twitch_username, response['data']);
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
			console.log(response);
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

function addStreamToContentArea(streamInfo){
	// <a href="http://google.ca">
	// 	<div class="stream-link">
 //        	<img src="https://static-cdn.jtvnw.net/previews-ttv/live_user_b0aty-440x248.jpg"> 
 //            <div class="stream-info">
	// 			<h1>b0aty</h1>
 //                <p>Old-School Runescape</p>
 //                <p>Long descriptuoin asfdsfa dfasf sdfds fdfsfadfsafsdfas fsf</p>
 //            </div>
	// 	</div>
 //        </a>

 		console.log("TRYING TO READ FROM STREAMINFO: " + streamInfo);
 		var user_name = streamInfo['user_name'];
 		var link = "https://player.twitch.tv/?channel=" + user_name + "&enableExtensions=true&muted=true&parent=twitch.tv&player=popout&volume=0.1899999976158142"
		// var link = "https://twitch.tv/" + user_name;
		var game = streamInfo['game_name'];
		var title = streamInfo['title'];
		var thumbnail = "https://static-cdn.jtvnw.net/previews-ttv/live_user_" + user_name.toLowerCase() + "-320x180.jpg"

		const content_area = document.getElementById("content-area");

		var a = document.createElement("a");
		a.href = link;

		var stream = document.createElement("div");
		stream.setAttribute("class", "stream-link");
		stream.addEventListener('click', (url) => a_twitchOpenStream(link));

		var img = document.createElement("img");
		img.src = thumbnail;

		var stream_info = document.createElement("div");
		stream_info.setAttribute("class", "stream-info");

		var _name = document.createElement("p");
		_name.innerHTML = user_name;

		var _game = document.createElement("p");
		_game.innerHTML = game;

		var stream_title = document.createElement("p");
		stream_title.innerHTML = title;

		stream_info.appendChild(_name);
		stream_info.appendChild(_game);
		stream_info.appendChild(stream_title);

		stream.appendChild(img);
		stream.appendChild(stream_info);

		


		content_area.appendChild(stream);
	};

function showLiveFollowing(username, following_list){
	// const followed = ["Tyler1", "b0aty", "shroud", "broesser", "xQc"];

	const cont = document.getElementById("content-area");
	cont.innerHTML = "";
	const h1 = document.createElement("h1");
	h1.innerHTML = username + " - Following";
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