/*
 * Les fonctions du jeux une fois la connection établie et la sauvegarde récupéré
 */

/*
 * @class game
 * @type type
 * @description class de melonjs pour lancer le jeu
 */
var game = {
    // Run on page load.
    "onload": function() {
        // Initialize the video.
        if (!me.video.init("screen", globalVars['screenW'], globalVars['screenH'], false)) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
        // Initialize the audio.
//        me.audio.init("mp3,ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);

        me.sys.fps = globalVars['fps'];

        //debugger
//        window.onReady(function() {
//            me.plugin.register.defer(debugPanel, "debug");
//            me.debug.renderHitBox = true;
//        });

        // Load the resources.
        game.loadResources();
    },
    "loadResources": function() {
        var melonResources = [];
        var localpath = globalVars['ressourcesPath'];
        if (device.platform === "Android")
            localpath = 'file:///sdcard/' + globalVars['ressourcesPath'];
        for (var ressource in ressources) {
            if (ressources[ressource]['type'] != undefined) {
                melonResources.push({
                    "name": ressource,
                    "type": ressources[ressource]['type'],
                    "src": localpath + '/' + ressources[ressource]['name']
                });
            }
        }
        me.loader.preload(melonResources);
    },
    // Run on game resources loaded.
    "loaded": function() {
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.transition("fade", "#000000", 250);

        /////////////////////
        //   POOL OBJECT   //
        /////////////////////

        // add our player entity in the entity pool
        me.entityPool.add("Player", game.PlayerEntity);
        /* me.entityPool.add("Controller", game.ControllerEntity);
         me.entityPool.add("Interaction", game.InteractionEntity);
         me.entityPool.add("PNJ", game.PnjEntity);
         
         //load reposition point of player after changemaps
         me.entityPool.add("Gate", game.GateEntity);*/

        /////////////////////////
        //   END POOL OBJECT   //
        /////////////////////////

        //GAME CONTROLEUR
        me.input.bindKey(me.input.KEY.X0, "X0");
        me.input.bindKey(me.input.KEY.XM22, "XM22");
        me.input.bindKey(me.input.KEY.XM45, "XM45");
        me.input.bindKey(me.input.KEY.XM67, "XM67");
        me.input.bindKey(me.input.KEY.XM90, "XM90");
        me.input.bindKey(me.input.KEY.XM112, "XM112");
        me.input.bindKey(me.input.KEY.XM135, "XM135");
        me.input.bindKey(me.input.KEY.XM157, "XM157");
        me.input.bindKey(me.input.KEY.X180, "X180");
        me.input.bindKey(me.input.KEY.X22, "X22");
        me.input.bindKey(me.input.KEY.X45, "X45");
        me.input.bindKey(me.input.KEY.X67, "X67");
        me.input.bindKey(me.input.KEY.X90, "X90");
        me.input.bindKey(me.input.KEY.X112, "X112");
        me.input.bindKey(me.input.KEY.X135, "X135");
        me.input.bindKey(me.input.KEY.X157, "X157");

        // Start the game.
        me.state.change(me.state.PLAY);
    },
    "controleur": function(vecteur, angle) {

        if (!angle) {
            angle = null;
        }
        if (!vecteur) {
            vecteur = null;
        }
        me.input.triggerKeyEvent(me.input.KEY.X0, false);
        me.input.triggerKeyEvent(me.input.KEY.XM22, false);
        me.input.triggerKeyEvent(me.input.KEY.XM45, false);
        me.input.triggerKeyEvent(me.input.KEY.XM67, false);
        me.input.triggerKeyEvent(me.input.KEY.XM90, false);
        me.input.triggerKeyEvent(me.input.KEY.XM112, false);
        me.input.triggerKeyEvent(me.input.KEY.XM135, false);
        me.input.triggerKeyEvent(me.input.KEY.XM157, false);
        me.input.triggerKeyEvent(me.input.KEY.X180, false);
        me.input.triggerKeyEvent(me.input.KEY.X22, false);
        me.input.triggerKeyEvent(me.input.KEY.X45, false);
        me.input.triggerKeyEvent(me.input.KEY.X67, false);
        me.input.triggerKeyEvent(me.input.KEY.X90, false);
        me.input.triggerKeyEvent(me.input.KEY.X112, false);
        me.input.triggerKeyEvent(me.input.KEY.X135, false);
        me.input.triggerKeyEvent(me.input.KEY.X157, false);

        //fast
        if ((-11 < angle) && (angle < 11) && vecteur > 5) // 0°
        {
                me.input.triggerKeyEvent(me.input.KEY.X0, true);
        }

        else if ((-11 > angle) && (angle > -33) && vecteur > 5) // -22°
        {
                me.input.triggerKeyEvent(me.input.KEY.XM22, true);
        }

        else if ((-33 > angle) && (angle > -56) && vecteur > 5) // -45°
        {
                me.input.triggerKeyEvent(me.input.KEY.XM45, true);
        }

        else if ((-56 > angle) && (angle > -78) && vecteur > 5) // -67°
        {
                me.input.triggerKeyEvent(me.input.KEY.XM67, true);
        }

        else if ((-78 > angle) && (angle > -101) && vecteur > 5) // -90°
        {
                me.input.triggerKeyEvent(me.input.KEY.XM90, true);
        }

        else if ((-101 > angle) && (angle > -123) && vecteur > 5) // -112°
        {
                me.input.triggerKeyEvent(me.input.KEY.XM112, true);
        }

        else if ((-123 > angle) && (angle > -146) && vecteur > 5) // -135°
        {
                me.input.triggerKeyEvent(me.input.KEY.XM135, true);
        }

        else if ((-146 > angle) && (angle > -168) && vecteur > 5) // -157°
        {
                me.input.triggerKeyEvent(me.input.KEY.XM157, true);
        }

        else if ((-168 > angle) && (angle > -181) && vecteur > 5) // -180°
        {
                me.input.triggerKeyEvent(me.input.KEY.X180, true);
        }

        else if ((33 > angle) && (angle > 11) && vecteur > 5) // +22°
        {
                me.input.triggerKeyEvent(me.input.KEY.X22, true);
        }

        else if ((56 > angle) && (angle > 33) && vecteur > 5) // +45°
        {
                me.input.triggerKeyEvent(me.input.KEY.X45, true);
        }

        else if ((67 > angle) && (angle > 56) && vecteur > 5) // +67°
        {
                me.input.triggerKeyEvent(me.input.KEY.X67, true);
        }

        else if ((101 > angle) && (angle > 67) && vecteur > 5) // +90°
        {
                me.input.triggerKeyEvent(me.input.KEY.X90, true);
        }

        else if ((123 > angle) && (angle > 101) && vecteur > 5) // +112°
        {
                me.input.triggerKeyEvent(me.input.KEY.X112, true);
        }

        else if ((146 > angle) && (angle > 123) && vecteur > 5) // +135°
        {
                me.input.triggerKeyEvent(me.input.KEY.X135, true);
        }

        else if ((168 > angle) && (angle > 146) && vecteur > 5) // +157°
        {
                me.input.triggerKeyEvent(me.input.KEY.X157, true);
        }

        else if ((181 > angle) && (angle > 168) && vecteur > 5) // 180°
        {
                me.input.triggerKeyEvent(me.input.KEY.X180, true);
        }


    }
};

function onPointerDown(e) {
    e.preventDefault();
    if (e.touches !== undefined) {
        e = e.touches[0];
    }
    if (!globalVars['gamePause'] && !globalVars['gameFight'] && !globalVars['intercomIsOpen'] && globalVars['inGame']) {
        var ctrl = getElement('controleur');
        ctrl.css({
            'top': e.clientY + 'px',
            'left': e.clientX + 'px',
        });
        globalVars['ctrlexist'] = true;
//        controleurMove();
        globalVars['ctrlX'] = e.clientX;
        globalVars['ctrlY'] = e.clientY;
    }
}

function onPointerMove(e) {
    e.preventDefault();
    if (e.touches !== undefined) {
        e = e.touches[0];
    }
    if (globalVars['ctrlexist']) {
        var vecteurX = e.clientX - globalVars['ctrlX'];
        var vecteurY = e.clientY - globalVars['ctrlY'];
        var magnitude = Math.sqrt((vecteurX * vecteurX) + (vecteurY * vecteurY));
        var angle = Math.atan2(vecteurY, vecteurX) * 180 / Math.PI;
        if (magnitude > 65) {
            magnitude = 65;
            vecteurX = Math.cos(angle / 180 * Math.PI) * 65;
            vecteurY = Math.sin(angle / 180 * Math.PI) * 65;
        }
        $('#centerControleur').css({
            'left': vecteurX / 2 + 75 + 'px',
            'top': vecteurY / 2 + 75 + 'px',
        });
        controleurMove(angle);
        game.controleur(magnitude, angle);
    }
}

function onPointerUp(e) {
    e.preventDefault();
    if (e.touches !== undefined) {
        e = e.touches[0];
    }
    if ($('#controleur').length > 0) {
        $('#controleur').remove();
        globalVars['ctrlexist'] = false;
        game.controleur(0, 0);
    }
}

/*
 * @function getSaveGame()
 * @returns {undefined}
 * @description permet de récupéré la sauvegarde du joueur et lance le menu principale du jeu
 */
function getSaveGame() {
    //on fait la requette ajax pour récupéré la sauvegarde
    $.get(globalVars['urlServeur'] + '/getsavegame.php', {
        "id_player": globalVars['config'].id_player
    }, function(data) {
        var objJson = JSON.parse(data);
        var texterreur = '';
        if (objJson.erreurForm) {
            //le formulaire a été mal rempli
            texterreur += lang('erreurForm') + '<br/>';
        }
        if (objJson.noAcountFound) {
            texterreur += lang('noAcountFound') + '<br/>';
        }
        if (objJson.acountNoActif) {
            texterreur += lang('acountNoActif') + '<br/>';
        }
        if (texterreur != '') {
            //Si le compte ulisateur n'existe pas ou qu'il n'est pas actif on le deconnect pour le renvoyé à la page de connexion
            globalVars['noCloseIntercom'] = true;
            signal('<div>' + texterreur + '</div>');
            navigator.notification.vibrate(150);
            waitdelay(250);
            navigator.notification.vibrate(150);
            connectionPlayer();
        }
        if (objJson.savegame) {
            globalVars['savegame'] = objJson.savegame;
            // une fois la sauvegarde récupéré on lance le menu principale
            temposubmitEnd();
            menuGame();
        }
    });
}

/*
 * @function connectionPlayer()
 * @returns {undefined}
 * @description fait la connection du joueur ssi id_player est présent dans le fichier de config local sinon on affiche le formulaire de connection
 */
function connectionPlayer() {
    if (globalVars['config'].id_player == null || globalVars['config'].id_player == 0) {
        // génération du formulaire de connexion car l'id_player n'existe pas
        $('.traitParasite').hide().remove();
        var $form = '<div class="formconnect">\n\
                    <input type="text" class="login" name="login" value="" placeholder="' + lang('login') + '" onkeyup="verifLiveText($(this),\'[^a-zA-Z0-9 ]\')"/>\n\
                    <input type="password" class="pass" name="pass" value="" placeholder="' + lang('pass') + '" onkeyup="verifLiveText($(this),\'[^a-zA-Z0-9]\')"/>\n\
                    <div class="button submit" onclick="blinkButton($(this),function(){temposubmit(); submitConnect()});">' + lang('connection') + '</div>\n\
                    <div class="button creatacount" onclick="blinkButton($(this),function(){creatAcount()});">' + lang('creatAcount') + '</div>\n\
                    <div class="button forgot" onclick="blinkButton($(this),function(){forgot()});">' + lang('forgotpass') + '</div></div>';
        $('#intercom .screen .content .main').html($form);
    } else {
        getSaveGame();
    }
}

/*
 * @function submitConnect()
 * @returns {undefined}
 * @description soumition du formulaire de connection
 * on vérifie si le formulaire est bien remplis
 * si il est mal remplit on affiche un message d'erreur
 * Si il est bien remplit on va chercher l'id du joueur
 * Si aucun id n'est renvoyé car le duo login/mdp n'existe pas dans la base alors on le signal et on remet le formulaire de connection
 * Si le duo est trouvé on met a jour le fichier local de connection et on va chercher la sauvegarde
 */
function submitConnect() {
    var erreur = '';
    if ($('.login').val() == '') {
        erreur += lang('emptyLogin') + '<br/>';
    }
    if ($('.pass').val() == '') {
        erreur += lang('emptyPass') + '<br/>';
    }
    if (erreur == '') {
        //good job le formulaire est ok on envoie la requette
        if (globalVars['connectionType'] != 'nothing') {
            $.get(globalVars['urlServeur'] + '/connection.php', {
                'login': $('.login').val(),
                'pass': $('.pass').val(),
            },
                    function(data) {
                        var objJson = JSON.parse(data);
                        var texterreur = '';
                        if (objJson.erreurForm) {
                            //le formulaire a été mal rempli
                            texterreur += lang('erreurForm') + '<br/>';
                        }
                        if (objJson.noAcountFound) {
                            texterreur += lang('noAcountFound') + '<br/>';
                        }
                        if (objJson.acountNoActif) {
                            texterreur += lang('acountNoActif') + '<br/>';
                        }
                        if (texterreur != '') {
                            globalVars['noCloseIntercom'] = true;
                            signal('<div>' + texterreur + '</div>', function() {
                                temposubmitEnd();
                            });
                            navigator.notification.vibrate(150);
                            waitdelay(250);
                            navigator.notification.vibrate(150);
                            logOut();
                        }
                        if (objJson.id_player) {
                            globalVars['config'].id_player = objJson.id_player;
                            globalVars['config'].login = $('.login').val();
                            recordLocalData('config', globalVars['config']);
                            getSaveGame();
                        }
                    });
        } else {
            offline();
        }
    } else {
        globalVars['noCloseIntercom'] = true;
        signal('<div>' + lang('formMalRemplit') + '<br/>' + erreur + '</div>', function() {
            temposubmitEnd();
        });
        navigator.notification.vibrate(150);
        waitdelay(250);
        navigator.notification.vibrate(150);
    }
}

/*
 * @function forgot()
 * @returns {undefined}
 * @description affiche formulaire de mot de passe perdu
 */
function forgot() {
    $('.traitParasite').hide().remove();
    var $form = '<div class="formconnect">\n\
                    <input type="text" class="email" name="email" value="" placeholder="' + lang('email') + '" onkeyup="verifLiveText($(this),\'[^a-z0-9@.+-_]\')"/>\n\
                    <div class="button submit" onclick="blinkButton($(this),function(){temposubmit(); submitForgot()});">' + lang('getMyPass') + '</div>\n\
                    <div class="button return" onclick="blinkButton($(this),function(){connectionPlayer()});">' + lang('retour') + '</div>';
    $('#intercom .screen .content .main').html($form);
}

/*
 * @function submitForgot()
 * @returns {undefined}
 * @description submition du formulaire de mot de passe perdu
 * vérifie si le formulaire est bien remplit
 * si oui on envoie une requette au serveur pour vérifié si l'email exist
 * si il exist le serveur envoie un mail avec la procédure de récupération des identifiants
 * S'il n'exist pas on le signal au joueur et on réafiche le formulaire de mot de passe perdu
 */
function submitForgot() {
    var erreur = '';
    if ($('.email').val() == '' || !is_email($('.email').val())) {
        erreur += lang('badEmail') + '<br/>';
    }
    if (erreur == '') {
        //good job le formulaire est ok on envoie la requette
        if (globalVars['connectionType'] != 'nothing') {
            $.get(globalVars['urlServeur'] + '/forgot.php', {
                'email': $('.email').val(),
            },
                    function(data) {
                        var objJson = JSON.parse(data);
                        var texterreur = '';
                        if (objJson.erreurForm) {
                            //le formulaire a été mal rempli
                            texterreur += lang('erreurForm') + '<br/>';
                        }
                        if (objJson.emailNoExist) {
                            //l'email n'exist pas
                            texterreur += lang('emailNoExist') + '<br/>';
                        }
                        if (objJson.mailSend == 0) {
                            //Il y a eu une erreur dans l'envoie du mail
                            texterreur += lang('badSendMail') + '<br/>';
                        }
                        if (texterreur != '') {
                            globalVars['noCloseIntercom'] = true;
                            signal('<div>' + texterreur + '</div>', function() {
                                temposubmitEnd();
                            });
                            navigator.notification.vibrate(150);
                            waitdelay(250);
                            navigator.notification.vibrate(150);
                        } else {
                            globalVars['noCloseIntercom'] = true;
                            signal('<div>' + lang("forgotMailSend") + '</div>', function() {
                                temposubmitEnd();
                            });
                            navigator.notification.vibrate(150);
                            waitdelay(250);
                            navigator.notification.vibrate(150);
                        }
                    });
        } else {
            offline();
        }
    } else {
        globalVars['noCloseIntercom'] = true;
        signal('<div>' + lang('formMalRemplit') + '<br/>' + erreur + '</div>', function() {
            temposubmitEnd();
        });
        navigator.notification.vibrate(150);
        waitdelay(250);
        navigator.notification.vibrate(150);
    }
}

/*
 * @function creatAcount()
 * @returns {undefined}
 * @description affiche le formulaire de création de compte
 */
function creatAcount() {
    $('.traitParasite').hide().remove();
    var $form = '<div class="formconnect">\n\
                    <input type="email" class="email" name="email" value="" placeholder="' + lang('email') + '" onkeyup="verifLiveText($(this),\'[^a-z0-9@.+-_]\')"/>\n\
                    <input type="text" class="login" name="login" value="" placeholder="' + lang('login') + '" onkeyup="verifLiveText($(this),\'[^a-zA-Z0-9 ]\')"/>\n\
                    <input type="password" class="pass" name="pass" value="" placeholder="' + lang('pass') + '" onkeyup="verifLiveText($(this),\'[^a-zA-Z0-9]\')"/>\n\
                    <input type="password" class="confPass" name="confPass" value="" placeholder="' + lang('confPass') + '" onkeyup="verifLiveText($(this),\'[^a-zA-Z0-9]\')"/>\n\
                    <div class="button submit" onclick="blinkButton($(this),function(){temposubmit(); submitCreatAcount()});">' + lang('creatMyAcount') + '</div>\n\
                    <div class="button return" onclick="blinkButton($(this),function(){connectionPlayer()});">' + lang('retour') + '</div>';
    $('#intercom .screen .content .main').html($form);
}

/*
 * @function submitCreatAcount()
 * @returns {undefined}
 * @description soumet le formulaire de création de compte
 * on vérifie le bon remplissage du formulaire
 * en cas d'erreur on le signal au joueur
 * si ok on fait une requette au serveur pour vérifier que le login et email soit unique
 * si ce n'est pas le cas on le signal au joueur et on réaffiche le formualire
 * si tout est ok on créer le compte et on met a jour le fichier de conf et on récupère la sauvegarde du joueur
 */
function submitCreatAcount() {
    var erreur = '';
    if ($('.email').val() == '' || !is_email($('.email').val())) {
        erreur += lang('badEmail') + '<br/>';
    }
    if ($('.login').val() == '') {
        erreur += lang('emptyLogin') + '<br/>';
    }
    if ($('.pass').val() == '') {
        erreur += lang('emptyPass') + '<br/>';
    } else if ($('.pass').val().length < 6) {
        erreur += lang('badLongPass') + '<br/>';
    }
    if ($('.confPass').val() == '' || $('.pass').val() != $('.confPass').val()) {
        erreur += lang('badConfPass') + '<br/>';
    }
    if (erreur == '') {
        //good job le formulaire est ok on envoie la requette
        if (globalVars['connectionType'] != 'nothing') {
            $.get(globalVars['urlServeur'] + '/subscript.php', {
                'email': $('.email').val(),
                'login': $('.login').val(),
                'pass': $('.pass').val()},
            function(data) {
                var objJson = JSON.parse(data);
                var texterreur = '';
                if (objJson.erreurForm) {
                    //le formulaire a été mal rempli
                    texterreur += lang('erreurForm') + '<br/>';
                }
                if (objJson.erreuremail) {
                    //l'email exist déja
                    texterreur += lang('emailAlreadyExist') + '<br/>';
                }
                if (objJson.erreurlogin) {
                    //le login exist déja
                    texterreur += lang('loginAlreadyExist');
                }
                if (texterreur != '') {
                    globalVars['noCloseIntercom'] = true;
                    signal('<div>' + texterreur + '</div>', function() {
                        temposubmitEnd();
                    });
                    navigator.notification.vibrate(150);
                    waitdelay(250);
                    navigator.notification.vibrate(150);
                }
                if (objJson.id_player) {
                    globalVars['config'].id_player = objJson.id_player;
                    globalVars['config'].login = $('.login').val();
                    recordLocalData('config', globalVars['config']);
                    getSaveGame();
                }
            }).fail(function() {
                offline();
            });
        } else {
            offline();
        }
    } else {
        // il y a des erreurs on affiche les textes d'erreur pour explication.
        globalVars['noCloseIntercom'] = true;
        signal('<div>' + lang('formMalRemplit') + '<br/>' + erreur + '</div>', function() {
            temposubmitEnd();
        });
        navigator.notification.vibrate(150);
        waitdelay(250);
        navigator.notification.vibrate(150);
    }
}

/*
 * @function getSaveGame()
 * @returns {undefined}
 * @description affiche le menu principale du jeu
 */
function menuGame() {
    $('.traitParasite').hide().remove();
    $('#intercom .screen .status .namePlayer').html(globalVars['config'].login);
    var elem = '<div class="icone PVE"><div class="nom_icon">PvE</div></div>\n\
                        <div class="icone parametre"><div class="nom_icon" onclick="blinkButton($(this),function(){sceenParams();});">Config</div></div>\n\
                        <div class="icone PVP"><div class="nom_icon">PvP</div></div>\n\
                        <div class="icone exit" onclick="blinkButton($(this),function(){logOut();});"><div class="nom_icon">' + lang('deconnection') + '</div></div>\n\
                        <div class="icone didacticiel" onclick="blinkButton($(this),function(){didacticiel();});"><div class="nom_icon">Tuto</div></div>\n\
';
    $('#intercom .screen .content .main').html(elem);
    $('#intercom .screen .content .main .icone').css({'height': globalVars['screenIntercomH'] * 0.20 + 'px', 'width': globalVars['screenIntercomW'] * 0.95 * 0.45 + 'px', 'margin': globalVars['screenIntercomH'] * 0.03 + 'px ' + ((globalVars['screenIntercomW'] * 0.95) - (2 * (globalVars['screenIntercomW'] * 0.95 * 0.45))) / 5 + 'px'});
    $('#intercom .screen .content .main .icone .nom_icon').css({'font-size': globalVars['screenH'] * 0.15 * 0.40});
}

/*
 * @function logOut()
 * @returns {undefined}
 * @description fonction qui permet de déconnecté l'utilisateur
 * La fonction va remettre l'id_player a vide et remettre le login a vide
 * Puis renvoie sur l'ecran de connexion
 */
function logOut() {
    globalVars['config'].id_player = "0";
    globalVars['config'].login = "";
    recordLocalData('config', globalVars['config']);
    connectionPlayer();
}

/*
 * @function sceenParams()
 * @returns {undefined}
 * @description permet de modifier les différents paramètre
 * - langue
 * - fast start
 * - login
 * - mot de passe
 */
function sceenParams() {
    $('.traitParasite').hide().remove();
    var elem = '<div style="float:left;width:49%">\n\
<div style="width:80%;margin-left:15%;margin-top:6%;">\n\
    ' + lang('labelConfigLang') + '<br/>\n\
    </div>\n\
<select class="lang" name="lang">\n\
        <option value="FR"';
    if (globalVars['config'].lang == 'FR')
        elem += ' checked="checked"';
    elem += '>Français</option>\n\
        <option value="EN"';
    if (globalVars['config'].lang == 'EN')
        elem += ' checked="checked"';
    elem += '>English</option>\n\
    </select>\n\
<div style="width:80%;margin-left:15%;margin-top:3%;">\n\
    ' + lang('labelConfigHideAnim') + '<br/>\n\
    <div style="float:right;width:100px;">' + lang('Yes') + '\n\
        <div class="roundedOne">\n\
                <input name="fastStart" type="radio" id="fsoui" value="fsoui"';
    if (globalVars['config'].fastStart)
        elem += ' checked="checked"';
    elem += '/>\n\
                <label for="fsoui"></label>\n\
        </div>\n\
    </div>\n\
    <div style="float:right;width:100px;">\n\
        ' + lang('No') + '\n\
        <div class="roundedOne">\n\
                <input name="fastStart" type="radio" id="fsnon" value="fsnon"';
    if (!globalVars['config'].fastStart)
        elem += ' checked="checked"';
    elem += ' />\n\
                <label for="fsnon"></label>\n\
        </div>\n\
    </div>\n\
</div>\n\
<div style="width:80%;margin-left:15%;margin-top:40px;">\n\
    ' + lang('labelConfigHightFx') + '<br/>\n\
    <div style="float:right;width:100px;">' + lang('Yes') + '\n\
        <div class="roundedOne">\n\
                <input name="hightFx" type="radio" id="fxoui" value="fxoui"';
    if (globalVars['config'].hightFx)
        elem += ' checked="checked"';
    elem += '/>\n\
                <label for="fxoui"></label>\n\
        </div>\n\
    </div>\n\
    <div style="float:right;width:100px;">\n\
        ' + lang('No') + '\n\
        <div class="roundedOne">\n\
                <input name="hightFx" type="radio" id="fxnon" value="fxnon"';
    if (!globalVars['config'].hightFx)
        elem += ' checked="checked"';
    elem += ' />\n\
                <label for="fxnon"></label>\n\
        </div>\n\
    </div>\n\
</div>\n\
</div>\n\
<div style="float:right;width:49%">\n\
<div style="width:80%;margin-left:15%;margin-top:6%;">\n\
    ' + lang('labelConfigModifPass') + '<br/>\n\
    </div>\n\
<input type="password" class="oldpass" name="oldpass" value="" placeholder="' + lang('labelOldPass') + '" onkeyup="verifLiveText($(this),\'[^a-zA-Z0-9]\')"/>\n\
<input type="password" class="pass" name="pass" value="" placeholder="' + lang('labelConfigNewPass') + '" onkeyup="verifLiveText($(this),\'[^a-zA-Z0-9]\')"/>\n\
<input type="password" class="confPass" name="confPass" value="" placeholder="' + lang('confPass') + '" onkeyup="verifLiveText($(this),\'[^a-zA-Z0-9]\')"/>\n\
</div>\n\
<div style="clear:both"></div>\n\
<div style="width:86%; margin:40px 7% 3% 7%;" class="button submit" onclick="blinkButton($(this),function(){temposubmit();submitScreenConfig()});">' + lang('modifConfig') + '</div>\n\
<div style="margin-left: 7%;" class="button return" onclick="blinkButton($(this),function(){menuGame()});">' + lang('retour') + '</div>';
    $('#intercom .screen .content .main').html(elem);
}

/*
 * @function submitScreenConfig()
 * @return nothing
 * @description enregistre les modifications en local des paramètres de configuration
 * envoie au serveur la demande de changement de mot de passe
 */
function submitScreenConfig() {
    globalVars['config'].fastStart = $('input[name=fastStart]:checked').val() == 'fsoui' ? true : false;
    globalVars['config'].hightFx = $('input[name=hightFx]:checked').val() == 'fxoui' ? true : false;
    globalVars['config'].lang = $('.lang').val();
    globalVars['lang'] = globalVars['config'].lang;
    recordLocalData('config', globalVars['config']);
    if ($('.pass').val() != '') {
        //le mot de passe a été remplis le joueur veux donc en changer
        var erreur = '';
        if ($('.pass').val().length < 6) {
            erreur += lang('badLongPass') + '<br/>';
        }
        if ($('.confPass').val() == '' || $('.pass').val() != $('.confPass').val()) {
            erreur += lang('badConfPass') + '<br/>';
        }
        if (erreur == '') {
            //good job le formulaire est ok on envoie la requette
            if (globalVars['connectionType'] != 'nothing') {
                $.get(globalVars['urlServeur'] + '/modifpass.php', {
                    'oldpass': $('.oldpass').val(),
                    'pass': $('.pass').val(),
                    'confPass': $('.confPass').val(),
                    'id_player': globalVars['config'].id_player
                },
                function(data) {
                    var objJson = JSON.parse(data);
                    var texterreur = '';
                    if (objJson.noPalyerFound) {
                        //le login exist déja
                        texterreur += lang('noPalyerFound') + '<br/>';
                        signal('<div>' + texterreur + '</div>');
                        navigator.notification.vibrate(150);
                        waitdelay(250);
                        navigator.notification.vibrate(150);
                        temposubmitEnd();
                        logOut();
                    }
                    if (objJson.erreurForm) {
                        //le formulaire a été mal rempli
                        texterreur += lang('erreurForm') + '<br/>';
                    }
                    if (objJson.badPassword) {
                        texterreur += lang('badPassword') + '<br/>';
                    }
                    if (objJson.badNewPassword) {
                        texterreur += lang('badNewPassword') + '<br/>';
                    }
                    if (objJson.erreur) {
                        texterreur += objJson.erreur + '<br/>';
                    }
                    if (texterreur != '') {
                        globalVars['noCloseIntercom'] = true;
                        signal('<div>' + texterreur + '</div>', function() {
                            temposubmitEnd();
                        });
                        navigator.notification.vibrate(150);
                        waitdelay(250);
                        navigator.notification.vibrate(150);
                    } else {
                        globalVars['noCloseIntercom'] = true;
                        signal('<div>' + lang('confChangePass') + '</div>');
                        temposubmitEnd();
                        menuGame();
                    }
                }).fail(function() {
                    offline();
                });
            } else {
                offline();
            }
        } else {
            // il y a des erreurs on affiche les textes d'erreur pour explication.
            globalVars['noCloseIntercom'] = true;
            signal('<div>' + lang('formMalRemplit') + '<br/>' + erreur + '</div>', function() {
                temposubmitEnd();
            });
            navigator.notification.vibrate(150);
            waitdelay(250);
            navigator.notification.vibrate(150);
        }
    } else {
        temposubmitEnd();
        menuGame();
    }
}

/*
 * @function didacticiel()
 * @return nothing
 * @description Lance le didactitiel
 */
function didacticiel() {
    // on charge les paramètre de base tel que la version du personnage, la map etc
    globalVars['usePerso'] = 1;
    globalVars['useDeck'] = 0;
    globalVars['curentMap'] = 'z1m2';
    globalVars['inGame'] = true;
    closeIntercom(function() {
        //var intercomLoad = getElement('intercomLoad');
        //intercomLoad.show();
        //animmeMinLoad('intercom');
        //game.onload();
		getLocalData('ressources/shema-perso'+globalVars['usePerso']);
		
						alert('3');
		var_dump(globalVars['shema-perso'+globalVars['usePerso']]);
    });
}