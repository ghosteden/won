
game.GateEntity = me.LevelEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    "goToPlayerX":null,
    "goToPlayerY":null,
    init: function(x, y, settings) {
        
        if (typeof(settings.goToPlayerX) != "undefined")
            this.goToPlayerX = settings.goToPlayerX;
        else this.goToPlayerX = null;
        
        if (typeof(settings.goToPlayerY) != "undefined")
            this.goToPlayerY = settings.goToPlayerY;
        else this.goToPlayerY = null;
        
        // appel du constructeur parrent
        this.parent(x, y, settings);
    },
 
    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function(res, obj) {
        if(obj.name == "player"){
            if(me.save.goToPlayerX != undefined){
                me.save.goToPlayerX = this.goToPlayerX;
            }else{
                me.save.add({
                    'goToPlayerX':this.goToPlayerX
                });
            }
            if(me.save.goToPlayerY != undefined){
                me.save.goToPlayerY = this.goToPlayerY;
            }else{
                me.save.add({
                    'goToPlayerY':this.goToPlayerY
                });
            }
            this.goTo(this.gotolevel);
        }
    }
 
});