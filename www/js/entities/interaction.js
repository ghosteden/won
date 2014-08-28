
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
				globalVars['gamePause'] = true;
				res.obj.speedMove = false;
				resetController();
				res = false;
				var blurAll = getElement('blurall');
				blurAll.fadeIn(300);
				var textInteraction = getElement('textInteraction');
				textInteraction.children('div.text').html(lang('outOfMap'));
				if (textInteraction.css('height') == '0px') {
					textInteraction.animate({'height': '140px'}, "slow").children('div.btnCloseTextInteraction').delay('1000').animate({'top':'-25','height': '25px'}, "slow").animate({'height': '55px'}, "fast").animate({'top':'-10'}, "slow");
				}
			}
		}
		if(this.interactionLanched){
			this.tempo++;
			if(this.tempo >= 200){
				this.tempo = 0;
				this.interactionLanched = false;
			}
		}
	}

});
function closeTextInteraction(){
	getElement('textInteraction').animate({'height':'0px'},function(){this.remove();globalVars['gamePause'] = false;getElement('blurall').remove()});
}