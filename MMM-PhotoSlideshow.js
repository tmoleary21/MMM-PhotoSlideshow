Module.register("MMM-PhotoSlideshow", {

	defaults: {
		albumPath: "./",
		cycleTime: 5000, //Default 5 seconds per picture
		animationTime: 500 //Default half second animation
	},

	album: [], //array containing names of the files in the albumPath directory
	currentPhotoIndex: 0,

	nextPhoto: function() {
		this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.album.length;
		this.updateDom(this.config.animationTime);
	},

	previousPhoto: function() {
		this.currentPhotoIndex = (this.currentPhotoIndex - 1) % this.album.length;
		this.updateDom(this.config.animationTime);
	},

	start: function() {
		//Keep in mind the dom object has not been created yet as of this function
		this.sendSocketNotification('REFRESH_ALBUM', this);
	},

	getScripts: function() {
		return []; //No additional scripts as of yet
	},

	getStyles: function() {
		return []; //No styles as of yet. Maybe later
	},

	getDom: function() {
		//Might need to be a div to work correctly. Not sure yet
		const img = document.createElement('img');
		img.src = this.config.albumPath + this.album[this.currentPhotoIndex];
		return img;
	},

	notificationReceived: function(notification, payload, sender){
		if(notification === 'DOM_OBJECTS_CREATED'){ //Received when all dom objects from all modules are loaded
			setInterval(this.nextPhoto, this.config.cycleTime);
		}
	},

	socketNotificationReceived: function(notification, payload) {

	}
});