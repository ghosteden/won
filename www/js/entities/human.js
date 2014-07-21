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
        this.angleMove = 'X90';
        this.speedMove = false;


        this.renderable.addAnimation('X0', [0]);
        this.renderable.addAnimation('X0S', [0]);
        this.renderable.addAnimation('XM22', [0]);
        this.renderable.addAnimation('XM45', [0]);
        this.renderable.addAnimation('XM67', [0]);
        this.renderable.addAnimation('XM90', [900]);
        this.renderable.addAnimation('XM112', [0]);
        this.renderable.addAnimation('XM135', [0]);
        this.renderable.addAnimation('XM157', [0]);
        this.renderable.addAnimation('X180', [1600]);
        this.renderable.addAnimation('X180S', [0]);
        this.renderable.addAnimation('X22', [0]);
        this.renderable.addAnimation('X45', [0]);
        this.renderable.addAnimation('X67', [0]);
        this.renderable.addAnimation('X90', [1200]);
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
        this.renderable.addAnimation('X180W', [1600]);
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
            if (this.angleMove == 'X0') {
                // Choise animate sprites
                if (!this.renderable.isCurrentAnimation("X0") && !this.renderable.isCurrentAnimation("X0S")) {
                    this.renderable.setCurrentAnimation("X0");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("X0S", "X0");
                    this.renderable.setAnimationFrame(0);
                }
                // move velocity
                this.vel.x = me.timer.tick;
                this.vel.y = 0;
            }
            else if (this.angleMove == 'XM22') {
                if (!this.renderable.isCurrentAnimation("XM22") && !this.renderable.isCurrentAnimation("XM22S")) {
                    this.renderable.setCurrentAnimation("XM22");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("XM22S", "XM22");
                    this.renderable.setAnimationFrame(0);
                }
                this.vel.x = me.timer.tick;
                this.vel.y = me.timer.tick / -2;
            }
            else if (this.angleMove == 'XM45') {
                if (!this.renderable.isCurrentAnimation("XM45") && !this.renderable.isCurrentAnimation("XM45S")) {
                    this.renderable.setCurrentAnimation("XM45");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("XM45S", "XM45");
                    this.renderable.setAnimationFrame(0);
                }
                this.vel.x = me.timer.tick / 1.5;
                this.vel.y = me.timer.tick / -1.5;
            }
            else if (this.angleMove == 'XM67') {
                if (!this.renderable.isCurrentAnimation("XM67") && !this.renderable.isCurrentAnimation("XM67S")) {
                    this.renderable.setCurrentAnimation("XM67");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("XM67S", "XM67");
                    this.renderable.setAnimationFrame(0);
                }
                this.vel.x = me.timer.tick / 2;
                this.vel.y = me.timer.tick * -1;
            }
            else if (this.angleMove == 'XM90') {
                if (!this.renderable.isCurrentAnimation("XM90") && !this.renderable.isCurrentAnimation("XM90S")) {
                    this.renderable.setCurrentAnimation("XM90");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("XM90S", "XM90");
                    this.renderable.setAnimationFrame(0);
                }
                this.vel.x = 0;
                this.vel.y = me.timer.tick * -1;
            }
            else if (this.angleMove == 'XM112') {
                if (!this.renderable.isCurrentAnimation("XM112") && !this.renderable.isCurrentAnimation("XM112S")) {
                    this.renderable.setCurrentAnimation("XM112");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("XM112S", "XM112");
                    this.renderable.setAnimationFrame(0);
                }
                this.vel.x = me.timer.tick / -2;
                this.vel.y = me.timer.tick * -1;
            }
            else if (this.angleMove == 'XM135') {
                if (!this.renderable.isCurrentAnimation("XM135") && !this.renderable.isCurrentAnimation("XM135S")) {
                    this.renderable.setCurrentAnimation("XM135");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("XM135S", "XM135");
                    this.renderable.setAnimationFrame(0);
                }
                this.vel.x = me.timer.tick / -1.5;
                this.vel.y = me.timer.tick / -1.5;
            }
            else if (this.angleMove == 'XM157') {
                if (!this.renderable.isCurrentAnimation("XM157") && !this.renderable.isCurrentAnimation("XM157S")) {
                    this.renderable.setCurrentAnimation("XM157");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("XM157S", "XM157");
                    this.renderable.setAnimationFrame(0);
                }
                this.vel.x = me.timer.tick * -1;
                this.vel.y = me.timer.tick / -2;
            }
            else if (this.angleMove == 'X180') {
                if (!this.renderable.isCurrentAnimation("X180") && !this.renderable.isCurrentAnimation("X180S")) {
                    this.renderable.setCurrentAnimation("X180");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("X180S", "X180");
                    this.renderable.setAnimationFrame(0);
                }
                this.vel.x = me.timer.tick * -1;
                this.vel.y = 0;
            }
            else if (this.angleMove == 'X22') {
                if (!this.renderable.isCurrentAnimation("X22") && !this.renderable.isCurrentAnimation("X22S")) {
                    this.renderable.setCurrentAnimation("X22");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("X22S", "X22");
                    this.renderable.setAnimationFrame(0);
                }
                this.vel.x = me.timer.tick;
                this.vel.y = me.timer.tick / 2;
            }
            else if (this.angleMove == 'X45') {
                if (!this.renderable.isCurrentAnimation("X45") && !this.renderable.isCurrentAnimation("X45S")) {
                    this.renderable.setCurrentAnimation("X45");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("X45S", "X45");
                    this.renderable.setAnimationFrame(0);
                }
                this.vel.x = me.timer.tick / 1.5;
                this.vel.y = me.timer.tick / 1.5;
            }
            else if (this.angleMove == 'X67') {
                if (!this.renderable.isCurrentAnimation("X67") && !this.renderable.isCurrentAnimation("X67S")) {
                    this.renderable.setCurrentAnimation("X67");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("X67S", "X67");
                    this.renderable.setAnimationFrame(0);
                }
                this.vel.x = me.timer.tick / 2;
                this.vel.y = me.timer.tick;
            }
            else if (this.angleMove == 'X90') {
                if (!this.renderable.isCurrentAnimation("X90") && !this.renderable.isCurrentAnimation("X90S")) {
                    this.renderable.setCurrentAnimation("X90");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("X90S", "X90");
                    this.renderable.setAnimationFrame(0);
                }
                this.vel.x = 0;
                this.vel.y = me.timer.tick;
            }
            else if (this.angleMove == 'X112') {
                if (!this.renderable.isCurrentAnimation("X112") && !this.renderable.isCurrentAnimation("X112S")) {
                    this.renderable.setCurrentAnimation("X112");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("X112S", "X112");
                    this.renderable.setAnimationFrame(0);
                }
                this.vel.x = me.timer.tick / -2;
                this.vel.y = me.timer.tick;
            }
            else if (this.angleMove == 'X135') {
                if (!this.renderable.isCurrentAnimation("X135") && !this.renderable.isCurrentAnimation("X135S")) {
                    this.renderable.setCurrentAnimation("X135");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("X135S", "X135");
                    this.renderable.setAnimationFrame(0);
                }
                this.vel.x = me.timer.tick / -1.5;
                this.vel.y = me.timer.tick / 1.5;
            }
            else if (this.angleMove == 'X157') {
                if (!this.renderable.isCurrentAnimation("X157") && !this.renderable.isCurrentAnimation("X157S")) {
                    this.renderable.setCurrentAnimation("X157");
                    this.renderable.setAnimationFrame(0);
                    this.renderable.setCurrentAnimation("X157S", "X157");
                    this.renderable.setAnimationFrame(0);
                }
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
        }

        // check & update player movement
        this.updateMovement();
        // update animation if necessary
        if (this.vel.x != 0 || this.vel.y != 0) {
            // update object animation
            this.parent();
            return true;
        } else {
            // Si position d'arret alors on met l'animation qui correspond au dernier angle de mouvement
            switch (this.angleMove) {
                case "XM112":
                    if (!this.renderable.isCurrentAnimation("XM67W")) {
                        this.renderable.setCurrentAnimation("XM67W");

                        return true;
                    }
                    break;

                case "XM135":
                    if (!this.renderable.isCurrentAnimation("XM45W")) {
                        this.renderable.setCurrentAnimation("XM45W");

                        return true;
                    }
                    break;

                case "XM157":
                    if (!this.renderable.isCurrentAnimation("XM22W")) {
                        this.renderable.setCurrentAnimation("XM22W");

                        return true;
                    }
                    break;

                case "X180":
                    if (!this.renderable.isCurrentAnimation("X0W")) {
                        this.renderable.setCurrentAnimation("X0W");

                        return true;
                    }
                    break;
                case "X112":
                    if (!this.renderable.isCurrentAnimation("X67W")) {
                        this.renderable.setCurrentAnimation("X67W");

                        return true;
                    }
                    break;

                case "X135":
                    if (!this.renderable.isCurrentAnimation("X45W")) {
                        this.renderable.setCurrentAnimation("X45W");

                        return true;
                    }
                    break;

                case "X157":
                    if (!this.renderable.isCurrentAnimation("X22W")) {
                        this.renderable.setCurrentAnimation("X22W");

                        return true;
                    }
                    break;
                default:
                    if (!this.renderable.isCurrentAnimation(this.angleMove + "W")) {
                        this.renderable.setCurrentAnimation(this.angleMove + "W");

                        return true;
                    }
                    break;
            }
        }
        return true;
    }

});