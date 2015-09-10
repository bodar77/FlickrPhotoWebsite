var cb = cb || {};

cb.View = function() {
	this.title = document.getElementsByClassName('article-title')[0],
	this.description = document.getElementsByClassName('article-description')[0];
	this.init();
}

cb.View.prototype = {
	init: function() {
		this.loadMenu();
		this.loadImages();
	},
	
	loadMenu: function() {
		cb.menu = new cb.Menu();
	},
	
	loadImages:function() {
		var _this = this;
		$(document).on('menuAvailiable', function(e) {
			cb.imgmanager.loadCategoryImages(e.menuData.id, function() {
				_this.updateTitleDescription(e.menuData.title, e.menuData.description)
			});
		});
	},
	
	updateTitleDescription(title, description) {
		this.title.innerHTML = title;
		this.description.innerHTML = description;
	}
}