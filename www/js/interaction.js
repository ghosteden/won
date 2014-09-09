function interaction(name){
	switch (name){
		case 'startTuto':
			//vidéo d'arriver du tuto
			interaction('firstDialogue');
			break;
		case 'firstDialogue':
			openTextInteraction(lang('tutoFirstDialogue'), 'Close');
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
			$(this).animate({'bottom': '-2px'},150, function() {
				$(this).children('div.btn-box').animate({'right': '0px'}, 150);
			});
		});
	}
}

function closeTextInteraction() {
	getElement('textInteraction').children('div.container').animate({'bottom': '20px'}, 100, function() {
		$(this).animate({'bottom': '-200px'}, 300, function() {
			getElement('textInteraction').remove();
			globalVars['gamePause'] = false;
			getElement('blurall').fadeOut('slow').remove()
		});
	})
}