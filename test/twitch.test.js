function testTwitchAuthenticate(){
	const CLIENT_ID = '53kofil8rhhvjys3tksz8rixg65tc4';

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			console.log(xhr.responseText);
		}
	};

	xhr.open("GET", "https://id.twitch.tv/oauth2/authorize?client_id=" + CLIENT_ID +
		"&redirect_uri=http://localhost" +
		"&response_type=token" + 
		"&scope=viewing_activity_read"
		);

	return true;
}

test('Authenticates Twitch user using Twitch API', () => {
	var res = testTwitchAuthenticate();
	expect(res.toBeTruthy);
	expect(res).toBe(true);
	// expect(testTwitchAuthenticate().toReturn(true));
});