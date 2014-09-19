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
	globalVars['curentMap'] = 'z1m1';
	globalVars['inGame'] = true;

	closeIntercom(function() {
		loadMap(globalVars['curentMap']);
		initialiseGameControle();
		//interaction('startTuto');
	});
}

function loadMap(name) {
	getElement('fondmenup').fadeOut();
	mapWrap = getElement('mapWrap');
	mapWrap.fadeOut();
	if (device.platform == 'web') {
		var mapjson = {
			'posx': -100,
			'posy': -230,
			'width': 1333,
			'height': 775,
			'ressource': 'z1m1',
			'interets': {
				'Paul': {
					'posx': 100,
					'posy': 100,
					'ressource': 'sprites-paul',
					'shema': 'shema-paul',
					'width': 120,
					'height': 120,
				}
			}
		}
		globalVars[globalVars['curentMap'] + 'json'] = mapjson;
		if (globalVars['typeScreen'] == 'l') {
			globalVars[globalVars['curentMap'] + 'json'].width = globalVars[globalVars['curentMap'] + 'json'].width * globalVars['multipleScreen'];
			globalVars[globalVars['curentMap'] + 'json'].height = globalVars[globalVars['curentMap'] + 'json'].height * globalVars['multipleScreen'];
			globalVars[globalVars['curentMap'] + 'json'].posy = globalVars[globalVars['curentMap'] + 'json'].posy * globalVars['multipleScreen'];
			globalVars[globalVars['curentMap'] + 'json'].posx = globalVars[globalVars['curentMap'] + 'json'].posx * globalVars['multipleScreen'];
		}
		mapWrap = getElement('mapWrap');
		var imgMap = '<img src="' + getLocalRessources(globalVars[globalVars['curentMap'] + 'json'].ressource) + '" class="imgMap" width="' + globalVars[globalVars['curentMap'] + 'json'].width + '" height="' + globalVars[globalVars['curentMap'] + 'json'].height + '"/>';
		mapWrap
				.fadeOut()
				.delay('500')
				.children('div#map')
				.css({
					'width': globalVars[globalVars['curentMap'] + 'json'].width + 'px',
					'height': globalVars[globalVars['curentMap'] + 'json'].height + 'px',
					'top': globalVars[globalVars['curentMap'] + 'json'].posy + 'px',
					'left': globalVars[globalVars['curentMap'] + 'json'].posx + 'px'
				})
				.html(imgMap);

		for (interet in globalVars[globalVars['curentMap'] + 'json'].interets) {
			var obj = globalVars[globalVars['curentMap'] + 'json'].interets[interet];

			/* calcul de la taill pour utilisé un sprite large si besoin */
			if (obj.ressource.indexOf('sprites') >= 0) {
				if (globalVars['typeScreen'] == 'l') {
					obj.ressource = obj.ressource + '-l';
					obj.width = obj.width * globalVars['multipleScreen'];
					obj.height = obj.height * globalVars['multipleScreen'];
					obj.posy = obj.posy * globalVars['multipleScreen'];
					obj.posx = obj.posx * globalVars['multipleScreen'];

				}
			}

			var objectInteret = '<div id="' + interet + '" style="z-index:30;position:absolute;top:' + obj.posx + 'px;left:' + obj.posy + 'px; width:' + obj.width + 'px;height:' + obj.height + 'px;background:url(' + getLocalRessources(obj.ressource) + ')"></div>'

			mapWrap.fadeOut().children('div#map').append(objectInteret);

			$('#' + interet).animateSprite({
				'columns': 100,
				'fps': 12,
				'animations': {'X0': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]},
				'loop': true,
			});
		}
		mapWrap.fadeIn();
	} else {
		getLocalData('ressources/' + name + 'json', function() {
			if (globalVars['typeScreen'] == 'l') {
				globalVars[globalVars['curentMap'] + 'json'].width = globalVars[globalVars['curentMap'] + 'json'].width * globalVars['multipleScreen'];
				globalVars[globalVars['curentMap'] + 'json'].height = globalVars[globalVars['curentMap'] + 'json'].height * globalVars['multipleScreen'];
				globalVars[globalVars['curentMap'] + 'json'].posy = globalVars[globalVars['curentMap'] + 'json'].posy * globalVars['multipleScreen'];
				globalVars[globalVars['curentMap'] + 'json'].posx = globalVars[globalVars['curentMap'] + 'json'].posx * globalVars['multipleScreen'];
			}
			mapWrap = getElement('mapWrap');
			var imgMap = '<img src="' + getLocalRessources(globalVars[globalVars['curentMap'] + 'json'].ressource) + '" class="imgMap"/>';
			mapWrap
					.children('div#map')
					.css({
						'width': globalVars[globalVars['curentMap'] + 'json'].width + 'px',
						'height': globalVars[globalVars['curentMap'] + 'json'].height + 'px',
						'top': globalVars[globalVars['curentMap'] + 'json'].posy + 'px',
						'left': globalVars[globalVars['curentMap'] + 'json'].posx + 'px'
					})
					.html(imgMap);
			for (interet in globalVars[globalVars['curentMap'] + 'json'].interets) {
				var obj = globalVars[globalVars['curentMap'] + 'json'].interets[interet];
				if (obj.ressource.indexOf('sprites') >= 0) {
					if (globalVars['typeScreen'] == 'l') {
						obj.ressource = obj.ressource + '-l';
						obj.width = obj.width * globalVars['multipleScreen'];
						obj.height = obj.height * globalVars['multipleScreen'];
						obj.posy = obj.posy * globalVars['multipleScreen'];
						obj.posx = obj.posx * globalVars['multipleScreen'];

					}
				}
				var objectInteret = '<div id="' + interet + '" style="z-index:30;position:absolute;top:' + obj.posx + 'px;left:' + obj.posy + 'px; width:' + obj.width + 'px;height:' + obj.height + 'px;background:url(' + getLocalRessources(obj.ressource) + ')"></div>'
				mapWrap.children('div#map').append(objectInteret);
				$('#' + interet).animateSprite({
					'columns': 100,
					'fps': 12,
					'animations': {'X0': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]},
					'loop': true,
				});
			}
			mapWrap.fadeIn();
		});
	}

}
