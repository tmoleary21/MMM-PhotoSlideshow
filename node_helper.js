const fs = require("fs");
var NodeHelper = require("node_helper");
module.exports = NodeHelper.create({
	// Options:
	// 1)** Have a function that creates a list of the photos in the album and send that to the core module file
	// 2) Function that returns the next picture (keeping track of current array location) and sends that to the
	//    core module file each time the picture changes

	getUpdatedAlbum: function(path) {
		fs.readdirSync(path, function(err, files){
			if(err){
				//error handling
			}
			this.sendSocketNotification("NEW_ALBUM", files.filter(function(value, index, arr){
				return file.indexOf('.') !== -1 && ['jpg', 'jpeg', 'png', 'gif'].indexOf(file.split('.')[1].toLowerCase()) !== -1;
			}));
		});
		Log.log('MMM-PhotoSlideshow node_helper:  ' + files);
	},

	socketNotificationReceived: function(notification, payload) {
		if(notification === 'REFRESH_ALBUM'){
			getUpdatedAlbum(payload);
		}
	}
});