function interaction(name) {
	globalVars['gamePause'] = true;
	switch (name) {
		case 'startTuto':
			//vidéo d'arriver du tuto
			interaction('firstDialogue');
			break;
		case 'firstDialogue':
			openTextInteraction(lang('tutoFirstDialogue'), 'Close');
			break;
		case 'paul':
			if (globalVars['save']['interaction']['tuto']['paul'] == undefined) {
				globalVars['save']['interaction']['tuto']['paul'] = 1;
			}
			switch (globalVars['save']['interaction']['tuto']['paul']) {
				case 1:
					var blurAll = getElement('blurall');
					blurAll.fadeIn(300, function() {
						//affichage ici de l'image de fond
						getElement('portraitD').css({
							//image de paul
							'background-image': 'url(' + getLocalRessources("portrait-perso1-1") + ')',
						}).animate({
							'right': '0'
						});
						getElement('portraitG').css({
							'background-image': 'url(' + getLocalRessources("portrait-perso" + globalVars['usePerso'] + "-1") + ')',
						}).addClass('flip').delay('200').animate({
							'left': '0'
						}, function() {
							openTextInteraction(lang('paulfirst'), 'Close',"getElement('portraitG').animate({'left':'-40%'},function(){$(this).remove()});getElement('portraitD').css('background-image', 'url(' + getLocalRessources('portrait-perso1-1') + ')').delay('200').animate({'right':'-40%'},function(){$(this).remove();closeTextInteraction();});");
						}).animate({'left': '0'},1000,function(){
							getElement('portraitD').css({
								//image de paul
								'background-image': 'url(' + getLocalRessources("portrait-perso1-2") + ')',
							})
						});

						globalVars['save']['interaction']['tuto']['paul'] = 2;
					});
					break;
				case 2:
					setTimeout(function() {
						globalVars['gamePause'] = false;
					}, 500);
					break;
			}
			break;
	}
}

function openTextInteraction($text, $btn, $callback) {
	globalVars['gamePause'] = true;
	var blurAll = getElement('blurall');
	blurAll.fadeIn(300);
	var textInteraction = getElement('textInteraction');
	$('#textInteraction div.text').html($text);
	if (textInteraction.children('div.container').css('bottom') < '-2px') {
		$('#textInteraction .btn' + $btn + 'TextInteraction').show();
		if($callback){
			if($callback.indexOf('closeTextInteraction()') < 0){
				$callback += 'closeTextInteraction();';
			}
			$('#textInteraction .btn' + $btn + 'TextInteraction').attr('onclick',$callback);
			$('#textInteraction .btn' + $btn + 'TextInteraction').attr('ontouchend',$callback);
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
			getElement('blurall').delay('100').fadeOut('slow',function(){getElement('blurall').remove()});
			globalVars['gamePause'] = false;
		});
	})
}