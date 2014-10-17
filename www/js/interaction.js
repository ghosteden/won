function interaction(name) {
	globalVars['gamePause'] = true;
	$('#intercomWrap').animate({'left':'-20%'});
	switch (name) {
		case 'startTuto':
			//vidéo d'arriver du tuto
			interaction('firstDialogue');
			break;
        case 'firstDialogue':
			openTextInteraction(lang('tutoFirstDialogue'), 'Close');
			break;
		case 'paul':
			if (save[globalVars['gameEmplacement']]['interaction']['paul'] == undefined) {
				save[globalVars['gameEmplacement']]['interaction']['paul'] = 1;
			}
			switch (save[globalVars['gameEmplacement']]['interaction']['paul']) {
				case 1:
				var blurDarckAll = getElement('blurDarckAll');
				blurDarckAll.fadeIn(300, function() {
				// on repositione le joueur
				repositionJoueur('Paul');
						//affichage ici de l'image de fond
						getElement('portraitD1','portraitD','img').attr({
							//image de paul
							'src': getLocalRessources("portrait-perso1-1"),
						}).animate({
							'right': '0',
							'opacity': 1,
						});
						getElement('portraitG1','portraitG','img').attr({
							'src': getLocalRessources("portrait-perso" + globalVars['usePerso'] + "-1"),
						}).addClass('flip').animate({
							'left': '0',
							'opacity': 1,
						}, function() {
							openTextInteraction(lang('paulfirst'), 'Close', "$('#portraitD2').remove();$('.portraitG').animate({'left':'-40%', 'opacity':0},function(){$(this).remove()});$('.portraitD').animate({'right':'-40%', 'opacity':0},function(){$(this).remove();closeTextInteraction();});");
						}).animate({'left': '0'}, 1000, function() {
							getElement('portraitD2','portraitD','img').attr({
								//image de paul
								'src': getLocalRessources("portrait-perso1-2"),
							}).css({
								'right':0,
								'opacity': 1,
							})
						});
						save[globalVars['gameEmplacement']]['interaction']['paul'] = 2;
					});
					save['tuto']['etape'] = 1;
					switchMenu('tuto');
					addMessage('tuto1');
					break;
				case 2:
					interaction('paulAttend1');
					break;
				case 3:
					setTimeout(function() {
						globalVars['gamePause'] = false;
					}, 500);
					break;
			}
			break;
		case 'paulAttend1':
			var blurDarckAll = getElement('blurDarckAll');
			blurDarckAll.fadeIn(300, function() {
				// on repositione le joueur
				repositionJoueur('Paul');
				//affichage ici de l'image de fond
				getElement('portraitD1','portraitD','img').attr({
					//image de paul
					'src': getLocalRessources("portrait-perso1-1"),
				}).animate({
					'right': '0',
					'opacity': 1,
				});
				getElement('portraitG1','portraitG','img').attr({
					'src': getLocalRessources("portrait-perso" + globalVars['usePerso'] + "-1"),
				}).addClass('flip').animate({
					'left': '0',
					'opacity': 1,
				}, function() {
					openTextInteraction(lang('paulattend'), 'Next', "interaction('paulAttend2')");
				}).animate({
					'left': '0',
					'opacity': 1,
				}, 1000, function() {
					getElement('portraitD2','portraitD','img').attr({
						//image de paul
						'src': getLocalRessources("portrait-perso1-2"),
					}).css({
						'opacity':1,
						'right':0,
					})
				});
			});
			break;
		case 'paulAttend2':
			$('#textInteraction div.btn-box').animate({'right': '-10%'}, 200, function() {
				$('#textInteraction .btnNextTextInteraction').hide();
				$('#textInteraction .btnCloseTextInteraction').show();
				$('#textInteraction div.btn-box').animate({'right': '0px'}, 200);
			});
			var $callback = "$('.portraitD').animate({'right':'-40%', 'opacity':0},function(){$(this).remove()});$('#portraitG4').remove();$('.portraitG').animate({'left':'-40%','opacity':0},function(){$(this).remove();closeTextInteraction();});";
			$('#textInteraction .btnCloseTextInteraction').attr('onclick', $callback);
			$('#textInteraction .btnCloseTextInteraction').attr('ontouchend', $callback);
			getElement('portraitD2').remove();
			getElement('portraitG3','portraitG', 'img').attr({
				'src': getLocalRessources("portrait-perso" + globalVars['usePerso'] + "-3"),
			}).addClass('flip').css({'opacity':1,'left':0});
			$('#textInteraction div.text').fadeOut(function(){$('#textInteraction div.text').html(lang('paulattend2')).fadeIn('fast', function() {
				getElement('portraitG4','portraitG', 'img').addClass('flip').attr({
					'src': getLocalRessources("portrait-perso" + globalVars['usePerso'] + "-4"),
				}).css({'opacity':1,'left':0});
			});
			});
			break;
	}
}

function animatePersonnage($persoG, $persoD, $expressionStartG, $expressionStartD, $expressionEndG, $expressionEndD, $text, $after){
	
}

function repositionJoueur(interet){
	var obj = globalVars[globalVars['curentMap'] + 'json'].interets[interet];
	$('#joueur').css({
		'top':obj.joueur.posy * globalVars['multipleScreen'],
		'left':obj.joueur.posx * globalVars['multipleScreen'],
	});
	$('#joueur .sprite').animateSprite('play',obj.joueur.direction);
}

function openTextInteraction($text, $btn, $callback) {
	globalVars['gamePause'] = true;
	var blurDarckAll = getElement('blurDarckAll');
	blurDarckAll.fadeIn(300);
	var textDialogue = getElement('textDialogue');
	$('#textDialogue div.text').html($text);
	
	$('#textDialogue .btn' + $btn).show();
	if ($callback) {
		if ($callback.indexOf('closeTextInteraction()') < 0 && $btn == 'Close') {
			$callback += 'closeTextInteraction();';
		}
		$('#textDialogue .btn' + $btn).attr('onclick', $callback);
		$('#textDialogue .btn' + $btn).attr('ontouchend', $callback);
	}
}

function openTextInteractionold($text, $btn, $callback) {
	globalVars['gamePause'] = true;
	var blurAll = getElement('blurall');
	blurAll.fadeIn(300);
	var textInteraction = getElement('textInteraction');
	$('#textInteraction div.text').html($text);
	if (textInteraction.children('div.container').css('bottom') < '-2px') {
		$('#textInteraction .btn' + $btn + 'TextInteraction').show();
		if ($callback) {
			if ($callback.indexOf('closeTextInteraction()') < 0 && $btn == 'Close') {
				$callback += 'closeTextInteraction();';
			}
			$('#textInteraction .btn' + $btn + 'TextInteraction').attr('onclick', $callback);
			$('#textInteraction .btn' + $btn + 'TextInteraction').attr('ontouchend', $callback);
		}
		textInteraction.children('div.container').animate({'bottom': '20px'}, '400', function() {
			$(this).animate({'bottom': '-2px'}, 150, function() {
				$(this).children('div.btn-box').animate({'right': '0px'}, 150);
			});
		});
	}
}

function closeTextInteraction() {
	getElement('textInteraction').children('div.container').animate({'bottom': '20px'}, 100, function() {
		$(this).animate({'bottom': '-200px'}, 300, function() {
			getElement('textInteraction').remove();
			getElement('blurall').delay('100').fadeOut('slow', function() {
				getElement('blurall').remove()
			});
			globalVars['gamePause'] = false;
			$('#intercomWrap').animate({'left':'0'});
		});
	})
}