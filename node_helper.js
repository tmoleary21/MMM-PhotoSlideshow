const fs = require("fs");
var NodeHelper = require("node_helper");
module.exports = NodeHelper.create({

	getUpdatedAlbum: function(path) {
		let files = fs.readdirSync(path);
		files = files.filter(function(value, index, arr){
			return value.includes('.') && ['jpg', 'jpeg', 'png', 'gif'].includes(value.split('.')[1].toLowerCase());
		});
		this.sendSocketNotification("NEW_ALBUM", files);
	},

	socketNotificationReceived: function(notification, payload) {
		if(notification === 'REFRESH_ALBUM'){
			this.getUpdatedAlbum(payload);
		}
	}
});