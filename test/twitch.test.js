const background = require('./background.test.js');

const CLIENT_ID = '53kofil8rhhvjys3tksz8rixg65tc4';
const OAUTH_TOKEN = '06dhista7o0ppt66sgekzdlfq6cl5i';

let mockxhr = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      onreadystatechange: jest.fn(),
      send: jest.fn(),
      readyState: 4,
      responseText: OAUTH_TOKEN,
      status: 200
    }

global.chrome = {
   runtime: {
   	onStartup:{
   		addListener: jest.fn()
   	},
   	onInstalled:{
   		addListener: jest.fn()
   	}
   },
   storage: {
   	sync: {
   		set: jest.fn(),
   		// set: function(token){},
   		get: jest.fn()
   	}
   },
   notifications: {
   	create: jest.fn()
   }
};

mockCallback = (result) => jest.fn()

describe('Chrome Storage', () => {
	test('Store OAuth Token', () => {
		background.StoreOAuthToken(OAUTH_TOKEN);
		expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
		expect(chrome.storage.sync.set).toHaveBeenCalledWith({oauth_token: OAUTH_TOKEN}, expect.any(Function));
		
	});

	test('Get OAuth Token', () => {
		background.GetOAuthToken();
		expect(chrome.storage.sync.get).toHaveBeenCalled();
		expect(chrome.storage.sync.get).toHaveBeenCalledTimes(1);
	});

});

describe('XMLHttpRequests', () => {
	beforeAll(() => {
		const oldXHR = window.XMLHttpRequest;
		window.XMLHttpRequest = jest.fn(() => mockxhr);
	 } );

	afterAll(() => {
		window.XMLHttpRequest = oldXHR;
	});
	test('Request OAuth Token', () => {
		background.RequestOAuthToken();
		expect(mockxhr.open).toHaveBeenCalled();
		expect(mockxhr.open).toHaveBeenCalledWith("GET", "https://oauth2-serv.herokuapp.com/oauth/TwitchOnTop/?passwd=BadPassword321");
		expect(mockxhr.send).toHaveBeenCalled();
		mockxhr.onreadystatechange();
		expect(token).toBe(OAUTH_TOKEN);
	} );

	test('Is Stream Live', () => {
		let mockResponse = {'data': [
			{
				'is_live': true
			}
		]};
		mockxhr.responseText = JSON.stringify(mockResponse);


		background.IsLive('1klks');
		expect(mockxhr.open).toHaveBeenCalled();
		expect(mockxhr.open).toHaveBeenCalledWith("GET", "https://api.twitch.tv/helix/search/channels?query=1klks", false);
		expect(mockxhr.setRequestHeader).toHaveBeenCalled();
		expect(mockxhr.setRequestHeader).toHaveBeenCalledWith("Client-ID", CLIENT_ID);
		expect(mockxhr.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer ' + OAUTH_TOKEN);
		expect(mockxhr.send).toHaveBeenCalled();
		mockxhr.onreadystatechange();
		expect(json).toBeDefined();
		expect(json).toStrictEqual(mockResponse);
	});

});

describe('Notifications', () => {
	// background.isLive = jest.fn(() => true);
	// background.globals.notification_list = []
	console.log(background.globals);

	background.CheckNotificationsLive();

	expect(chrome.notifications.create).toHaveBeenCalled();
});