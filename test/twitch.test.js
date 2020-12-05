const background = require('./background.test.js');

const CLIENT_ID = '53kofil8rhhvjys3tksz8rixg65tc4';
const OAUTH_TOKEN = '06dhista7o0ppt66sgekzdlfq6cl5i';


const set = jest.fn()
const get = jest.fn()
get.mockReturnValue(OAUTH_TOKEN);
global.chrome = {
   runtime: {
   	onStartup:{
   		addListener: function(){}
   	},
   	onInstalled:{
   		addListener: function(){}
   	}
   },
   storage: {
   	sync: {
   		set,
   		// set: function(token){},
   		get
   	}
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

	test('Should Get The Token', () => {
		function callback(data){
			try{
				expect(data).toBe(OAUTH_TOKEN);
				done();
			} catch(error){
				done(error);
			}
		}

		chrome.storage.sync.get(['oauth_token'], callback);
	});

});