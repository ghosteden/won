game.PlayScreen = me.ScreenObject.extend({
    /**	
     *  action to perform on state change
     */
    onResetEvent: function() {
		
		alert('p1');
        me.levelDirector.loadLevel(globalVars['curentMap']);
		alert('p2');
        $('#intercomLoad').hide();
		alert('p3');
        $('canvas').fadeIn();
		alert('p4');
        getElement("gameControleur");
		alert('p5');
        var jselemGameControleur = document.getElementById('gameControleur');
		alert('p6');
        jselemGameControleur.addEventListener("touchstart", function(e){onPointerDown(e)}, false);
		alert('p7');
        jselemGameControleur.addEventListener("touchmove", function(e){onPointerMove(e)}, false);
		alert('p8');
        jselemGameControleur.addEventListener("touchend", function(e){onPointerUp(e)}, false);
		alert('p9');
//        jselemGameControleur.addEventListener("mousedown", function(e){onPointerDown(e)}, false);
//        jselemGameControleur.addEventListener("mousemove", function(e){onPointerMove(e)}, false);
//        jselemGameControleur.addEventListener("mouseup", function(e){onPointerUp(e)}, false);
    },
    /**	
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
    }
});