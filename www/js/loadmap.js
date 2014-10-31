var nbToDo = 0;
var nbDo = 0;
var endload = false;
function loadMap() {
	alert('2');
	if (!endload) {
	alert('3');
		getElement('fondmenup').fadeOut();
		// On créer les élément pour la map
		var mapWrap = getElement('mapWrap');
		var illuMap = getElement('illuMap');
		var loader = getElement('loader');
		// on récupère l'objet json map
	alert('4');
		getLocalData('ressources/' + globalVars['curentMap'] + 'json', function() {
	alert('5');
			$('<img style="visibility:hidden"/>').attr({'src': getLocalRessources(globalVars[globalVars['curentMap'] + 'json'].illustration)}).load(function() {
				$(this).remove();
				illuMap.css({
					'background': 'url(' + getLocalRessources(globalVars[globalVars['curentMap'] + 'json'].illustration) + ') no-repeat center center',
					'background-size': 'cover',
				});
				illuMap.fadeIn(function() {
					// L'écran de chargement est afficher avec l'illustration de la map on ajoute la barre de chargement
					var loadBar = getElement('', 'loadBar');
					var divCheckUpdateApps = getElement('checkUpdateApps', 'infoLoadingScreen');
					loadBar.animate({'height': loadBar.attr('data-height') + 'px'}, 500, function() {
						divCheckUpdateApps.html(lang('loading')).fadeIn(function() {

							//on précharge les éléments
							for (var load in globalVars[globalVars['curentMap'] + 'json'].ressources) {
								nbToDo++;
								loading = globalVars[globalVars['curentMap'] + 'json'].ressources[load].replace('perso', 'perso' + globalVars['usePerso']);
								if (ressources[loading].type == 'image') {
									elem = '<img id="' + loading + '" src="' + getLocalRessources(loading) + '"/>';
									loader.append(elem);
									loader.children('#' + loading).load(function() {
										//$(this).remove();
										checkEndLaodMap();
									});
								}
								if (ressources[loading].type == 'json') {
									getLocalData('ressources/' + loading, function() {
										checkEndLaodMap();
									});
								}
							}
							endload = true;
						});
					});
				});
			})
		});
	} else {
		// On remet les valeurs initial pour le prochain chargement de map
		nbToDo = 0;
		nbDo = 0;
		endload = false;
		if (globalVars['multipleScreen'] != 1) {
			globalVars[globalVars['curentMap'] + 'json'].width = globalVars[globalVars['curentMap'] + 'json'].width * globalVars['multipleScreen'];
			globalVars[globalVars['curentMap'] + 'json'].height = globalVars[globalVars['curentMap'] + 'json'].height * globalVars['multipleScreen'];
			globalVars[globalVars['curentMap'] + 'json'].posy = globalVars[globalVars['curentMap'] + 'json'].posy * globalVars['multipleScreen'];
			globalVars[globalVars['curentMap'] + 'json'].posx = globalVars[globalVars['curentMap'] + 'json'].posx * globalVars['multipleScreen'];
		}
		// ajout de la carte
		var imgMap = '<img src="' + getLocalRessources(globalVars[globalVars['curentMap'] + 'json'].map) + '" class="imgMap" width="' + globalVars[globalVars['curentMap'] + 'json'].width  + '" height="' + globalVars[globalVars['curentMap'] + 'json'].height + '"/>';
		mapWrap = getElement('mapWrap');
		mapWrap.children('div#map')
				.css({
					'width': globalVars[globalVars['curentMap'] + 'json'].width  + 'px',
					'height': globalVars[globalVars['curentMap'] + 'json'].height  + 'px',
					'top': globalVars[globalVars['curentMap'] + 'json'].posy  + 'px',
					'left': globalVars[globalVars['curentMap'] + 'json'].posx  + 'px'
				})
				.html(imgMap);

		// ajout du perso
		if (globalVars[globalVars['curentMap'] + 'json']['joueur'] != undefined) {
			var joueur = globalVars[globalVars['curentMap'] + 'json']['joueur'];

			joueur.height = 120;
			joueur.width = 120;
			joueur.ressource = 'sprites-perso' + globalVars['usePerso'];
			var joueurobj = '<div id="joueur" class="sprite" style="top:' + joueur.posy * globalVars['multipleScreen'] + 'px;left:' + joueur.posx * globalVars['multipleScreen'] + 'px; width:' + joueur.width * globalVars['multipleScreen'] + 'px;height:' + joueur.height * globalVars['multipleScreen'] + 'px;"><div class="sprite" style="width:' + joueur.width * globalVars['multipleScreen'] + 'px;height:' + joueur.height * globalVars['multipleScreen'] + 'px;"></div><div class="curseur" style="position:absolute;top:' + 60 * globalVars['multipleScreen'] + 'px;left:' + 30 * globalVars['multipleScreen'] + 'px; width:' + globalVars['multipleScreen'] * 60 + 'px;height:' + globalVars['multipleScreen'] * 60 + 'px;"></div></div>';

			mapWrap.children('div#map').append(joueurobj);
			$('#joueur .sprite').animateSprite({
				src: getLocalRessources(joueur.ressource),
				sw: '120',
				sh: '120',
				nbc: '100',
				nbl: '16',
				'anims': globalVars['shema-perso' + globalVars['usePerso']],
				fps: globalVars['shema-perso' + globalVars['usePerso']].fps,
				redim: true
			});
			$('#joueur .sprite').animateSprite('play', globalVars[globalVars['curentMap'] + 'json'].joueur.direction);

		}

		// On ajoute les points d'interets
		for (interet in globalVars[globalVars['curentMap'] + 'json'].interets) {
			var obj = globalVars[globalVars['curentMap'] + 'json'].interets[interet];
			if (obj.ressource.indexOf('sprites') >= 0) {
				// on redéfini les taille si on est sur écran large
			}
			var objectInteret = '<div id="' + interet + '" class="sprite" style="top:' + obj.posy * globalVars['multipleScreen'] + 'px;left:' + obj.posx * globalVars['multipleScreen'] + 'px; width:' + obj.width * globalVars['multipleScreen'] + 'px;height:' + obj.height * globalVars['multipleScreen'] + 'px;">';
			if (obj.action != undefined) {
				objectInteret += '<div class="hitbox" style="position:absolute;top:' + obj.action.hitbox.x * globalVars['multipleScreen'] + 'px;left:' + obj.action.hitbox.y * globalVars['multipleScreen'] + 'px;width:' + obj.action.hitbox.w * globalVars['multipleScreen'] + 'px;height:' + obj.action.hitbox.h * globalVars['multipleScreen'] + 'px;z-index:31;" onmousedown="' + obj.action.fct + '" ontouchstart="' + obj.action.fct + '"></div><div class="curseur" style="position:absolute;top:' + obj.action.posy * globalVars['multipleScreen'] + 'px;left:' + obj.action.posx * globalVars['multipleScreen'] + 'px; width:' + globalVars['multipleScreen'] * 60 + 'px;height:' + globalVars['multipleScreen'] * 60 + 'px;">';
			}
			objectInteret += '</div></div>';
			// on ajoute les animations des points d'interet
			/* @fixme : a gérer les aniamtions par rapport au shema */
			mapWrap.children('div#map').append(objectInteret);
			$('#' + interet).animateSprite({
				src: getLocalRessources(obj.ressource),
				sw: '120',
				sh: '120',
				nbc: '20',
				nbl: '1',
				'anims': {'X0': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]},
				fps: 12,
				redim: true
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
			fps: 12,
			redim: true
		});

		getElement('checkUpdateApps').fadeOut().parent().animate({'height': '0px'}, 500, function() {
			getElement('illuMap').fadeIn().delay(100).fadeOut(function() {
				$(this).remove();
			});
			$(this).remove();
		});
	}
}

function checkEndLaodMap() {
	nbDo++;
	if (endload && nbToDo == nbDo) {
		loadMap();
	}
}