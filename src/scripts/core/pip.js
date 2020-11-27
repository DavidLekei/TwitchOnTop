//SOURCE: https://github.com/GoogleChromeLabs/picture-in-picture-chrome-extension/blob/master/src/script.js

async function requestPictureInPicture(video) {
  await video.requestPictureInPicture();
  video.setAttribute('__pip__', true);
  video.addEventListener('leavepictureinpicture', event => {
    video.removeAttribute('__pip__');
  }, { once: true });
  new ResizeObserver(maybeUpdatePictureInPictureVideo).observe(video);
}

function maybeUpdatePictureInPictureVideo(entries, observer) {
  const observedVideo = entries[0].target;
  if (!document.querySelector('[__pip__]')) {
    observer.unobserve(observedVideo);
    return;
  }
  const video = document.querySelector("video");
  if (video && !video.hasAttribute('__pip__')) {
    observer.unobserve(observedVideo);
    requestPictureInPicture(video);
  }
}

(async () => {
  const video = document.querySelector("video");

  if (!video) {
    return;
  }

  video.preload = "auto";	

  video.onloadedmetadata = async function(){
	  if (video.hasAttribute('__pip__')) {
	    document.exitPictureInPicture();
	    return;
	  }
	  await requestPictureInPicture(video);
	  chrome.runtime.sendMessage({ message: 'enter' });
	}
  }
)();