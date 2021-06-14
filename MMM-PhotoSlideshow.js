// moduleID is the identifier property of the module
function getThisModule() {
	const modules = MM.getModules();
	for(let i = 0; i < modules.length; i++){
		Log.log(modules[i].identifier);
		if(modules[i].name === "MMM-PhotoSlideshow"){
			return modules[i];
		}
	}
	return undefined;
}

function nextPhoto() {
	const module = getThisModule();
	module.nextPhoto();
}

function previousPhoto() {
	const module = getThisModule();
	module.previousPhoto();
}

function refresh() {
	const module = getThisModule();
	module.refresh();
}

Module.register("MMM-PhotoSlideshow", {

	defaults: {
		albumPath: "./",
		cycleTime: 5000, //Default 5 seconds per picture
		animationTime: 500 //Default half second animation
	},

	album: [], //array containing names of the files in the directory pointed to by album path
	albumURLs: [], //array containing the object urls of the photos
	currentPhotoIndex: 0,
	interval: undefined,

	nextPhoto: function() {
		this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.album.length;
		this.updateDom(this.config.animationTime);
	},

	previousPhoto: function() {
		this.currentPhotoIndex = (this.currentPhotoIndex - 1) % this.album.length;
		this.updateDom(this.config.animationTime);
	},

	refresh: function() {
		clearInterval(interval);
		this.sendSocketNotification('REFRESH_ALBUM', this.config.albumPath);
	},

	start: function() {
		//Keep in mind the dom object has not been created yet as of this function
		Log.log('MMM-PhotoSlideshow started.');
		this.sendSocketNotification('REFRESH_ALBUM', this.config.albumPath);
	},

	getPhoto: async function(photoIndex) {
		const response = await fetch(this.config.albumPath + this.album[photoIndex]);
		const blob = await response.blob();
		const url = URL.createObjectURL(blob);
		Log.log("Current Image: " + url);
		return url;
	},

	makeURLs: async function() {
		for(let i = 0; i < this.album.length; i++){
			const url = await this.getPhoto(i);
			this.albumURLs.concat(url);
		}
		this.interval = setInterval(nextPhoto, this.config.cycleTime);
	},

	getScripts: function() {
		return []; // Currently no scripts
	},

	getStyles: function() {
		return [];//[this.file('css/PhotoSlideshow.css')];
	},

	getDom: function() {
		const division = document.createElement('div');
		division.class = 'PhotoSldshw';
		const img = document.createElement('img');
		img.src = this.albumURLs[this.currentPhotoIndex];
		const forwardButton = document.createElement('button');
		forwardButton.name = 'Next';
		forwardButton.class = 'forward';
		forwardButton.textContent = 'Next';
		forwardButton.onclick = nextPhoto;
		const backButton = document.createElement('button');
		backButton.name = 'Previous';
		backButton.class = 'back';
		backButton.textContent = 'Previous';
		backButton.onclick = previousPhoto
		const refreshButton = document.createElement('button');
		refreshButton.name = 'refresh';
		refreshButton.class = 'refresh';
		refreshButton.textContent = '↻';
		refreshButton.onclick = refresh;
		division.appendChild(img);
		division.appendChild(forwardButton);
		division.appendChild(backButton);
		division.appendChild(refreshButton);
		return division;
	},

	notificationReceived: function(notification, payload, sender){
		if(notification === 'DOM_OBJECTS_CREATED'){ //Received when all dom objects from all modules are loaded

		}
	},

	socketNotificationReceived: function(notification, payload) {
		Log.log('Notification receieved from node_helper');
		if(notification === 'NEW_ALBUM'){
			Log.log('NEW_ALBUM notification received');
			Log.log(payload);
			this.album = Array.from(payload);
			Log.log('Album set!\n' + this.album);
			this.makeURLs();
			// this.updateDom(this.config.animationTime);
		}
	}
});