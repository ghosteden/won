/*
 * Listes de fonction utilisé pour le débug ou pour le jeu
 * certaine fonction nécéssite jquery
 */

/*
 * @function var_dump(obj)
 * @param {object} obj
 * @returns {undefined}
 * @description sert a renvoyer une alert contenant les diférentes informations d'un objets
 */
function var_dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }

    alert(out);

    // or, if you wanted to avoid alerts...

    var pre = document.createElement('pre');
    pre.innerHTML = out;
    document.body.appendChild(pre);
}

/*
 * @function getLocalData()
 * @returns {undefined}
 * @description récupère les infos de config si elle esxiste et créer un nouveau table dans le cas inverse
 */
function getLocalData(FILE, callback, dataDefault, callbackIfNotExist, distantFile, paramsForGet) {
    var dataDefault = dataDefault || '';
    var distantFile = distantFile || '';
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getFile(globalVars['localStoragePath'] + FILE + ".json", {create: true, exclusive: false}, function(fileEntry) {
			fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    if (evt.target.result == '') {
                        /*
                         * Le fichier est vide ou innexistant
                         * Si le paramètre dataDefault est remplit on créer le fichier avec ces données
                         * Sinon on fait une requette au serveur pour récupéré le fichier équivalant
                         */
                        if (dataDefault != '') {
                            globalVars[FILE] = dataDefault;
                            if (callbackIfNotExist) {
                                callbackIfNotExist();
                            } else {
                                // la fonction recordData() va se charger de l'ecriture des donées
                                recordLocalData(FILE, globalVars[FILE]);
                            }
                        } else {
                            //faire la requette ajax pour récup les données
                            $.get(distantFile, paramsForGet,
                                    function(data) {
                                        globalVars[FILE] = JSON.parse(data);
                                        // la fonction recordData() va se charger de l'ecriture des donées
                                        recordLocalData(FILE, globalVars[FILE]);
                                        if (callbackIfNotExist) {
                                            callbackIfNotExist();
                                        }
                                    });
                        }
                    } else {
                        globalVars[FILE] = JSON.parse(evt.target.result);
                        // Si le paramètre collback exist on l'appel
                        if (callback) {
                            callback();
                        }
                    }
                };
                reader.readAsText(file);
            });
        });
    });
}

/*
 * @function recordLocalData()
 * @returns {undefined}
 * @description enregistre les configs local
 */
function recordLocalData(FILE, DATA) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getFile(globalVars['localStoragePath'] + FILE + ".json", {create: true, exclusive: false}, function(fileEntry) {
            fileEntry.createWriter(function(writer) {
                writer.onwrite = function(evt) {
                };
                writer.write(JSON.stringify(DATA));
            }, function() {
                signal('erreurApp' + lang("erreurWriteFile"), function() {
                    exitApps();
                });
                navigator.notification.vibrate(150);
                waitdelay(250);
                navigator.notification.vibrate(150);
            });
        });
    });
}

/*
 * @function switchLang(lang = 'FR')
 * @param {string} lang
 * @returns {undefined}
 */
function switchLang(lang, callback) {
    var lang = lang || 'FR';
    globalVars['config'].lang = lang;
    globalVars['lang'] = lang;
    recordLocalData('config', globalVars['config']);
    if (callback) {
        callback();
    }
}

/*
 * @function checkConnection()
 * @returns {undefined}
 * @description retourn le nom du type de connection
 */
function checkConnection() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'nothing';
    states[Connection.ETHERNET] = 'wifi';
    states[Connection.WIFI] = 'wifi';
    states[Connection.CELL_2G] = 'data';
    states[Connection.CELL_3G] = 'data';
    states[Connection.CELL_4G] = 'data';
    states[Connection.NONE] = 'nothing';

    return states[networkState];
}

/*
 * @function onBackButton()
 * @returns {undefined}
 * @description bloque le bouton retour et demande la confirmation pour quitter l'apps
 */
function onBackButton() {
    if ($('#intercom').length > 0) {
        var btn = '<div class="button" ontouchend="exitApps()">' + lang('btnExit') + '</div>';
        signal(lang('demandeExit') + btn);
    }
}

/*
 * @function onMenuButton()
 * @returns {undefined}
 * @description met le jeu en pause le temps que le joueur se balade dans son tel
 */
function onHomeButton() {
    if ($('#intercom').length > 0) {
        globalVars['noCloseIntercom'] = true;
        signal(lang('gamePause'));
    }
    gamePause();
}

function gameResume() {
    for (var mediaName in globalVars['loopAudio']) {
        if (globalVars['loopAudio'][mediaName] == 1) {
            playLoopAudio(mediaName, globalVars['loopAudioTime']);
        }
    }
    globalVars['gamePause'] = false;
}

function gamePause() {
    for (var mediaName in globalVars['loopAudio']) {
        if (globalVars['loopAudio'][mediaName] == 1) {
            stopAudio(mediaName);
        }
    }
    globalVars['gamePause'] = true;
}

/*
 * @function onSearchButton()
 * @returns {undefined}
 * @ouvre ou ferme l'intercom
 */
function onMenuButton() {
    if ($('#intercom').length > 0) {
        if (globalVars['intercomIsOpen'] && !globalVars['closingIntercom']) {
            closeIntercom();
        } else {
            if (!globalVars['openingIntercom'])
                openIntercom();
        }
    }
}

/*
 * @function online()
 * @returns {undefined}
 * @description si la connection reviens
 */
function online() {
    if ($('#intercom').length > 0) {
        globalVars['connectionType'] = checkConnection();
        globalVars['isConnected'] = true;
        globalVars['connectionType'] = checkConnection();
        hideMinLoad();
        if ($('#intercom .status .connection img').length > 0)
            $('#intercom .status .connection img').attr('src', 'img/' + globalVars['connectionType'] + '.png');
    }
}

/*
 * @function online()
 * @returns {undefined}
 * @description si la connection est perdu
 */
function offline() {
    if ($('#intercom').length > 0) {
        signal(lang('offline'));
        navigator.notification.vibrate(150);
        globalVars['isConnected'] = false;
        globalVars['connectionType'] = 'nothing';
        showMinLoad();
        if ($('#intercom .status .connection img').length > 0)
            $('#intercom .status .connection img').attr('src', 'img/' + globalVars['connectionType'] + '.png');
    }
}

/*
 * @function number_format (number, decimals, dec_point, thousands_sep)
 * @param {float} number
 * @param {int} decimals
 * @param {string} dec_point
 * @param {string} thousands_sep
 * @returns {unresolved}
 * @description permet de format l'écriture des nombre
 */
function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? ' ' : dec_point,
            s = '',
            toFixedFix = function(n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

/*
 * @function dump(obj = object)
 * @description renvoie les info de l'élément et/ou sont contenu dans la div log qui doit être créer
 */
function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }
    getElement('log').html(obj);
}

/*
 * @function verifLiveText(obj)
 * @param {jQuery object} obj
 * @returns {undefined}
 * @description verifie le format en live et supprime les caractère interdit
 */
function verifLiveText(obj, patern) {
    var text = obj.val();
    var testpatern = patern.substr(2, patern.length - 3);
    if (testpatern.indexOf(",") < 0) {
        text = text.replace(",", '');
    }
    if (testpatern.indexOf(";") < 0) {
        text = text.replace(";", '');
    }
    if (testpatern.indexOf(":") < 0) {
        text = text.replace(":", '');
    }
    if (testpatern.indexOf("?") < 0) {
        text = text.replace("?", '');
    }
    if (testpatern.indexOf(".") < 0) {
        text = text.replace(".", '');
    }
    if (testpatern.indexOf("/") < 0) {
        text = text.replace("/", '');
    }
    if (testpatern.indexOf("-") < 0) {
        text = text.replace("-", '');
    }
    if (testpatern.indexOf("_") < 0) {
        text = text.replace("_", '');
    }
    if (testpatern.indexOf("=") < 0) {
        text = text.replace("=", '');
    }
    if (testpatern.indexOf("+") < 0) {
        text = text.replace("+", '');
    }
    if (testpatern.indexOf("[") < 0) {
        text = text.replace("[", '');
    }
    if (testpatern.indexOf("\\") < 0) {
        text = text.replace("\\", '');
    }
    if (testpatern.indexOf("^") < 0) {
        text = text.replace("^", '');
    }
    if (testpatern.indexOf("@") < 0) {
        text = text.replace("@", '');
    }
    if (testpatern.indexOf("]") < 0) {
        text = text.replace("]", '');
    }
    obj.val(text.replace(new RegExp(patern, "g"), ''));
}

function is_email(email) {
    var result = email.search(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,3})+$/);
    if (result > -1) {
        return true;
    } else {
        return false;
    }
}

/*
 * @function getElement(ID = string)
 * @return obj
 * @description vérifie si un objet existe dans le document si il n'existe pas il sera créer selon un switch
 */
function getElement(ID, Class, type) {
    if (ID == undefined) {
        ID = '';
    }
    if (Class == undefined) {
        Class = '';
    }
    if (type == undefined) {
        type = 'div';
    }
    if (ID != '' && $('#' + ID).length) {
        return $('#' + ID);
    } else if (Class != '' && $('.' + Class).length) {
        return $('.' + Class);
    } else {
//l'élément n'existe pas on le créer

//le switch permet la création d'élément spécifique, si non précisé ou non trouver dans la liste sa créer un element div dans le body
        switch (Class) {
            /* on cherche dans les class pour créer l'élément
             * exemple
             * case 'cartes':
             *     break;
             */
            /*
             * loadBar est la barre de chargement en début de chargment de l'appli
             * le temps de vérifier la version, les fichiers etc...
             * c'est une image gif qui appartient à l'appli
             * Calcul du la position left
             * on prend 80% de la largeur de l'ecran
             * si > 1000 px alors on block a 1000px
             * On calcul la hauteur de l'objet en même temps
             * On calcul ensuite la diférence de la largeur 
             * de l'objet et de la largeur de l'ecran
             * on divise le tout par 2 pour centrer l'objet
             */
            case 'loadBar':
                var calcleft = globalVars['screenW'] * 0.8;
                if (calcleft > 1000)
                    calcleft = 1000;
                var imgheight = calcleft * 172 / 1066;
                calcleft = (globalVars['screenW'] - calcleft) / 2;
                var elem = '<div class="loadBar" style="background:url(' + "'img/barre_chargement.gif'" + ') no-repeat center center;background-size:cover;left:' + calcleft + 'px;" data-height="' + imgheight + '"/></div>';
                $('body').append(elem);
                return $('.' + Class);
                break;
            default :
                switch (ID) {
                    /* si class non défini on cherche avec les ID
                     * exemple
                     * case 'magie1':
                     *     break;
                     */
                    case 'checkUpdateApps':
                        var elem = '<div id="' + ID + '" class="' + Class + '"></div>';
                        $('.loadBar').append(elem);
                        return $('#' + ID);
                        break;
                        /* Signal correspond au boite de dialogue 
                         * Il permet le callback sur la fermeture de celle-ci
                         */
                    case 'signal':
                        var elem = '<div id="' + ID + '"><div class="closeSignal" ontouchend="closeSignal()"></div><div class="text"></div></div>';
                        $('body').append(elem);
                        return $('#' + ID);
                        break;
                        /*
                         * Le controleur pour le mode pve
                         */
                    case 'controleur':
                        var elem = '<div id="controleur"><div id="backControleur"></div><div id="centerControleur"></div></div>';
                        $('body').append(elem);
                        return $('#' + ID);
                        break;
                        /*
                         * connectLoad
                         * petit symbole de chargement
                         */
                    case 'minLoad':
                        var elem = '<div id="minLoad">\n\
                                    <img class="back" src="img/minload-back.png"/>\n\
                                    <img class="front" src="img/minload-front.png"/>\n\
                                    </div>';
                        $('body').append(elem);
                        return $('#' + ID);
                        break;
                        /*
                         * connectLoad
                         * grand symbole de chargement pour les attente des formulaire par exemple
                         */
                    case 'intercomLoad':
                        var elem = '<div id="intercomLoad">\n\
                                    <img style="width:' + globalVars['screenH'] / 2 + 'px; margin-left:' + globalVars['screenH'] / -4 + 'px;" class="back" src="img/minload-back.png"/>\n\
                                    <img style="width:' + globalVars['screenH'] / 2 + 'px; margin-left:' + globalVars['screenH'] / -4 + 'px;" class="front" src="img/minload-front.png"/>\n\
                                    </div>';
                        $('body').append(elem);
                        return $('#' + ID);
                        break;
                        /*
                         * L'intercom
                         * A la création on le fait apparaitre a gauche
                         */
                    case 'intercom':
                        var elem = '<div id="intercom">\n\
                                        <div class="open" ontouchend="openIntercom()"></div>\n\
                                        <div class="close" ontouchend="closeIntercom()"></div>\n\
                                        <img src="img/intercom/intercom_1.png" class="background background1"/>\n\
                                        <img src="img/intercom/intercom_2.png" class="background background2"/>\n\
                                        <img src="img/intercom/intercom_3.png" class="background background3"/>\n\
                                        <img src="img/intercom/intercom_4.png" class="background background4"/>\n\
                                        <img src="img/intercom/intercom_5.png" class="background background5"/>\n\
                                        <img src="img/intercom/intercom_6.png" class="background background6"/>\n\
                                        <img src="img/intercom/intercom_7.png" class="background background7"/>\n\
                                        <img src="img/intercom/intercom_7.png" class="background background8"/>\n\
                                        <img src="img/intercom/intercom_7.png" class="background background9"/>\n\
                                        <div class="screen">\n\
                                            <div class="content">\n\
                                                <div class="status bar">\n\
                                                    <div class="namePlayer">' + globalVars['config'].login + '</div>\n\
                                                    <div class="connection"><img src="img/nothing.png"/></div>\n\
                                                    <div class="time"></div>\n\
                                                </div>\n\
                                                <hr class="status separateur"/>\n\
                                                <div class="main">\n\
                                                </div>\n\
                                            </div>\n\
                                        </div>\n\
                                    </div>';
                        $('body').append(elem);
                        getTimeIntercom();
                        $('#' + ID).animate({'left': '0px'}, 500, function() {
                            globalVars['intercomposition'] = 1;
                            openIntercom();
                        });

                        //parametre la taille de l'ecran
                        globalVars['screenIntercomH'] = $('#intercom').height();
                        globalVars['screenIntercomW'] = globalVars['screenW'] - 110;

                        $('#intercom .screen .status').css('font-size', globalVars['screenH'] * 0.08);
                        $('#intercom .screen .connection').css('height', globalVars['screenH'] * 0.1);
                        return $('#' + ID);
                        break;
                    default :
                        // si on trouve toujours rien on créer une div standard
                        var elem = '<div id="' + ID + '" class="' + Class + '"></div>';
                        $('body').append(elem);
                        return $('#' + ID);
                        break;
                }
                break;
        }
    }
}

/*
 * @function lang(langVar = string)
 * @return le contenue de la langue en fonction de la langue de l'application
 */
function lang(langVar) {
    if (globalVars['lang'] == 'FR') {
// Si le jeu est en FR
        return LANG_FR[langVar];
    } else {
// Si le jeu est en EN
        return LANG_EN[langVar];
    }
}

/*
 * @function exitApps()
 * @returns {undefined}
 * @description sert a quitté l'application
 */
function exitApps() {
    navigator.app.exitApp();
}

/*
 * function delay(ms = int)
 * @param {int} ms
 * @returns {undefined}
 * @description permet de faire une pause de x ms dans l'application
 */
function waitdelay(ms) {
    var end = new Date().getTime() + ms;
    while (end > new Date().getTime())
        ;
}

/*
 * @function signal(text = string)
 * @param {string} text
 * @returns {undefined}
 * @description créer une boite de dialogue fermable par la croix
 */
function signal(text, callback) {
    if (globalVars['intercomIsOpen'] && !globalVars['noCloseIntercom']) {
        closeIntercom();
        setTimeout(function() {
            signal(text, callback);
        }, 2000);
    } else {
        globalVars['noCloseIntercom'] = false;
        globalVars['gamePause'] = true;
        var cadre = getElement('signal');
        var blurAll = getElement('blurall');
        cadre.children('div.closeSignal').attr('ontouchend', 'closeSignal(' + callback + ')');
        cadre.children('div.text').html(text).show();
        blurAll.fadeIn(300);
        cadre.show();
    }
}

/*
 * @function closeSignal([callback = function])
 * @param {function} callback
 * @returns {undefined}
 * @description permet de fermer la fenetre signal
 *  lorsque l'utilisateur clique sur la croix,
 *  une fonction de callback peut alors être appelé
 */
function closeSignal(callback) {
    $('#signal').hide();
    if (!globalVars['intercomIsOpen']) {
        var blurAll = getElement('blurall');
        blurAll.fadeOut(150);
    }
    globalVars['gamePause'] = false;
    gameResume();
    if (callback) {
        callback();
    }
}

/*
 * @function veirfAllPathExist($path = sting chemin local)
 * @return bolean
 * @description Permet de créer un dossier avec ses récurences.
 */
function veirfAllPathExist($path) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        var $allpath = '';
        var arrayPath = $path.split('/');
        var erreur = true;
        for (key in arrayPath) {
            $allpath = $allpath + arrayPath[key] + '/';
            fileSystem.root.getDirectory($allpath, {create: true, exclusive: false}, function(dirEntry) {
            }, function(error) {
                erreur = false;
            });
        }
        waitdelay(2000);
        return erreur;
    });
}

/*
 * @function openIntercom()
 * @return nothing
 * @description ouvre l'intercom lorqu'on apuie sur le bouton
 * Tant qu'il est en ouvertur une variable le signal afin que 
 * si on rapuie sur le bouton pendant l'ouverture ou puisse refermer aussitot
 * une fois ouvert une variable est déclaré a true afin de le savoir ailleur
 */
function openIntercom() {
    if (globalVars['closingIntercom'] !== true && !globalVars['closingIntercom']) {
        globalVars['openingIntercom'] = true;
        $('#intercom .open').hide();
        playAudio('openIntercom');
    }
    if (globalVars['intercomposition'] < 9 && !globalVars['closingIntercom']) {
        globalVars['intercomposition']
        $('#intercom img.background' + globalVars['intercomposition']).hide();
        globalVars['intercomposition']++;
        $('#intercom img.background' + globalVars['intercomposition']).show();
        if (globalVars['intercomposition'] == 9) {
            $('#intercom .screen').show();
            $('#intercom .screen').animate({'width': globalVars['screenIntercomW']}, 200, function() {
                $('#intercom .screen').animate({'height': '100%', 'top': '0%'}, 250, function() {
                    globalVars['openingIntercom'] = false;
                    globalVars['intercomIsOpen'] = true;
                    globalVars['gamePause'] = true;
                    $('#intercom .close').show();
                    showContentIntercom();
                    $('#blurall').fadeIn(1000, function() {
                        traitParasiteButton();
                    });
                    $('#intercom .screen .main').css({'height': parseInt($('#intercom .screen .content').height()) - parseInt($('#intercom .screen .status.bar').height()) - parseInt($('#intercom .screen .status.separateur').height()) - 10 + 'px'});
                });
                $('#intercom .screen').delay(10).animate({'opacity': '0.6'}, 10).animate({'opacity': '1'}, 10);
            });
            $('#intercom .screen').delay(10).animate({'opacity': '0'}, 10).delay(10).animate({'opacity': '1'}, 10).delay(10).animate({'opacity': '0.2'}, 10).delay(30).animate({'opacity': '0.8'}, 10);
        }
        setTimeout("openIntercom()", 40);
    }


}

/*
 * @function showContentIntercom()
 * @returns {undefined}
 * @description affiche le contenu de l'écran
 */
function showContentIntercom() {
    if (!globalVars['hideContentIntercom']) {
        $('#intercom .screen .content').css({'height': $('#intercom .screen').height() * 0.95, 'width': $('#intercom .screen').width() * 0.95});
        $('#intercom .screen .content').fadeIn(60).animate({'opacity': '0.2'}, 30).animate({'opacity': '0.8'}, 30).animate({'opacity': '0.2'}, 30).animate({'opacity': '1'}, 30);
    }
}

/* 
 * @function closeIntercom()
 * @return nothing
 * @description ferme l'intercom
 */
function closeIntercom(callback) {
    if (globalVars['closingIntercom'] !== true && !globalVars['openingIntercom']) {
        globalVars['closingIntercom'] = true;
        $('.traitParasite').hide().remove();
        $('#intercom .close').hide();
        $('#intercom .screen .content').fadeOut(60);
    }
    if (globalVars['intercomposition'] > 1 && !globalVars['openingIntercom']) {
        if (globalVars['intercomposition'] == 9) {
            $('.traitParasite').hide().remove();
            $('#blurall').fadeOut(150);
            playAudio('closeIntercom');
            $('#intercom .screen').animate({'opacity': '0.6'}, 10).animate({'opacity': '1'}, 10);
            $('#intercom .screen').animate({'height': '10px', 'top': '50%'}, 400, function() {
                $('#intercom .screen').delay(30).animate({'opacity': '0'}, 10).delay(30).animate({'opacity': '1'}, 10).delay(30).animate({'opacity': '0.2'}, 10).delay(60).animate({'opacity': '0.8'}, 10);
                $('#intercom .screen').animate({'width': '0'}, 200, function() {
                    $('#intercom .screen').fadeOut(50);
                    $('#intercom img.background' + globalVars['intercomposition']).hide();
                    globalVars['intercomposition']--;
                    $('#intercom img.background' + globalVars['intercomposition']).show();
                    setTimeout("closeIntercom(" + callback + ")", 40);
                });
            });
        } else {
            $('#intercom img.background' + globalVars['intercomposition']).hide();
            globalVars['intercomposition']--;
            $('#intercom img.background' + globalVars['intercomposition']).show();
            setTimeout("closeIntercom(" + callback + ")", 40);
        }
    } else {
        globalVars['closingIntercom'] = false;
        $('#intercom .open').show();
        globalVars['intercomIsOpen'] = false;
        globalVars['gamePause'] = false;
        if (callback) {
            callback();
        }
    }
}

/*
 * @function getTimeIntercom()
 * @returns {undefined}
 * @description affiche l'heur sur l'intercom et l'actualise 
 */
function getTimeIntercom() {
    var $date = new Date();
    var h = $date.getHours();
    if (h < 10) {
        h = "0" + h
    }
    var m = $date.getMinutes();
    if (m < 10) {
        m = "0" + m
    }
    $('#intercom .status .time').html(h + ":" + m);

    globalVars['connectionType'] = checkConnection();
    $('#intercom .status .connection img').attr('src', 'img/' + globalVars['connectionType'] + '.png');

    setTimeout("getTimeIntercom()", 30000);
}

/*
 * @function createvideo(name = name of video, nbimage = nombre of screen, cover = true or false)
 * @param (string) name
 * @param (int) nbimage
 * @param (boolean) cover
 * @return nothing
 * @description créer un element vidéo qui contient l'enssemble des images du dossier
 * le dossier et les fichier doivent avoir le même nom
 * les fichier doivent etre en jpg
 * le nom des fichier fini par _nbimage 
 * exemple :  "video/video_1.jpg"
 */
function createvideo(name, nbimage, cover) {
    if (cover == undefined) {
        cover = true;
    }
    cover = cover ? "cover" : "contain";
    var video = getElement('video', 'hidden');
    var source = '';
    for (i = 1; i < nbimage; i++) {
        source = source + '<div class="hidden frame' + i + '" style="background:url(' + "'video/" + name + "/" + name + "_" + i + ".jpg')" + ' no-repeat center center; background-size:' + cover + ';"></div>';
    }
    video.html(source);
}

/*
 * @function videoplay(objvideo, ips, time, callback, curentframe)
 * @param {objvideo} jquery object
 * @param ips {int} option 
 * si renseigné définira le nombre d'ips de lecture 25 par defaut
 * @param time {int} option
 * si renseigné alors définira le nombre d'ips
 * @param callback {int} option
 * fonction appelé lors de la fin de la vidéo
 * @param curentframe {int} ne pas renseigner 
 * utilisé par la fonction n'est pas a remplir
 * @description lecteur video
 * permet de lire la vidéa charger par createvideo()
 */
function videoplay(objvideo, ips, time, callback, curentframe) {
    if (objvideo == undefined || objvideo == '') {
        objvideo = $('#video');
    }

    if (ips == undefined || ips == '') {
        ips = 25;
    }

    if (time == undefined || time == '') {
        time = '';
    } else {
        ips = time / objvideo.children('div').length;
    }

    if (curentframe == undefined) {
        curentframe = 0;
    }

    if (curentframe == 0 || objvideo.children('div.frame' + curentframe).length) {
        if (curentframe > 0) {
            objvideo.children('div.frame' + curentframe).hide();
        } else {
            objvideo.show();
        }
        curentframe++;
        objvideo.children('div.frame' + curentframe).show();
        setTimeout(function() {
            videoplay(objvideo, ips, time, callback, curentframe);
        }, 1000 / ips);
    } else {
        if (callback) {
            callback();
        }
    }
}


/*
 * 
 * @param {path of file} src
 * @returns {Media|createAudio.my_media}
 */
function createAudio(name) {
//    var path = window.location.pathname;
//    path = path.substr(path, path.length - 10);
//    if (path.indexOf("file://") === 0) {
//        path = path.substring(7);
//    }
//    var localsrc = path + 'audio/' + name + '.mp3';
//    var my_media = new Media(localsrc, function() {
//    });
//    return my_media;
}

/*
 * 
 * @param {type} error
 * @returns {undefined}
 */
//function onError(error) {
//    alert('code: ' + error.code + '\n' +
//            'message: ' + error.message + '\n');
//}

/*
 * 
 * @param {media} my_media
 * @returns {undefined}
 */
function playAudio(name) {
//    var my_media = globalVars['audio'][name] || createAudio(name);
//    globalVars['audio'][name] = my_media;
//    my_media.play();
}

function playLoopAudio(name, timeLoop) {
//    globalVars['loopAudio'][name] = globalVars['loopAudio'][name] || 1;
//    globalVars['loopAudioTime'][name] = globalVars['loopAudioTime'][name] || timeLoop;
//    if (globalVars['loopAudio'][name] == 1 && !globalVars['gamePause']) {
//        playAudio(name);
//        setTimeout(function() {
//            playLoopAudio(name, timeLoop);
//        }, timeLoop);
//    }
}

/*
 * 
 * @param {media} my_media
 * @returns {undefined}
 */
function pauseAudio(name) {
//    var my_media = globalVars['audio'][name];
//    if (my_media) {
//        my_media.pause();
//    }
}

/*
 * 
 * @param {media} my_media
 * @returns {undefined}
 */
function stopAudio(name) {
//    var my_media = globalVars['audio'][name];
//    if (my_media) {
//        my_media.stop();
//    }
}

/*
 * @function blinkButton(btn = jQobject, callback = function)
 * @param {jQobject} btn
 * @param {function} callback
 * @returns {undefined}
 * @description fait clignoté un bouton lorsqu'on appuis dessus
 */
function blinkButton(btn, callback) {
    btn.animate({'opacity': '0.5'}, 1, function() {
        btn.delay(200).animate({'opacity': '1'}, 1, function() {
            if (callback) {
                callback();
            }
        });
    });
}

/*
 * @function showMinLoad()
 * @returns {undefined}
 * @description affiche le minLoad le chargement avec les deux cercles
 */
function showMinLoad(prefix) {
    var prefix = prefix || "min";
    var minLoad = getElement(prefix + 'Load');
    minLoad.show();
    animmeMinLoad();
}

/*
 * @function hideMinLoad()
 * @returns {undefined}
 * @description masque le minLoad si il existe
 */
function hideMinLoad(prefix) {
    var prefix = prefix || "min";
    if ($('#' + prefix + 'Load').length == 1 && $('#' + prefix + 'Load').css('display') != 'none') {
        $('#' + prefix + 'Load').hide();
    }
}

/*
 * @function minLoad()
 * @returns {undefined}
 * @description anim le minLoad
 * Les cercles tourneront dans les deux sens
 */
function animmeMinLoad(prefix) {
    var prefix = prefix || "min";
    if ($('#' + prefix + 'Load').length == 1 && $('#' + prefix + 'Load').css('display') != 'none' && globalVars['config'].hightFx) {
        var $rotation = Math.floor(Math.random() * 980);
        $('#' + prefix + 'Load').animate({
            borderSpacing: $rotation
        }, {
            step: function(now, fx) {
                $('#' + prefix + 'Load .back').css('-webkit-transform', 'rotate(' + now + 'deg)');
                $('#' + prefix + 'Load .back').css('-moz-transform', 'rotate(' + now + 'deg)');
                $('#' + prefix + 'Load .back').css('transform', 'rotate(' + now + 'deg)');

                $('#' + prefix + 'Load .front').css('-webkit-transform', 'rotate(' + now * -1 + 'deg)');
                $('#' + prefix + 'Load .front').css('-moz-transform', 'rotate(' + now * -1 + 'deg)');
                $('#' + prefix + 'Load .front').css('transform', 'rotate(' + now * -1 + 'deg)');
                if (now >= $rotation) {
                    animmeMinLoad(prefix);
                }
            },
            duration: $rotation * 10
        });
    }
}

/*
 * @function parasiteScreenIntercom()
 * @returns {undefined}
 * @description emet des parasite de manière aléatoire dans l'ecran de l'intercom
 * Ssi le screen est visible a l'ecran, s'il ne l'est pas la fonction s'eteind pour ne pas consomé de ressource inutilement.
 */
function parasiteScreenIntercom() {
    if ($('#intercom .screen').length && $('#intercom .screen').css('display') != 'none') {
        $('#intercom .screen .parasiteScreen').remove();
        $nb_parasite = parseInt(Math.floor(Math.random() * 500));
        var elem = '';
        var opacity = 1;
        var left = 0;
        var top = 0;
        if (parseInt(Math.floor(Math.random() * 5) + 1) > 2) {
            for (var i = 0; i < $nb_parasite; i++) {
                opacity = Math.random() - 0.2;
                left = Math.floor(Math.random() * globalVars['screenIntercomW']);
                top = Math.floor(Math.random() * globalVars['screenIntercomH']);
                elem = '<div class="parasiteScreen" style="opacity:' + opacity + ';left:' + left + 'px;top:' + top + 'px;box-shadow: 0px 0px 7px 1px rgba(23,225,57,' + opacity / 2 + ');"></div>';
                $('#intercom .screen').append(elem);
            }
            setTimeout(function() {
                parasiteScreenIntercom();
            }, 60);
        } else {
            setTimeout(function() {
                parasiteScreenIntercom();
            }, 200);
        }
        traitParasiteButton();
    } else {
        $('#intercom .screen .parasiteScreen').remove();
    }
}

/*
 * @function traitParasiteButton()
 * @returns {undefined}
 * @description
 */
function traitParasiteButton() {
    if ($('#intercom .screen').length && $('#intercom .screen').css('display') != 'none' && $('.button, input, .icone').length && globalVars['config'].hightFx && !globalVars['closingIntercom']) {
        var elem = '<div class="traitParasite"></div>';
        var objetcs = [];
        $('.button, input[type=text], input[type=password], select, .icone').each(function() {
            objetcs.push($(this));
        });
        var numelem = Math.floor(objetcs.length * Math.random())
        var object = objetcs[numelem];
        var topStart = 0;
        var topEnd = 0;
        if (Math.floor(Math.random() * 10) + 1 > 8) {
            if ($('.traitelem' + numelem).length < 1 && object.css('display') != 'none' && object.css('visibility') != 'hidden') {
                elem = '<div class="traitParasite traitelem' + numelem + '"></div>';
                $('body').append(elem);
                if (parseInt(Math.floor(Math.random() * 10) + 1) > 5) {
                    topStart = parseInt(object.offset().top) + 2;
                    topEnd = parseInt(object.offset().top) + parseInt(object.height()) + parseInt(object.css('padding-top')) + parseInt(object.css('padding-bottom')) + 2;
                } else {
                    topStart = parseInt(object.offset().top) + parseInt(object.height()) + parseInt(object.css('padding-top')) + parseInt(object.css('padding-bottom')) + 2;
                    topEnd = parseInt(object.offset().top) + 2;
                }
                $('.traitelem' + numelem).css({'top': parseInt(topStart) + 'px', 'width': object.width() + parseInt(object.css('padding-left')) + parseInt(object.css('padding-right')), 'left': parseInt(object.offset().left) + 1});
                $('.traitelem' + numelem).animate({'top': parseInt(topEnd) + 'px'}, (Math.floor(Math.random() * 2500)) + 1000, function() {
                    $('.traitelem' + numelem).remove();
                });
            }
        }
        setTimeout(function() {
            traitParasiteButton();
        }, 200);
    }
}

/*
 * @function temposubmit()
 * @return (nothing)
 * @description masque le bouton cliquer et affiche un loader
 */
function temposubmit() {
    if ($('.submit').length)
        $('.submit').css({'visibility': 'hidden'});
    var intercomLoad = getElement('intercomLoad');
    intercomLoad.show();
    animmeMinLoad('intercom');
}
/*
 * @function temposubmitEnd()
 * @return (nothing)
 * @description masque le loader et réaffiche le bouton submit
 */
function temposubmitEnd() {
    if ($('#intercomLoad').length && $('#intercomLoad').css('display') != 'none') {
        $('#intercomLoad').hide();
        if ($('.submit').length)
            $('.submit').css({'visibility': 'visible'});
    }
}

function controleurMove(angle) {
    if (globalVars['ctrlexist']) {
        // Version avec le curseu qui suit l'angle de direction
        if (angle < 0)
            angle = angle + 360;
        angle = angle + 90;
        $('#controleur').stop().animate({
            'border-spacing': angle + 'px'
        }, {
            step: function(now, fx) {
                $('#centerControleur').css('-webkit-transform', 'rotate(' + now + 'deg)');
                $('#centerControleur').css('-moz-transform', 'rotate(' + now + 'deg)');
                $('#centerControleur').css('transform', 'rotate(' + now + 'deg)');

                $('#backControleur').css('-webkit-transform', 'rotate(' + now * -1 + 'deg)');
                $('#backControleur').css('-moz-transform', 'rotate(' + now * -1 + 'deg)');
                $('#backControleur').css('transform', 'rotate(' + now * -1 + 'deg)');
            },
            duration: 1
        });
    }
}
