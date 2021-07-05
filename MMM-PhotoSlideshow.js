// moduleID is the identifier property of the module
function getThisModule() {
	const modules = MM.getModules();
	for(let i = 0; i < modules.length; i++){
		//Log.log(modules[i].identifier);
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

function pause(){
	const module = getThisModule();
	module.pause();
}

Module.register("MMM-PhotoSlideshow", {

	defaults: {
		albumPath: "/",
		cycleTime: 10000, //Default 10 seconds per picture
		animationTime: 500 //Default half second animation
	},

	album: [], //array containing names of the files in the directory pointed to by album path
	currentPhotoIndex: 0,
	interval: undefined,
	pauseState: '‖', //if pause symbol, means playing but can be paused

	nextPhoto: function() {
		this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.album.length;
		Log.log("Current Photo URL: " + encodeURI(this.config.albumPath + this.album[this.currentPhotoIndex]));
		this.updateDom(this.config.animationTime);
	},

	previousPhoto: function() {
		this.currentPhotoIndex = this.currentPhotoIndex - 1;
		if(this.currentPhotoIndex < 0){
			this.currentPhotoIndex = this.album.length + this.currentPhotoIndex;
		}
		this.updateDom(this.config.animationTime);
	},

	refresh: function() {
		clearInterval(this.interval);
		this.sendSocketNotification('REFRESH_ALBUM', this.config.albumPath);
	},

	pause: function() {
			if(this.pauseState === '‖'){
				this.pauseState = '►';
				clearInterval(this.interval);
			}
			else if(this.pauseState === '►'){
				this.pauseState = '‖';
				this.interval = setInterval(nextPhoto, this.config.cycleTime);
			}
			this.updateDom(); //No animation here
	},

	start: function() {
		//Keep in mind the dom object has not been created yet as of this function
		Log.log('MMM-PhotoSlideshow started.');
		this.sendSocketNotification('REFRESH_ALBUM', this.config.albumPath);
	},

	getScripts: function() {
		return []; // Currently no scripts
	},

	getStyles: function() { //Always get a MIME type error when using custom css files. Disappointing
		return [];//['css/PhotoSlideshow.css'];
	},

	getDom: function() {
		const division = document.createElement('div');
		division.style.margin = '0px';
		division.style.height = '100vh'
		division.style.display = 'box';
		division.style.position = 'relative';
		if(this.album.length > 0) {
			division.style.backgroundImage = 'url("./modules/MMM-PhotoSlideshow/test.png")';
			division.style.backgroundImage = 'url("'+ encodeURI(this.config.albumPath + this.album[this.currentPhotoIndex]) +'")';
			division.style.backgroundRepeat = 'no-repeat';
			division.style.backgroundPosition = 'center center';
			division.style.backgroundSize = 'contain';

			const backButton = document.createElement('button');
			backButton.textContent = 'Previous';
			backButton.onclick = previousPhoto;
			backButton.style.position = 'absolute';
			backButton.style.bottom = '0';
			backButton.style.left = '0';
			//play: ►
			//pause: ‖
			const pauseButton = document.createElement('button');
			pauseButton.textContent = this.pauseState;
			pauseButton.onclick = pause;
			pauseButton.style.position = 'absolute';
			pauseButton.style.bottom = '0';
			pauseButton.style.left = '50%';
			const refreshButton = document.createElement('button');
			refreshButton.textContent = '↻';
			refreshButton.onclick = refresh;
			refreshButton.style.position = 'absolute';
			refreshButton.style.bottom = '0';
			refreshButton.style.right = '50%';
			const forwardButton = document.createElement('button');
			forwardButton.textContent = 'Next';
			forwardButton.onclick = nextPhoto;
			forwardButton.style.position = 'absolute';
			forwardButton.style.bottom = '0';
			forwardButton.style.right = '0';
			division.appendChild(backButton);
			division.appendChild(pauseButton);
			division.appendChild(refreshButton);
			division.appendChild(forwardButton);
		}
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
			this.pauseState = '‖';
			this.interval = setInterval(nextPhoto, this.config.cycleTime);
		}
	}
});