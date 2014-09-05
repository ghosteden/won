game.PnjEntity = game.HumanEntity.extend({
    "combat" : false, // si on veux un combats avec le pnj mettre le niveau du combats
    "cinematic" : false, // si on veux une cinematique avec le pnj mettre le code de la cinematique (prioritaire au combats)
    "typeMove" : "nomove", // nomove, random, circle, hundredStep
    "pnjAngleMove" : null, // Obligatoire pour le hundredStep et le circle sinon on ne peut pas savoir dans quel direction il va prendre en reference les valeurs de direction
    "pnjSpeedMove" : "random", // normal, fast, random
    "durationcircle":20, // pour la largeur du cercle
    "durationStep":20, // pour la longueur des 100 pas
    "startWait" : "X0", // Position d'attente de départ
    "direction" : ["X0",'X22','X45','X67','X90','X112','X135','X157','X180','XM157','XM135','XM112','XM90','XM67','XM45','XM22'],
    "tempcircle":0,
    "tempStep":0,
    
    init : function (x, y, settings) {
        
        /* Config settings
         *  récupére les valeurs de spritewidth et spriteheight si elle ont été renseigné sinon on prend celle par default de 64x64
         *  On récupéré ensuite les valeurs perso du pnj typeMove, angleMove et speedMove
         */
        
        // position de départ aléatoire
        if(typeof(settings.randomX) != "undefined" || typeof(settings.randomY) != "undefined"){
            var i = 0;
            while(i == 0 || i < 6 && (me.game.currentLevel.getLayerByName("collision").getTile(x, y) != null || me.game.currentLevel.getLayerByName("collision").getTile((x+parseInt(settings.spritewidth)), (y+parseInt(settings.spriteheight))) != null)){
                if(typeof(settings.randomX) != "undefined"){
                    var to = me.game.currentLevel.width - me.game.currentLevel.tilewidth;
                    var from = me.game.currentLevel.tilewidth;
                    x = Math.floor(Math.random()*(to-from+1)+from);
                }
                if(typeof(settings.randomY) != "undefined"){
                    var to = me.game.currentLevel.height - me.game.currentLevel.tileheight;
                    var from = me.game.currentLevel.tileheight;
                    y = Math.floor(Math.random()*(to-from+1)+from);
                }
                i++;
                if(i>=6){
                    x = -2*parseInt(settings.spritewidth);
                    y = -2*parseInt(settings.spriteheight);
                }
            }
        }
        
        // Les valeurs perso
        if(typeof(settings.typeMove) != "undefined")
            this.typeMove = settings.typeMove;
        
        if(typeof(settings.pnjAngleMove) != "undefined")
            this.pnjAngleMove = settings.pnjAngleMove;
        
        if(typeof(settings.durationcircle) != "undefined"){
            this.durationcircle = settings.durationcircle;
            this.tempcircle = settings.durationcircle;
        }
        if(typeof(settings.durationStep) != "undefined"){
            this.durationStep = settings.durationStep;
            this.tempStep = settings.durationStep;
        }
        
        if(typeof(settings.pnjSpeedMove) != "undefined")
            this.pnjSpeedMove = settings.pnjSpeedMove;
        
        if(typeof(settings.combat) != "undefined")
            this.combat = settings.combat;
        
        if(typeof(settings.cinematic) != "undefined")
            this.cinematic = settings.cinematic;
     
        // oblogatoire pour melonjs pour fermer la config
        this.parent(x, y, settings);
        
        // Reference from the global namespace
        game.PNJ = this;        
    },
    update: function() {
        /* si c'est un pnj qui bouge
            * Il va faloir envoyer au parent les variable this.speedMove et this.angleMove
            * Cela en fonction du type de mouvement
            */
           
        // check for collision
        var res = me.game.collide(this);
        if(res && res.obj.name == "gate"){
            if(this.name == "pnj"){
                me.game.remove(this);
            }
        }
        if (res && res.obj.name == "player" && this.name == "pnj" && this.pnjSpeedMove != "pause") {
            this.savemove = this.pnjSpeedMove;
            this.pnjSpeedMove = "pause";
            this.tempo = 0;
            
            res.obj.speedMove = false;
            resetController();
            res = false;
            if(this.cinematic != false && $afterinteraction[this.cinematic] == undefined){
                //$interaction = this.cinematic;
            }
            if(this.combat != false){
            }
        }
        
        if(this.pnjSpeedMove == "pause"){
            this.tempo++;
            if(this.tempo >= 100){
                this.pnjSpeedMove = this.savemove;
            }
            
        }
        //if($tempointeraction == 0){
            if(this.typeMove == "random" && ~~(Math.random() * 100) <= 2){
                // Mouvement aléatoire
                /* Vu que c'est en aléatoire on prend : 
                * une direction au hasard this.angleMove
                * une vitesse au hasar sauf si présisé sur le tile this.speedMove
                */
               
                // angle pris au hasard
                this.angleMove = this.direction[~~(Math.random() * 16)];
               
                // Vitesse si non précisé sera parmis les trois si présisé alors soit vitesse présisé soit attente
                if(this.pnjSpeedMove == "random"){
                    var acelerate = ["slow", "normal", "fast", "wait", "wait"][~~(Math.random() * 5)];
                }else{
                    var acelerate = [this.pnjSpeedMove, "wait"][~~(Math.random() * 2)];
                }
                
                // verification si patiente on passe le speedmove a false
                if(acelerate == "wait"){
                    this.speedMove = false;
                }else this.speedMove = acelerate;
            }
            else if(this.typeMove == "circle" && this.tempcircle > this.durationcircle){
                this.tempcircle = 0;
                // envoie de la vitesse
                if(this.pnjSpeedMove == "random")
                    this.speedMove = ["slow", "normal", "fast"][~~(Math.random() * 3)];
                else this.speedMove = this.pnjSpeedMove;
                //envoie de l'angle on change d'angle a chaque fois
                if(this.pnjAngleMove == null)
                    this.pnjAngleMove = this.startWait;
                if(this.lastangle == undefined)
                    this.lastangle = this.pnjAngleMove;
            
                var currentangle = arraySearch(this.direction, this.lastangle)+1;
                if (currentangle > 15) currentangle = 0;
                this.angleMove = this.direction[currentangle];
                this.lastangle = this.direction[currentangle]
            
            }else if(this.typeMove == "circle" && this.tempcircle <= this.durationcircle){
                this.tempcircle++;
            }
            else if(this.typeMove == "hundredStep" && this.tempStep > this.durationStep){
                this.tempStep = 0;
                // Faire les 100 pas
                // envoie de la vitesse
                if(this.pnjSpeedMove == "random")
                    this.speedMove = ["slow", "normal", "fast"][~~(Math.random() * 3)];
                else this.speedMove = this.pnjSpeedMove;
            
                //envoie de l'angle on change d'angle a chaque fois
                if(this.pnjAngleMove == null)
                    this.pnjAngleMove = this.startWait;
                if(this.lastangle == undefined)
                    this.lastangle = this.pnjAngleMove; 
            
                var currentangle = arraySearch(this.direction, this.lastangle)+8;
                if (currentangle > 15) currentangle = currentangle -16;
                this.angleMove = this.direction[currentangle];
                this.lastangle = this.direction[currentangle];
            
            }else if(this.typeMove == "hundredStep" && this.tempStep <= this.durationStep){
                this.tempStep++;
            }
           
            // check & update pnj movement
            return this.parent();
//        }else{
//            return false;
//        }
    }
});