function nextPhoto() {
	const modules = MM.getModules();
	Log.log(modules)
	for(let i = 0; i < modules.length; i++){
		Log.log(modules[i]);
		Log.log(modules[i].config);
	}
}

function previousPhoto() {

}

function refresh() {

}

Module.register("MMM-PhotoSlideshow", {

	defaults: {
		albumPath: "./",
		cycleTime: 5000, //Default 5 seconds per picture
		animationTime: 500 //Default half second animation
	},

	album: [], //array containing names of the files in the directory pointed to by album path
	currentPhotoIndex: 0,

	nextPhoto: function() {
		this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.album.length;
		this.updateDom(this.config.animationTime);
	},

	previousPhoto: function() {
		this.currentPhotoIndex = (this.currentPhotoIndex - 1) % this.album.length;
		this.updateDom(this.config.animationTime);
	},

	refresh: function() {
		this.sendSocketNotification('REFRESH_ALBUM', this.config.albumPath);
	},

	start: function() {
		//Keep in mind the dom object has not been created yet as of this function
		Log.log('MMM-PhotoSlideshow started.');
		this.sendSocketNotification('REFRESH_ALBUM', this.config.albumPath);
	},

	getScripts: function() {
		return []; //No additional scripts as of yet
	},

	getStyles: function() {
		return [this.file('css/PhotoSlideshow.css')];
	},

	getDom: function() {
		const division = document.createElement('div');
		division.class = 'PhotoSldshw';
		const img = document.createElement('img');
		img.src = this.config.albumPath + this.album[this.currentPhotoIndex]; // TODO: This probably needs to be a fetch
		Log.log('Current Photo: ' + img.src);
		const forwardButton = document.createElement('button');
		forwardButton.name = 'Next';
		forwardButton.class = 'forward';
		forwardButton.textContent = 'Next';
		forwardButton.onclick = this.nextPhoto; //Might need an outside function instead of the method
		const backButton = document.createElement('button');
		backButton.name = 'Previous';
		backButton.class = 'back';
		backButton.textContent = 'Previous';
		backButton.onclick = this.previousPhoto;
		const refreshButton = document.createElement('button');
		refreshButton.name = 'refresh';
		refreshButton.class = 'refresh';
		refreshButton.textContent = '↻';
		refreshButton.onclick = this.refresh
		division.appendChild(img);
		division.appendChild(forwardButton);
		division.appendChild(backButton);
		division.appendChild(refreshButton);
		return division;
	},

	notificationReceived: function(notification, payload, sender){
		if(notification === 'DOM_OBJECTS_CREATED'){ //Received when all dom objects from all modules are loaded
			setInterval(nextPhoto, this.config.cycleTime);
		}
	},

	socketNotificationReceived: function(notification, payload) {
		Log.log('Notification receieved from node_helper');
		if(notification === 'NEW_ALBUM'){
			Log.log('NEW_ALBUM notification received');
			Log.log(payload);
			this.album = Array.from(payload);
			Log.log('Album set!\n' + this.album);
			this.updateDom();
		}
	}
});