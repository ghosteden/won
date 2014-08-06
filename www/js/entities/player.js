game.PlayerEntity = game.HumanEntity.extend({
     "init" : function (x, y, settings) {
        this.parent(x, y, settings);

        // Reference from the global namespace
        game.Player = this;
        me.save.player = "perso"+globalVars['usePerso'];
		
        
        //chargement des animations
		var nbrWaitAnim = []
		for( $move in globalVars['shema-perso'+globalVars['usePerso']] ){
			this.renderable.addAnimation($move, globalVars['shema-perso'+globalVars['usePerso']][$move]);
			//if(nbrWaitAnim[''])
		}
        
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        
    },
     update: function() {
        if (me.input.isKeyPressed('X0')) {
            this.speedMove = "normal";
            this.angleMove = 'X0';
        }
        else if (me.input.isKeyPressed('XM22')) {
            this.speedMove = "normal";
            this.angleMove = 'XM22';
        }
        else if (me.input.isKeyPressed('XM45')) {
            this.speedMove = "normal";
            this.angleMove = 'XM45';
        }
        else if (me.input.isKeyPressed('XM67')) {
            this.speedMove = "normal";
            this.angleMove = 'XM67';
        }
        else if (me.input.isKeyPressed('XM90')) {
            this.speedMove = "normal";
            this.angleMove = 'XM90';
        }
        else if (me.input.isKeyPressed('XM112')) {
            this.speedMove = "normal";
            this.angleMove = 'XM112';
        }
        else if (me.input.isKeyPressed('XM135')) {
            this.speedMove = "normal";
            this.angleMove = 'XM135';
        }
        else if (me.input.isKeyPressed('XM157')) {
            this.speedMove = "normal";
            this.angleMove = 'XM157';
        }
        else if (me.input.isKeyPressed('X180')) {
            this.speedMove = "normal";
            this.angleMove = 'X180';
        }
        else if (me.input.isKeyPressed('X22')) {
            this.speedMove = "normal";
            this.angleMove = 'X22';
        }
        else if (me.input.isKeyPressed('X45')) {
            this.speedMove = "normal";
            this.angleMove = 'X45';
        }
        else if (me.input.isKeyPressed('X67')) {
            this.speedMove = "normal";
            this.angleMove = 'X67';
        }
        else if (me.input.isKeyPressed('X90')) {
            this.speedMove = "normal";
            this.angleMove = 'X90';
        }
        else if (me.input.isKeyPressed('X112')) {
            this.speedMove = "normal";
            this.angleMove = 'X112';
        }
        else if (me.input.isKeyPressed('X135')) {
            this.speedMove = "normal";
            this.angleMove = 'X135';
        }
        else if (me.input.isKeyPressed('X157')) {
            this.speedMove = "normal";
            this.angleMove = 'X157';
        }
        // No move
        else {
            this.speedMove = false;
        }
 
        // check & update player movement
        return this.parent();
    }
});