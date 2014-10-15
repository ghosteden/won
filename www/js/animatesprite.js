(function($) {
	$.fn.animateSprite = function(action, animation) {
		var obj = $(this);
		animation = animation | null;
		var idElem = 'sprite';
		if (obj.attr('id') != '') {
			idElem += '-' + obj.attr('id');
		}
		if (obj.attr('class') != '') {
			idElem += '-' + obj.attr('class');
		}
		if (typeof action == 'object') {
			//check otion
			action.src = action.src || null;
			if (action.src == null)
				return false;

			action.anims = action.anims || null;
			if (action.anims == null)
				return false;

			action.sw = action.sw || 0;
			action.sh = action.sh || 0;
			action.nbc = action.nbc || 1;
			action.nbl = action.nbl || 1;
			action.fps = action.fps || 25;

			// creat element for sprite wrapper
			var elem = '<div id="' + idElem + '"></div>'
			obj.append(elem);
			elem = $('#' + idElem);
			if (obj.css('position') != 'absolute' && obj.css('position') != 'relative') {
				obj.css('position', 'relative');
			}
			var ratio = 0;
			if (obj.width() < obj.height()) {
				ratio = obj.width() / action.sw;
				action.sw = obj.width();
				action.sh = action.sh * ratio;
				if (action.sh > obj.height()) {
					ratio = obj.height() / action.sh;
					action.sh = obj.height();
					action.sw = action.sw * ratio;
				}
			} else {
				ratio = obj.height() / action.sh;
				action.sh = obj.height();
				action.sw = action.sw * ratio;
				if (action.sh < obj.height()) {
					ratio = obj.width() / action.sw;
					action.sw = obj.width();
					action.sh = action.sh * ratio;
				}
			}
			elem.css({
				'position': 'absolute',
				'top': 0,
				'left': 0,
				'overflow': 'hidden',
				'width': action.sw + 'px',
				'height': action.sh + 'px',
				'background': '#0d0',
			});
			var img = '<img class="spriteSheet" src="' + action.src + '" style="position:absolute;top:0;left:0;width:' + action.nbc * action.sw + 'px;height;' + action.nbl * action.sh + 'px"/>';
			elem.append(img);
			for (var anim in action.anims) {
				if ($.isArray(action.anims[anim])) {
					elem.attr('data-anims', JSON.stringify(action.anims));
					elem.attr('data-anim', anim);
					elem.attr('data-fps', action.fps);
					elem.attr('data-frame', action.anims[anim][0]);
					obj.animateSprite('play', anim);
					break;
				}
			}
			if (action.redim) {
				$(window).resize(function() {
					elem.attr('data-play', 0);
					if (obj.width() != elem.width() && obj.height() != elem.height()) {
						if (obj.width() < obj.height()) {
							ratio = obj.width() / action.sw;
							action.sw = obj.width();
							action.sh = action.sh * ratio;
							if (action.sh > obj.height()) {
								ratio = obj.height() / action.sh;
								action.sh = obj.height();
								action.sw = action.sw * ratio;
							}
						} else {
							ratio = obj.height() / action.sh;
							action.sh = obj.height();
							action.sw = action.sw * ratio;
							if (action.sh < obj.height()) {
								ratio = obj.width() / action.sw;
								action.sw = obj.width();
								action.sh = action.sh * ratio;
							}
						}
						elem.css({
							'position': 'absolute',
							'top': 0,
							'left': 0,
							'overflow': 'hidden',
							'width': action.sw + 'px',
							'height': action.sh + 'px',
							'background': '#0d0',
						});
						elem.children('img.spriteSheet').css({
							'width': action.nbc * action.sw + 'px',
							'height': action.nbl * action.sh + 'px',
						});
						var frame = parseInt(elem.attr('data-frame'));
						var nbCol = parseInt(elem.children('img.spriteSheet').width() / elem.width());
						var line = parseInt(frame / nbCol);
						var col = parseInt(frame % nbCol);
						var anims = JSON.parse(elem.attr('data-anims'));
						var anim = elem.attr('data-anim');
						var left = elem.width() * col * -1;
						var top = elem.width() * line * -1;
						elem.children('img.spriteSheet').css({
							'top': top + 'px',
							'left': left + 'px',
						})
					}
					elem.attr('data-play', 1);
				});
			}
			return false;
		}
		else if (typeof action == 'string') {
			switch (action) {
				case 'play':
					elem = $('#' + idElem);
					elem.attr('data-play', 1);
					break;
				case 'stop':
					elem = $('#' + idElem);
					elem.attr('data-play', 0);
					break;
				case 'setFrame':
					elem = $('#' + idElem);
					elem.attr('data-frame', animation);
					break;
				default :
					return false;
					break;
			}
			if (elem.attr('data-play') == 1) {
				var frame = parseInt(elem.attr('data-frame'));
				var nbCol = parseInt(elem.children('img.spriteSheet').width() / elem.width());
				var line = parseInt(frame / nbCol);
				var col = parseInt(frame % nbCol);
				var anims = JSON.parse(elem.attr('data-anims'));
				var anim = elem.attr('data-anim');
				var left = elem.width() * col * -1;
				var top = elem.width() * line * -1;
				elem.children('img.spriteSheet').css({
					'top': top + 'px',
					'left': left + 'px',
				})
				frame = frame + 1;
				if (anims[anim][frame] == undefined) {
					frame = 0;
				}
				elem.attr('data-frame', frame);
				obj.timer = setTimeout(function() {
					obj.animateSpriteSetFrame();
				}, 1000 / elem.attr('data-fps'));
			}
		} else {
			return false;
		}
	};
})(jQuery);
(function($) {
	$.fn.animateSpriteSetFrame = function() {
		var obj = $(this);
		var idElem = 'sprite';
		if (obj.attr('id') != '') {
			idElem += '-' + obj.attr('id');
		}
		if (obj.attr('class') != '') {
			idElem += '-' + obj.attr('class');
		}
		var elem = $('#' + idElem);
		obj.animateSprite('setFrame', elem.attr('data-frame'));
	};
})(jQuery);