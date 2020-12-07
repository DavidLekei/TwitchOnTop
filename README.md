# TwitchOnTop

Quickly See Who's Live!

(DISCLAIMER: This project is still a work in progress. In it's current state, it serves as a high fidelity prototype)

## About

TwitchOnTop is a Chrome extension that displays live Twitch streams on the users Following list

TwitchOnTop allows the user to specify if they want the stream to open up as a new Window, a new Tab or as Picture-in-Picture

Pressing Ctrl makes checkboxes appear next to each Stream. When checked, the user will recieve notifications when the stream is live

## Notes

As of now, the Picture-in-Picture doesn't work seamlessly. After clicking the stream, a new tab will open. This tab needs to be focused for a few seconds until the Stream's metadata is loaded.

Once the metadata is loaded, Picture-in-Picture will be initiated automatically. On average, this takes about 3 seconds to accomplish.

---
Twitch requires certain requests to use an OAuth token.

In order to obtain an OAuth token, a Client Secret must be sent. Following Best Practices, the Client Secret is not and should not be given out with the Extension.

Thus, a REST API is set up and hosted by Heroku to obtain an OAuth Token. 

The Extension sends an HTTP Request to the REST API at /TwitchOnTop/OAuth/ to obtain a new Token.

## Technology used

TwitchOnTop is written in HTML/CSS/JavaScript

Chrome API's are used for Storage/Notifications/Tabs/etc

The REST API is written in Python using Flask

Jest is used for unit testing JavaScript (Not fully implemented)

## Screenshots


## Author

David Lekei

## License
