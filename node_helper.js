const fs = require("fs");
var NodeHelper = require("node_helper");
module.exports = NodeHelper.create({

	getUpdatedAlbum: function(path) {
		let files = fs.readdirSync(path);
		files = files.filter(function(value, index, arr){
			return value.indexOf('.') !== -1 && ['jpg', 'jpeg', 'png', 'gif'].indexOf(value.split('.')[1].toLowerCase()) !== -1;
		});
		this.sendSocketNotification("NEW_ALBUM", files);
		console.log('MMM-PhotoSlideshow node_helper:  ' + files);
	},

	socketNotificationReceived: function(notification, payload) {
		if(notification === 'REFRESH_ALBUM'){
			this.getUpdatedAlbum(payload);
		}
	}
});