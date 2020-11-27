function loadUserSettings(){
	chrome.storage.sync.get({
		windowType: 'popup'
	},
	function(settings){
		document.getElementById("options-window-type").value = settings.windowType;
	});

}

function saveUserSettings(){
	var windowType = document.getElementById("options-window-type").value;	
	chrome.storage.sync.set({
		windowType: windowType
	},
	function(){
		var status_div = document.getElementById("status");
		status_div.textContent = "Options Saved";
		setTimeout(function(){
			status_div.textContent = "";
		}, 5000);
	});
}

var save_btn = document.getElementById("save-btn");
save_btn.addEventListener("click", () => saveUserSettings());

document.addEventListener("DOMContentLoaded", loadUserSettings);