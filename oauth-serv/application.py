from flask import Flask, request, jsonify, json
from flask_api import status
from flask_cors import CORS
from datetime import datetime
import requests

application = Flask(__name__)
cors = CORS(application)

TWITCH_CLIENT_SECRET= None
TWITCH_CLIENT_ID = '53kofil8rhhvjys3tksz8rixg65tc4'
TWITCH_OAUTH_API_BASE_URL = 'https://id.twitch.tv/oauth2/token?'

global TWITCH_OAUTH_TOKEN

def authenticate_request(request_passwd):
	passwd = None
	with open('.passwd', 'r') as f:
		passwd = f.read()
	if(passwd == request_passwd):
		return True
	else:
		return False

#TODO: Hash/salt/encrypt password
@application.route("/oauth/TwitchOnTop/", methods=['GET'])
def get_twitch_oauth_token():
	global TWITCH_OAUTH_TOKEN
	print('TWITCH_OAUTH_TOKEN: ', TWITCH_OAUTH_TOKEN)
	request_passwd = request.args.get('passwd')

	if(authenticate_request(request_passwd)):
		print('Trying to Return', TWITCH_OAUTH_TOKEN)
		return TWITCH_OAUTH_TOKEN
	else:
		return 'Invalid Password', status.HTTP_401_UNAUTHORIZED

#TODO: Add authentication to this request as well
@application.route("/oauth/TwitchOnTop/new/", methods=['GET'])
def get_new_twitch_oauth_token():
	global TWITCH_OAUTH_TOKEN

	params = "client_id=" + TWITCH_CLIENT_ID + "&client_secret=" + TWITCH_CLIENT_SECRET + "&grant_type=client_credentials"

	data = {'client_id': TWITCH_CLIENT_ID, 'client_secret': TWITCH_CLIENT_SECRET, 'grant_type': 'client_credentials'}
	#print(data)

	#response = requests.post(TWITCH_OAUTH_API_BASE_URL, data=data)
	#print(response.json())
	with open('.mock_oauth_response', 'r') as f:
		response = f.read()

	#TWITCH_OAUTH_TOKEN = response.json()
	TWITCH_OAUTH_TOKEN = response

	return 'Twitch OAuth Token Has Been Updated.'

if __name__ == '__main__':
	with open('.client_secret', 'r') as f:
		TWITCH_CLIENT_SECRET = f.read()
		print(TWITCH_CLIENT_SECRET)
	application.run()
