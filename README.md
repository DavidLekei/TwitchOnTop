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

### Enter your username

![](https://i.gyazo.com/08588a820cfd2cc0086260a72f345b69.png)

### Any Streamers that you follow that are currently live will be displayed

![](https://i.gyazo.com/e978b90b4887701f3534f2b09c585572.png)

### Configure how the Stream appears

![](https://i.gyazo.com/71a5ed84aad147bbb422e0d337345c44.png)

### Use Picture-in-Picture to Multitask!

![](https://i.gyazo.com/dc29c1f2185f09f4a174e14b31a7f903.png)


## Author

David Lekei

## License

This project is licensed under the MIT License - see the LICENSE.md file for details