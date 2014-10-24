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
			save = objJson.savegame;
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
                        <div class="icone parametre"><div class="nom_icon" onclick="blinkButton($(this),function(){sceenParams(\'start\');});">Config</div></div>\n\
                        <div class="icone PVP"><div class="nom_icon">PvP</div></div>\n\
                        <div class="icone exit" onclick="blinkButton($(this),function(){logOut();});"><div class="nom_icon">' + lang('deconnection') + '</div></div>\n\
                        <div class="icone didacticiel" onclick="blinkButton($(this),function(){didacticiel();});"><div class="nom_icon">Tuto</div></div>\n\
';
	$('#intercom .screen .content .main').html(elem);
	$('#intercom .screen .content .main .icone').css({'height': globalVars['screenIntercomH'] * 0.20 + 'px', 'width': globalVars['screenIntercomW'] * 0.95 * 0.45 + 'px', 'margin': globalVars['screenIntercomH'] * 0.03 + 'px ' + ((globalVars['screenIntercomW'] * 0.95) - (2 * (globalVars['screenIntercomW'] * 0.95 * 0.45))) / 5 + 'px'});
	$('#intercom .screen .content .main .icone .nom_icon').css({'font-size': globalVars['screenH'] * 0.15 * 0.40});
}

function menuTuto() {
	$('.traitParasite').hide().remove();
	$('#intercom .screen .status .namePlayer').html(globalVars['config'].login);
	switch (save['tuto']['etape']) {
		case 0:
			var elem = '<div class="icone nothing"></div>\n\
                        <div class="icone parametre"><div class="nom_icon" onclick="blinkButton($(this),function(){sceenParams(\'tuto\');});">Config</div></div>\n\
                        <div class="icone nothing"></div>\n\
                        <div class="icone exit" onclick="blinkButton($(this),function(){goHome();});"><div class="nom_icon">' + lang('btnExit') + '</div></div>\n\
                        <div class="icone nothing"></div>';
			break;
		case 1:
			var elem = '<div class="icone message" onclick="blinkButton($(this),function(){switchMenu(\'message\');});"><div class="nom_icon">' + lang('messagerie') + '</div></div>\n\
                        <div class="icone parametre"><div class="nom_icon" onclick="blinkButton($(this),function(){sceenParams(\'tuto\');});">Config</div></div>\n\
                        <div class="icone nothing"></div>\n\
                        <div class="icone exit" onclick="blinkButton($(this),function(){goHome();});"><div class="nom_icon">' + lang('btnExit') + '</div></div>\n\
                        <div class="icone nothing"></div>';
			break;
		default:
			var elem = '<div class="icone message" onclick="blinkButton($(this),function(){switchMenu(\'message\');});"><div class="nom_icon">' + lang('messagerie') + '</div></div>\n\
                        <div class="icone parametre"><div class="nom_icon" onclick="blinkButton($(this),function(){sceenParams(\'tuto\');});">Config</div></div>\n\
                        <div class="icone deck"><div class="nom_icon">Deck</div></div>\n\
                        <div class="icone exit" onclick="blinkButton($(this),function(){goHome();});"><div class="nom_icon">' + lang('btnExit') + '</div></div>\n\
                        <div class="icone GPS" onclick="blinkButton($(this),function(){openGps();});"><div class="nom_icon">GPS</div></div>';
			break;
	}
	$('#intercom .screen .content .main').html(elem);
	checkNumberOfMail();
	$('#intercom .screen .content .main .icone').css({'height': globalVars['screenIntercomH'] * 0.20 + 'px', 'width': globalVars['screenIntercomW'] * 0.95 * 0.45 + 'px', 'margin': globalVars['screenIntercomH'] * 0.03 + 'px ' + ((globalVars['screenIntercomW'] * 0.95) - (2 * (globalVars['screenIntercomW'] * 0.95 * 0.45))) / 5 + 'px'});
	$('#intercom .screen .content .main .icone .nom_icon').css({'font-size': globalVars['screenH'] * 0.15 * 0.40});
}

function menuPve() {
	$('.traitParasite').hide().remove();
	$('#intercom .screen .status .namePlayer').html(globalVars['config'].login);
	var elem = '<div class="icone message" onclick="blinkButton($(this),function(){switchMenu(\'message\');});"><div class="nom_icon">' + lang('messagerie') + '</div></div>\n\
                        <div class="icone parametre"><div class="nom_icon" onclick="blinkButton($(this),function(){sceenParams(\'pve\');});">Config</div></div>\n\
                        <div class="icone deck"><div class="nom_icon">Deck</div></div>\n\
                        <div class="icone exit" onclick="blinkButton($(this),function(){goHome();});"><div class="nom_icon">' + lang('btnExit') + '</div></div>\n\
                        <div class="icone GPS" onclick="blinkButton($(this),function(){didacticiel();});"><div class="nom_icon">GPS</div></div>\n\
';
	$('#intercom .screen .content .main').html(elem);
	checkNumberOfMail();
	$('#intercom .screen .content .main .icone').css({'height': globalVars['screenIntercomH'] * 0.20 + 'px', 'width': globalVars['screenIntercomW'] * 0.95 * 0.45 + 'px', 'margin': globalVars['screenIntercomH'] * 0.03 + 'px ' + ((globalVars['screenIntercomW'] * 0.95) - (2 * (globalVars['screenIntercomW'] * 0.95 * 0.45))) / 5 + 'px'});
	$('#intercom .screen .content .main .icone .nom_icon').css({'font-size': globalVars['screenH'] * 0.15 * 0.40});
}

function menuMessage() {
	$('.traitParasite').hide().remove();
	$('#intercom .screen .status .namePlayer').html(globalVars['config'].login);
	var elem = 'Aucun message pour le moment';
	$('#intercom .screen .content .main').html(elem);
	$('#intercom .screen .content .main .icone').css({'height': globalVars['screenIntercomH'] * 0.20 + 'px', 'width': globalVars['screenIntercomW'] * 0.95 * 0.45 + 'px', 'margin': globalVars['screenIntercomH'] * 0.03 + 'px ' + ((globalVars['screenIntercomW'] * 0.95) - (2 * (globalVars['screenIntercomW'] * 0.95 * 0.45))) / 5 + 'px'});
	$('#intercom .screen .content .main .icone .nom_icon').css({'font-size': globalVars['screenH'] * 0.15 * 0.40});
}

function switchMenu(type) {
	switch (type) {
		case 'start':
			menuGame();
			break;
		case 'tuto':
			menuTuto();
			break;
		case 'pve':
			menuPve();
			break;
		case 'pvp':
			menuPvp();
			break;
		case 'message':
			menuMessage();
			break;
		case 'params':
			sceenParams();
			break;
	}
}

function addMessage(type) {
	$('#intercom .screen .content .main .icone.message .nbr').html(parseInt($('#intercom .screen .content .main .icone.message .nbr').html()) + 1);
	switch (type) {

	}
}

function checkNumberOfMail() {
	var numberOfMail = 0;
	if ($('#intercom .screen .content .main .icone.message .nbr').length <= 0) {
		$('#intercom .screen .content .main .icone.message').append('<div class="nbr">' + numberOfMail + '</div>');
	}
}

function goHome() {
	if (save['tuto'] != undefined) {
		delete save['tuto'];
	}
	delete globalVars['gameEmplacement'];
	delete globalVars['usePerso'];
	delete globalVars['useDeck'];
	delete globalVars['curentMap'];
	globalVars['inGame'] = false;
	closeIntercom(function() {
		switchMenu('start');
		if ($('#mapWrap').length) {
			$('#mapWrap').fadeOut(function() {
				getElement('fondmenup').fadeIn();
				openIntercom();
			});
		}
	});
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
function sceenParams(prev) {
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
<div style="margin-left: 7%;" class="button return" onclick="blinkButton($(this),function(){switchMenu(\'' + prev + '\')});">' + lang('retour') + '</div>';
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
	globalVars['gameEmplacement'] = 'tuto';
	globalVars['usePerso'] = 1;
	globalVars['useDeck'] = 0;
	globalVars['curentMap'] = 'z1m1';
	globalVars['inGame'] = true;
	save[globalVars['gameEmplacement']] = [];
	save[globalVars['gameEmplacement']]['etape'] = 0;
	save[globalVars['gameEmplacement']]['interaction'] = [];
	closeIntercom(function() {
		switchMenu('tuto');
		loadMap(globalVars['curentMap']);
		initialiseGameControle("mapWrap");
		//interaction('startTuto');
	});
}

function loadMap(name) {
	// On masque l'image du menu au cas où elle soit visible
	getElement('fondmenup').fadeOut();
	// On créer les élément pour la map
	mapWrap = getElement('mapWrap');
	mapWrap.fadeOut().css('display', 'none');

	// on récupère l'objet json map
	getLocalData('ressources/' + name + 'json', function() {
		getLocalData('ressources/shema-perso' + globalVars['usePerso'], function() {
			// Recalcul si ecran large
			if (globalVars['typeScreen'] == 'l') {
				globalVars[globalVars['curentMap'] + 'json'].width = globalVars[globalVars['curentMap'] + 'json'].width * globalVars['multipleScreen'];
				globalVars[globalVars['curentMap'] + 'json'].height = globalVars[globalVars['curentMap'] + 'json'].height * globalVars['multipleScreen'];
				globalVars[globalVars['curentMap'] + 'json'].posy = globalVars[globalVars['curentMap'] + 'json'].posy * globalVars['multipleScreen'];
				globalVars[globalVars['curentMap'] + 'json'].posx = globalVars[globalVars['curentMap'] + 'json'].posx * globalVars['multipleScreen'];
			}
			mapWrap = getElement('mapWrap');
			var imgMap = '<img src="' + getLocalRessources(globalVars[globalVars['curentMap'] + 'json'].ressource) + '" class="imgMap" width="' + globalVars[globalVars['curentMap'] + 'json'].width + '" height="' + globalVars[globalVars['curentMap'] + 'json'].height + '"/>';
			mapWrap
					.children('div#map')
					.css({
						'width': globalVars[globalVars['curentMap'] + 'json'].width + 'px',
						'height': globalVars[globalVars['curentMap'] + 'json'].height + 'px',
						'top': globalVars[globalVars['curentMap'] + 'json'].posy + 'px',
						'left': globalVars[globalVars['curentMap'] + 'json'].posx + 'px'
					})
					.html(imgMap);
			// On ajoute le personnage joueur
			if (globalVars[globalVars['curentMap'] + 'json']['joueur'] != undefined) {
				var joueur = globalVars[globalVars['curentMap'] + 'json']['joueur'];
				var curseurJoueur = {
					'posx': joueur.posx + 30,
					'posy': joueur.posy + 60,
				}
				joueur.height = 120;
				joueur.width = 120;
				joueur.ressource = 'sprites-perso' + globalVars['usePerso'];

				if (globalVars['typeScreen'] == 'l') {
					joueur.width = joueur.width * globalVars['multipleScreen'];
					joueur.height = joueur.height * globalVars['multipleScreen'];
					joueur.posy = joueur.posy * globalVars['multipleScreen'];
					joueur.posx = joueur.posx * globalVars['multipleScreen'];
				}
				var joueurobj = '<div id="joueur" class="sprite" style="top:' + joueur.posy + 'px;left:' + joueur.posx + 'px; width:' + joueur.width + 'px;height:' + joueur.height + 'px;"><div class="sprite" style="width:' + joueur.width + 'px;height:' + joueur.height + 'px;"></div><div class="curseur" style="position:absolute;top:' + 60 * globalVars['multipleScreen'] + 'px;left:' + 30 * globalVars['multipleScreen'] + 'px; width:' + globalVars['multipleScreen'] * 60 + 'px;height:' + globalVars['multipleScreen'] * 60 + 'px;"></div></div>';

				mapWrap.children('div#map').append(joueurobj);
				$('#joueur .sprite').animateSprite({
					src: getLocalRessources(joueur.ressource), 
					sw: '120', 
					sh: '120', 
					nbc: '100', 
					nbl: '16', 
					'anims':globalVars['shema-perso' + globalVars['usePerso']],
					fps:globalVars['shema-perso' + globalVars['usePerso']].fps, 
					redim:true
				});
				$('#joueur .sprite').animateSprite('play',globalVars[globalVars['curentMap'] + 'json'].joueur.direction);
				
			}

			// On ajoute les points d'interet
			for (interet in globalVars[globalVars['curentMap'] + 'json'].interets) {
				var obj = globalVars[globalVars['curentMap'] + 'json'].interets[interet];
				if (obj.ressource.indexOf('sprites') >= 0) {
					// on redéfini les taille si on est sur écran large
					if (globalVars['typeScreen'] == 'l') {
						obj.width = obj.width * globalVars['multipleScreen'];
						obj.height = obj.height * globalVars['multipleScreen'];
						obj.posy = obj.posy * globalVars['multipleScreen'];
						obj.posx = obj.posx * globalVars['multipleScreen'];
						if (obj.action != undefined) {
							obj.action.posx = obj.action.posx * globalVars['multipleScreen'];
							obj.action.posy = obj.action.posy * globalVars['multipleScreen'];
							if (obj.action.hitbox != undefined) {
								obj.action.hitbox.x = obj.action.hitbox.x * globalVars['multipleScreen'];
								obj.action.hitbox.y = obj.action.hitbox.y * globalVars['multipleScreen'];
								obj.action.hitbox.h = obj.action.hitbox.h * globalVars['multipleScreen'];
								obj.action.hitbox.w = obj.action.hitbox.w * globalVars['multipleScreen'];
							}
						}
					}
				}
				var objectInteret = '<div id="' + interet + '" class="sprite" style="top:' + obj.posy + 'px;left:' + obj.posx + 'px; width:' + obj.width + 'px;height:' + obj.height + 'px;">';
				if (obj.action != undefined) {
					objectInteret += '<div class="hitbox" style="position:absolute;top:' + obj.action.hitbox.x + 'px;left:' + obj.action.hitbox.y + 'px;width:' + obj.action.hitbox.w + 'px;height:' + obj.action.hitbox.h + 'px;z-index:31;" onmousedown="' + obj.action.fct + '" ontouchstart="' + obj.action.fct + '"></div><div class="curseur" style="position:absolute;top:' + obj.action.posy + 'px;left:' + obj.action.posx + 'px; width:' + globalVars['multipleScreen'] * 60 + 'px;height:' + globalVars['multipleScreen'] * 60 + 'px;">';
				}
				objectInteret += '</div></div>';
				// on ajoute les animations des points d'interet
				/* @fixme : a gérer les aniamtions par rapport au shema */
				mapWrap.children('div#map').append(objectInteret);
					$('#'+interet).animateSprite({
					src: getLocalRessources(obj.ressource), 
					sw: '120', 
					sh: '120', 
					nbc: '20', 
					nbl: '1', 
					'anims': {'X0': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]},
					fps:12, 
					redim:true
				});
			}
			// Ajout animation des curseur placé par les point d'interet ou les quêtes
			$('.curseur').animateSprite({
				src: getLocalRessources('sprites-curseur'), 
				sw: '160', 
				sh: '160', 
				nbc: '50', 
				nbl: '1', 
				'anims': {'X0': "0-49"},
				fps:12, 
				redim:true
			});
			mapWrap.fadeIn();
		});
	});
}
