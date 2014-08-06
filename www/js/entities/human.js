game.HumanEntity = me.ObjectEntity.extend({
	/* -----
	 
	 constructor
	 
	 ------ */
	init: function(x, y, settings) {
		// call the constructor

		if (typeof (settings.spriteheight) == "undefined")
			settings.spriteheight = "120";

		if (typeof (settings.spritewidth) == "undefined")
			settings.spritewidth = "120";

		settings.image = "sprites-perso" + globalVars['usePerso'];

		this.parent(x, y, settings);

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(8, 8);
		this.setMaxVelocity(20, 20);

		// adjust the bounding box
		this.updateColRect(40, 40, 60, 50);

		// Physique
		this.gravity = 0;
		this.normal = 8;
		this.speed = 8;
		this.oldAngleMove = this.angleMove = 'X90';
		this.speedMove = false;


		this.renderable.addAnimation('X0', [0]);
		this.renderable.addAnimation('XM22', [0]);
		this.renderable.addAnimation('XM45', [0]);
		this.renderable.addAnimation('XM67', [0]);
		this.renderable.addAnimation('XM90', [0]);
		this.renderable.addAnimation('XM112', [0]);
		this.renderable.addAnimation('XM135', [0]);
		this.renderable.addAnimation('XM157', [0]);
		this.renderable.addAnimation('X180', [0]);
		this.renderable.addAnimation('X180S', [0]);
		this.renderable.addAnimation('X22', [0]);
		this.renderable.addAnimation('X45', [0]);
		this.renderable.addAnimation('X67', [0]);
		this.renderable.addAnimation('X90', [0]);
		this.renderable.addAnimation('X112', [0]);
		this.renderable.addAnimation('X135', [0]);
		this.renderable.addAnimation('X157', [0]);
		this.renderable.addAnimation('X0W', [0]);
		this.renderable.addAnimation('XM22W', [0]);
		this.renderable.addAnimation('XM45W', [0]);
		this.renderable.addAnimation('XM67W', [0]);
		this.renderable.addAnimation('XM90W', [0]);
		this.renderable.addAnimation('XM112W', [0]);
		this.renderable.addAnimation('XM135W', [0]);
		this.renderable.addAnimation('XM157W', [0]);
		this.renderable.addAnimation('X180W', [0]);
		this.renderable.addAnimation('X22W', [0]);
		this.renderable.addAnimation('X45W', [0]);
		this.renderable.addAnimation('X67W', [0]);
		this.renderable.addAnimation('X90W', [0]);
		this.renderable.addAnimation('X112W', [0]);
		this.renderable.addAnimation('X135W', [0]);
		this.renderable.addAnimation('X157W', [0]);


		// Permet de repérer le click sur l'object
//        me.input.registerPointerEvent('mousedown',this.collisionBox,this.onMouseDown.bind());
//    },
//    onMouseDown: function() {
//      alert('t'); 

	},
	/* -----
	 
	 update the player pos
	 
	 ------ */
	update: function() {
		var res = me.game.collide(this);
		this.flipX(false);
		if (this.speedMove !== false) {
			// Choise animate sprites
			if (this.renderable.getCurrentAnimationName().indexOf('W') > 0 && this.renderable.existAnimationName(this.angleMove + "S")) {
				//on change d'angle et on été sur un position d'arret
				this.renderable.setCurrentAnimation(this.angleMove);
				this.renderable.setAnimationFrame(0);
				this.renderable.setCurrentAnimation(this.angleMove + "S", this.angleMove);
				this.renderable.setAnimationFrame(0);
			}
			else if (!this.renderable.isCurrentAnimation(this.angleMove)) {
				var newframe = this.renderable.getCurrentAnimationFrame() + 1;
				this.renderable.setCurrentAnimation(this.angleMove);
				this.renderable.setAnimationFrame(newframe);
				this.oldAngleMove = this.angleMove;
			}
			if (this.angleMove == 'X0') {
				// move velocity
				this.vel.x = me.timer.tick;
				this.vel.y = 0;
			}
			else if (this.angleMove == 'XM22') {
				this.vel.x = me.timer.tick;
				this.vel.y = me.timer.tick / -2;
			}
			else if (this.angleMove == 'XM45') {
				this.vel.x = me.timer.tick / 1.5;
				this.vel.y = me.timer.tick / -1.5;
			}
			else if (this.angleMove == 'XM67') {
				this.vel.x = me.timer.tick / 2;
				this.vel.y = me.timer.tick * -1;
			}
			else if (this.angleMove == 'XM90') {
				this.vel.x = 0;
				this.vel.y = me.timer.tick * -1;
			}
			else if (this.angleMove == 'XM112') {
				this.vel.x = me.timer.tick / -2;
				this.vel.y = me.timer.tick * -1;
			}
			else if (this.angleMove == 'XM135') {
				this.vel.x = me.timer.tick / -1.5;
				this.vel.y = me.timer.tick / -1.5;
			}
			else if (this.angleMove == 'XM157') {
				this.vel.x = me.timer.tick * -1;
				this.vel.y = me.timer.tick / -2;
			}
			else if (this.angleMove == 'X180') {
				this.vel.x = me.timer.tick * -1;
				this.vel.y = 0;
			}
			else if (this.angleMove == 'X22') {
				this.vel.x = me.timer.tick;
				this.vel.y = me.timer.tick / 2;
			}
			else if (this.angleMove == 'X45') {
				this.vel.x = me.timer.tick / 1.5;
				this.vel.y = me.timer.tick / 1.5;
			}
			else if (this.angleMove == 'X67') {
				this.vel.x = me.timer.tick / 2;
				this.vel.y = me.timer.tick;
			}
			else if (this.angleMove == 'X90') {
				this.vel.x = 0;
				this.vel.y = me.timer.tick;
			}
			else if (this.angleMove == 'X112') {
				this.vel.x = me.timer.tick / -2;
				this.vel.y = me.timer.tick;
			}
			else if (this.angleMove == 'X135') {
				this.vel.x = me.timer.tick / -1.5;
				this.vel.y = me.timer.tick / 1.5;
			}
			else if (this.angleMove == 'X157') {
				this.vel.x = me.timer.tick * -1;
				this.vel.y = me.timer.tick / 2;
			}

			// speed sprite animate
			this.renderable.current.animationspeed = this.normal;
			// speed move
			this.vel.x = this.speed * this.vel.x;
			this.vel.y = this.speed * this.vel.y;
		}
		// No move
		else {
			this.vel.x = 0;
			this.vel.y = 0;
			// Si position d'arret alors on met l'animation qui correspond au dernier angle de mouvement
			if (this.angleMove.indexOf('W') == -1 && this.renderable.existAnimationName(this.angleMove + "W")) {
				this.angleMove = this.angleMove + 'W';
			}
			if (!this.renderable.isCurrentAnimation(this.angleMove)) {
				this.renderable.setCurrentAnimation(this.angleMove, function() {
					//possibilité de position d'attente aléatoire
				});
			}
		}

		// check & update player movement
		this.updateMovement();
		this.parent();
		return true;
	}

});