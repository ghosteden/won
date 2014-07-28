game.PlayScreen = me.ScreenObject.extend({
    /**	
     *  action to perform on state change
     */
    onResetEvent: function() {
        me.levelDirector.loadLevel(globalVars['curentMap']);
        $('#intercomLoad').hide();
        $('canvas').fadeIn();
        getElement("gameControleur");
        var jselemGameControleur = document.getElementById('gameControleur');
        jselemGameControleur.addEventListener("touchstart", function(e){onPointerDown(e)}, false);
        jselemGameControleur.addEventListener("touchmove", function(e){onPointerMove(e)}, false);
        jselemGameControleur.addEventListener("touchend", function(e){onPointerUp(e)}, false);
//        jselemGameControleur.addEventListener("mousedown", function(e){onPointerDown(e)}, false);
//        jselemGameControleur.addEventListener("mousemove", function(e){onPointerMove(e)}, false);
//        jselemGameControleur.addEventListener("mouseup", function(e){onPointerUp(e)}, false);
//        $('#gameControleur').mousemove(function(e) {
//            onPointerDown(e);
//        })
//        $('#gameControleur').mousedown(function(e) {
//            onPointerMove(e);
//        })
//        $('#gameControleur').mouseup(function(e) {
//            onPointerUp(e);
//        })

		var_dump(globalVars['shema-perso'+globalVars['usePerso']]);
   },
    /**	
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
    }
});