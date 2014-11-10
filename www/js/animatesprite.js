(function($) {
	$.fn.animateSprite = function(action, animation) {
		var obj = $(this);
		animation = animation || null;
		var idElem = 'sprite';
		if (obj.attr('id') != undefined && obj.attr('id') != '') {
			idElem += '-' + obj.attr('id');
		}
		if (obj.attr('class') != undefined && obj.attr('class') != '') {
			idElem += '-' + obj.attr('class');
		}

		if (typeof action == 'object') {
			//check otion
			action.src = action.src || null;
			if (action.src == null) {
				console.log('src is undefined');
				return false;
			}

			action.anims = action.anims || null;
			if (action.anims == null) {
				console.log('anims is undefined');
				return false;
			}

			action.sw = action.sw || 0;
			action.sh = action.sh || 0;
			action.nbc = action.nbc || 1;
			action.nbl = action.nbl || 1;
			action.fps = action.fps || 25;

			// creat element for sprite wrapper
			var elem = '<div class="' + idElem + '"></div>'
			obj.append(elem);
			elem = $('.' + idElem);
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
			});
			var img = '<img class="spriteSheet" src="' + action.src + '" style="position:absolute;top:0;left:0;width:' + action.nbc * action.sw + 'px;height;' + action.nbl * action.sh + 'px"/>';
			elem.append(img);
			//var_dump(action.anims);
			for (var anim in action.anims) {
				if (typeof action.anims[anim] == "string" && action.anims[anim].indexOf('-')) {
					var start = action.anims[anim].substr('0', action.anims[anim].indexOf('-'));
					var stop = action.anims[anim].substr(action.anims[anim].indexOf('-') + 1, action.anims[anim].length);
					action.anims[anim] = [];
					for (var i = start; i <= stop; i++) {
						action.anims[anim].push(i);
					}
				}
				if ($.isArray(action.anims[anim])) {
					elem.attr('data-anims', JSON.stringify(action.anims).replace(/"/g, "'"));
					elem.attr('data-anim', anim);
					elem.attr('data-fps', action.fps);
					elem.attr('data-frame', action.anims[anim][0]);
					elem.attr('data-width', elem.parent().width());
					elem.attr('data-height', elem.parent().height());
					elem.attr('data-sw', action.sw);
					elem.attr('data-sh', action.sh);
					elem.attr('data-nbc', action.nbc);
					elem.attr('data-nbl', action.nbl);
					obj.animateSprite('play', anim);

					if (action.redim) {
						elem.attr('data-redim', "1");
					}
					break;
				}
			}
			return false;
		}
		else if (typeof action == 'string') {
			elem = $('.' + idElem);
			var anims = JSON.parse(elem.attr('data-anims').replace(/'/g, '"'));
			switch (action) {
				case 'play':
					if (elem.attr('data-timer') != undefined) {
						clearTimeout(elem.attr('data-timer'));
					}
					elem.attr('data-anim', animation);
					elem.attr('data-frame', 0);
					elem.attr('data-play', 1);
					break;
				case 'stop':
					elem.attr('data-play', 0);
					break;
				case 'setFrame':
					elem.attr('data-frame', animation);
					break;
				default :
					console.log('no action defined')
					return false;
					break;
			}
			if (elem.attr('data-play') == 1) {
				var frame = parseInt(elem.attr('data-frame'));
				var anim = elem.attr('data-anim');
				var position = anims[anim][frame];
				var nbCol = parseInt(elem.children('img.spriteSheet').width() / elem.width());
				var line = parseInt(position / nbCol);
				var col = parseInt(position % nbCol);
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
				elem.attr('data-timer', setTimeout(function() {
					obj.animateSpriteSetFrame();
				}, 1000 / elem.attr('data-fps')));
			}
		} else {
			console.log('no action defined')
			return false;
		}
	};
})(jQuery);
(function($) {
	$.fn.animateSpriteSetFrame = function() {
		var obj = $(this);
		var idElem = 'sprite';
		if (obj.attr('id') != undefined && obj.attr('id') != '') {
			idElem += '-' + obj.attr('id');
		}
		if (obj.attr('class') != undefined && obj.attr('class') != '') {
			idElem += '-' + obj.attr('class');
		}
		var elem = $('.' + idElem);
		obj.animateSprite('setFrame', elem.attr('data-frame'));
			// resize l'element
		if (elem.attr('data-width') != elem.parent().width() && elem.attr('data-redim')) {
			elem.attr('data-width', elem.parent().width());

			restart = false;
			if (elem.attr('data-play') == 1) {
				elem.attr('data-play', 0);
				restart = true;
			}
			if (obj.width() != elem.width() && obj.height() != elem.height()) {
				action = {
					sw: elem.attr('data-sw'),
					sh: elem.attr('data-sh'),
					nbc: elem.attr('data-nbc'),
					nbl: elem.attr('data-nbl'),
				};
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
				});
				elem.children('img.spriteSheet').css({
					'width': action.nbc * action.sw + 'px',
					'height': action.nbl * action.sh + 'px',
				});
				var frame = parseInt(elem.attr('data-frame'));
				var nbCol = parseInt(elem.children('img.spriteSheet').width() / elem.width());
				var line = parseInt(frame / nbCol);
				var col = parseInt(frame % nbCol);
				var left = elem.width() * col * -1;
				var top = elem.width() * line * -1;
				elem.children('img.spriteSheet').css({
					'top': top + 'px',
					'left': left + 'px',
				})
			}
			if (restart) {
				elem.attr('data-play', 1);
			}
		}
	};
})(jQuery);