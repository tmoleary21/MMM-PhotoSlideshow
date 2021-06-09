fs = require(fs);
const NodeHelper = require("node_helper");
module.exports = NodeHelper.create({
	// Options:
	// 1)** Have a function that creates a list of the photos in the album and send that to the core module file
	// 2) Function that returns the next picture (keeping track of current array location) and sends that to the
	//    core module file each time the picture changes

	getUpdatedAlbum: async function(path) {
		let album;
		await fs.readdir(path, function(err, files){
			if(err){
				//error handling
			}
			album = files.filter(function(value, index, arr){
				return value.indexOf('.') !== -1;
			});
		});
		return album;
	},



	socketNotificationReceived: function(notification, payload) {
		if(notification === 'REFRESH_ALBUM'){
			payload.album = getUpdatedAlbum(payload.config.albumPath);
		}
	}
});