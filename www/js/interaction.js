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
					openTextInteraction(lang('paulfirst'), 'Close');
					dump(ressources["portrait-perso"+globalVars['usePerso']+"-1"]);
					getElement('portraitG').css({
						'background':'url('+getLocalRessources("portrait-perso"+globalVars['usePerso']+"-1")+') no-repeat bottom left',
						'background-size':'contain'
					}).addClass('flip').animate({
						'left':'0'
					});
					globalVars['save']['interaction']['tuto']['paul'] = 2;
					break;
				case 2:
					setTimeout(function(){globalVars['gamePause'] = false;},500);
					break;
			}
			break;
	}
}

function openTextInteraction($text, $btn) {
	globalVars['gamePause'] = true;
	var blurAll = getElement('blurall');
	blurAll.fadeIn(300);
	var textInteraction = getElement('textInteraction');
	$('#textInteraction div.text').html($text);
	if (textInteraction.children('div.container').css('bottom') < '-2px') {
		$('#textInteraction .btn' + $btn + 'TextInteraction').show();
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
			getElement('blurall').fadeOut('slow').remove();
			globalVars['gamePause'] = false;
		});
	})
}