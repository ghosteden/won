
game.InteractionEntity = me.ObjectEntity.extend({
	"action": null,
	"interactionLanched": false,
	"tempo": 0,
	init: function(x, y, settings) {
		this.action = settings.action;
		this.parent(x, y, settings);
	},
	update: function() {
		// check for collision
		var res = me.game.collide(this);
		if (res && res.obj.name == "player" && !this.interactionLanched) {
			this.interactionLanched = true;
			if (this.action == 'oom') {
				// le personnage est sorti de la carte par un accès interdit
				res.obj.speedMove = false;
				res = false;
				resetController();
				openTextInteraction(lang('outOfMap'), 'Close');
			}
		}
		if (this.interactionLanched) {
			this.tempo++;
			if (this.tempo >= 200) {
				this.tempo = 0;
				this.interactionLanched = false;
			}
		}
	}

});

function openTextInteraction($text, $btn) {
	globalVars['gamePause'] = true;
	var blurAll = getElement('blurall');
	blurAll.fadeIn(300);
	var textInteraction = getElement('textInteraction');
	$('#textInteraction div.text').html($text);
	if (textInteraction.children('div.container').css('bottom') < '-2px') {
		$('#textInteraction .btn' + $btn + 'TextInteraction').show();
		textInteraction.children('div.container').animate({'bottom': '20px'}, '400', function() {
			$(this).animate({'bottom': '-2px'},150, function() {
				$(this).children('div.btn-box').animate({'right': '0px'}, 150);
			});
		});
	}
}

function closeTextInteraction() {
	getElement('textInteraction').children('div.container').animate({'bottom': '20px'}, 100, function() {
		$(this).animate({'bottom': '-200px'}, 300, function() {
			getElement('textInteraction').remove();
			globalVars['gamePause'] = false;
			getElement('blurall').fadeOut('slow').remove()
		});
	})
}