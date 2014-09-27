/*
 * 
 * Fichiers de fonction d'initialisations de l'applications
 * La class app va créer l'application le reste permet de récupérer
 * les fichiers local ou distant afin de tout mettre en place pour lancer le jeu.
 */

/*
 * @class app
 * @type class
 * @description class d'initialisation de l'application
 */
var app = {
    // Contsrcteur de l'application
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    /*
     * onDeviceReady indique que l'appareil est pret a être utilisé on lance donc l'application
     */
    onDeviceReady: function() {
        // liste des event possible
        document.addEventListener("backbutton", onBackButton, false);
        document.addEventListener("menubutton", onMenuButton, false);
        document.addEventListener("pause", onHomeButton, false);
        document.addEventListener("online", online, false);
        document.addEventListener("offline", offline, false);
        window.plugins.insomnia.keepAwake();

        // on initialise certain variable en fonction des appareils
        if (screen.availWidth > screen.availHeight) {
            if (device.platform === "Android") {
                if (window.innerWidth != screen.availWidth) {
                    globalVars['hasPermanentKey'] = true;
                }
            }
            window.innerWidth = globalVars['screenW'] = screen.availWidth;
            window.innerHeight = globalVars['screenH'] = screen.availHeight;
        } else {
            if (device.platform === "Android") {
                if (window.innerWidth != screen.availHeight) {
                    globalVars['hasPermanentKey'] = true;
                }
            }
            window.innerWidth = globalVars['screenW'] = screen.availHeight;
            window.innerHeight = globalVars['screenH'] = screen.availWidth;
        }
        if (globalVars['hasPermanentKey']) {
            window.innerWidth = globalVars['screenW'] = globalVars['screenW'] - 100;
        }

        window.devicePixelRatio = 1;
        globalVars['typeScreen'] = 's';
        globalVars['multipleScreen'] = 1;
        if (globalVars['screenW'] > 1200) {
            globalVars['typeScreen'] = 'l';
            globalVars['multipleScreen'] = 2;
        }
        $('body').css({'width': globalVars['screenW'], 'height': globalVars['screenH'], 'font-size': globalVars['screenH'] * 0.04});
        if (device.platform === "Android") {
            globalVars['localStoragePath'] = 'Android/data/fr.nm3.WoN/files/';
        } else {
            globalVars['localStoragePath'] = '/';
        }
        globalVars['ressourcesPath'] = globalVars['localStoragePath'] + globalVars['ressourcesPath'];

        // Lorsque tout est pret on attend que le document soit pret
        $(document).ready(function() {
            // on essayer de créer le dossier ressources si il n'existe pas, ou on vérifie sont existance
            var retourcreat = veirfAllPathExist(globalVars['ressourcesPath']);
            waitdelay(2000);
            /*
             * On créer l'objet de config qui sera mis en local s'il n'existe pas déjà
             * On tente de récupéré le fichier de config local.
             * S'il n'existe pas on va demander la langue et on va enregistrer le fichier
             * Puis on lance l'application
             */
            globalVars['config'] = new Object();
            globalVars['config'].id_player = 0;
            globalVars['config'].login = '';
            globalVars['config'].lang = '';
            globalVars['config'].fastStart = false;
            globalVars['config'].hightFx = true;
            getLocalData('config', function() {
                if (globalVars['config'].lang != '') {
                    globalVars['lang'] = globalVars['config'].lang;
                    startApps();
                }
            }, globalVars['config'], function() {
                //Le fichier de config n'existe pas alors on demande la lang au joueur pour créer le fichier
                var choixlang = '<div class="button" ontouchend="switchLang(\'FR\',function(){closeSignal();startApps();});">Français ?</div>\n\
                        <div class="button" ontouchend="switchLang(\'EN\',function(){closeSignal();startApps();});">English ?</div>';
                signal(choixlang, function() {
                    switchLang();
                    startApps();
                });
            });
        });
    }
};

/*
 * @function startApps()
 * @returns {undefined}
 * @description cette fonction sert a afficher les animations de départ
 * l'anim nm³
 * l'anim du logo
 * puis appel la fonction checkUpdateApps
 */
function startApps() {
    $('#startframe').hide().remove();
    if (globalVars['config'].lang == '') {
        switchLang();
    }
    var fondmenup = getElement('fondmenup');
    if (globalVars['config'].fastStart) {
        fondmenup.fadeIn(500, function() {
            playLoopAudio('intro', 66100);
            checkUpdateApps();
        });
    } else {
        playAudio('nm3');
        createvideo('nm3', 97);
        $('body').css('background', '#000');
        videoplay($('#video'), 50, 4200, function() {
            fondmenup.show();
            stopAudio(globalVars['audio']['nm3']);
            $('#video').remove();
            playLoopAudio('intro', 66100);
            checkUpdateApps();
        });
    }
}


/*
 * @function checkUpdateApps()
 * @description vérifie si l'application du client est la dernière version
 * Si ce n'est pas le cas la fonction va télécharger et installer la dernière version
 * Cette fonction utilise trois plugin android :
 * File : permet la récupération/création de fichier (permet de créer un fichier qui servira au téléchargement du dernier apk)
 * Filetransfert : permet de télécharger (ici sert a télécharger le nouvelle apk)
 * WebIntent : permet de provoquer une intention (ici sert a lancer l'install de l'apk)
 * @fonctionement On fait un requete ajax grace a la fonction get de jquery pour vérifier si la version du jeu (variable en config.js)
 * est plus anciene que la version sur le fichier serveur. Si c'est le cas alors on télécharge la dernière version et on lance l'installation.
 */
function checkUpdateApps() {
    var loadBar = getElement('', 'loadBar');
    var divCheckUpdateApps = getElement('checkUpdateApps', 'infoLoadingScreen');
    var params = {"version": globalVars['appsVersion']};
    var url = globalVars['urlTestVersion'];
    var remoteFile = globalVars['urlLastApk'].replace('device', device.platform);
    // on écris un text pour dire qu'on vérifie les mise a jour
    loadBar.animate({'height': loadBar.attr('data-height') + 'px'}, 500, function() {
        divCheckUpdateApps.html(lang('verifLastUpdate')).fadeIn();
    });

    // fonction ajax qui va vérifié le fichier de version
    $.get(url, params, function(jData) {
        // Si l'ajax fonction c'est que le mobile est connecté
        globalVars['isConnected'] = true;
        //si le resultat est 'donwload' cela signifie que la version serveur est plus récente que la version de l'application
        var data = JSON.parse(jData);
        for (var ressourceTab in data.ressources) {
            ressources[ressourceTab] = data.ressources[ressourceTab];
        }
        if (data.donwload == 1) {
            //on signale au joueur qu'on télécharge la nouvelle version
            divCheckUpdateApps.fadeOut().html(lang('DLIsLoading')).fadeIn();
            //on recupéré le fichier systeme
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                //on créer un fichier qui s'appel won.apk dans le dossier download du téléphone
                fileSystem.root.getFile('download/won.apk', {create: true, exclusive: false}, function(fileEntry) {
                    waitdelay(1000);
                    signal(lang('appsNeedUpdate'));
                    navigator.notification.vibrate(150);
                    waitdelay(250);
                    navigator.notification.vibrate(150);
                    fileEntry.remove(function() {
                        waitdelay(3000);
                        fileSystem.root.getFile('download/won.apk', {create: true, exclusive: false}, function(fileEntry) {
                            var localPath = fileEntry.fullPath;
                            if (localPath.indexOf("file://") === 0) {
                                localPath = localPath.substring(7);
                            }
                            globalVars['localPathDLAPK'] = 'file://' + localPath;
                            // début du transfert
                            var ft = new FileTransfer();
                            ft.onprogress = function(progressEvent) {
                                if (progressEvent.lengthComputable) {
                                    divCheckUpdateApps.html(lang('DLIsLoading') + ' : ' + parseInt(((progressEvent.loaded / 2) / progressEvent.total) * 100) + '%');
                                }
                            };
                            ft.download(remoteFile, localPath, function() {
                                window.plugins.webintent.startActivity({
                                    action: window.plugins.webintent.ACTION_VIEW,
                                    url: globalVars['localPathDLAPK'],
                                    type: 'application/vnd.android.package-archive'
                                },
                                function() {
                                    // on renvoie false a l'appel pour signalé qu'une mise a jour à été faite
                                    return false;
                                },
                                        function() {
                                            signal('erreurApp' + 'Error launching app update', function() {
                                                exitApps()
                                            });
                                            navigator.notification.vibrate(150);
                                            waitdelay(250);
                                            navigator.notification.vibrate(150);
                                        });
                            }, function(evt) {
                                signal('erreurApp' + "Error downloading 1 APK: " + error.code, function() {
                                    exitApps()
                                });
                                navigator.notification.vibrate(150);
                                waitdelay(250);
                                navigator.notification.vibrate(150);
                            });
                        }, function(evt) {
                            signal('erreurApp' + "Error downloading 2 apk: " + evt.target.error.code, function() {
                                exitApps()
                            });
                            navigator.notification.vibrate(150);
                            waitdelay(250);
                            navigator.notification.vibrate(150);
                        });
                    });
                }, function(evt) {
                    signal('erreurApp' + "Error downloading 3 apk: " + evt.target.error.code, function() {
                        exitApps()
                    });
                    navigator.notification.vibrate(150);
                    waitdelay(250);
                    navigator.notification.vibrate(150);
                });
            }, function(evt) {
                signal('erreurApp' + "Error preparing to download apk: " + evt.target.error.code, function() {
                    exitApps()
                });
                navigator.notification.vibrate(150);
                waitdelay(250);
                navigator.notification.vibrate(150);
            });
        } else {
            // on maseque le message de vérif de mise a jour et on renvoi true pour signalé que l'appli été déja a jour.
            divCheckUpdateApps.fadeOut();
            // La version de l'appli est ok on vérifie les ressources
            updateFileRessources();
            return true;
        }
    }).fail(function() {
        signal(lang('noCallServeur'), function() {
            checkUpdateApps();
        });
        navigator.notification.vibrate(150);
        waitdelay(250);
        navigator.notification.vibrate(150);
    });
}

/*
 * @function updateFileRessources()
 * @return nothing
 * @description sert a vérifier les ressources manquante ou modifié par l'utilisateur.
 * on fait une vérif par rapport au fichier ressources.js si des fichier sont manquant ou de taille diférante
 */
function updateFileRessources() {
    // on change les textes de chargement
    var divCheckUpdateApps = $('#checkUpdateApps');
    divCheckUpdateApps.fadeOut(function() {
        divCheckUpdateApps.html(lang('verifFilesRessources')).fadeIn();
    });
    // on récupère le super objet fileSystem
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getDirectory(globalVars['ressourcesPath'], {create: true, exclusive: false}, function(dirEntry) {
            // Création de l'objet directory
            var directoryReader = dirEntry.createReader();
            // Récupère la liste des fichiers dans le dossier ressources
            directoryReader.readEntries(function(entries) {
                // on commence par supprimer toutes les ressources qui ne sont pas dans le fichier ressources du serveur
                // On créer églament un tableau au passage pour récupéré les info interéssante pour la suite
                globalVars['listOfEntries'] = [];
                globalVars['finish'] = 0;
                for (i = 0; i < entries.length; i++) {
                    var fileExist = false;
                    for (key in ressources) {
                        // Le fichier reste on l'ajoute au tableau avec ses données
                        if (ressources[key].name == entries[i].name) {
                            entries[i].file(function(obj) {
                                globalVars['listOfEntries'][obj.name] = {'name': obj.name, 'size': obj.size, 'path': obj.fullpath, 'lastModifiedDate': obj.lastModifiedDate};
                                globalVars['finish']++;

                                if (obj.size != ressources[key].size) {
                                    obj.remove();
                                }
                            });
                            fileExist = true;
                        }
                    }
                    if (!fileExist) {
                        //suppression du fichier inutile
                        entries[i].remove();
                        globalVars['finish']++;
                    }
                }
                waitFinishedCreateListOfEntries(entries.length);
            }, function(error) {
                signal('erreurApp1 ' + lang('erreurVerifFiles'), function() {
                    exitApps()
                });
                navigator.notification.vibrate(150);
                waitdelay(250);
                navigator.notification.vibrate(150);
            });

        }, function(error) {
            signal('erreurApp2 ' + lang('erreurVerifFiles'), function() {
                exitApps()
            });
            navigator.notification.vibrate(150);
            waitdelay(250);
            navigator.notification.vibrate(150);
        });
    });
}

/*
 * @function waitFinishedCreateListOfEntries(waitItem = var variable d'attente, equalItem = var a quoi l'objet d'attente doit etre égale pour arreté l'attent)
 * @param {string} waitItem
 * @param {string} equalItem
 * @returns {undefined}
 * @description lorsque waitItem est égale a equalItem la fonction arrete de tourné en boucle.
 * Le fait qu'elle tourn en boucle permet de créer une attent.
 * cette fonction sert pour la récupération des infos des fichier lors de l'initialisation de l'apk
 * la methode file de l'objet file est asynchrone
 * Lorsque la boucle s'arete on exécute la fonction downloadfileressource
 */
function waitFinishedCreateListOfEntries(equalItem) {
    setTimeout(function() {
        if (globalVars['finish'] >= equalItem)
            downloadFileRessources();
        else
            waitFinishedCreateListOfEntries(equalItem);
    }, 1000);
}

/*
 * @downloadFileRessources()
 * @returns {undefined}
 * @description lit les fichier locoal et télécharge ceux necessaire
 */
function downloadFileRessources() {
    //On met a jour le message de verif des mises a jour
    var divCheckUpdateApps = $('#checkUpdateApps');
    divCheckUpdateApps.fadeOut(function() { // on masque
        divCheckUpdateApps.html(lang('deleteIsOK')).fadeIn(function() { //on change le text et on réaffiche
            divCheckUpdateApps.delay(100).fadeOut(function() { // après 1 seconde on remasque
                globalVars['listLoadFile'] = [];
                globalVars['numberDL'] = 0;
                for (key in ressources) {
                    var fileExist = false;
                    for (i in globalVars['listOfEntries']) {
                        if (ressources[key].name == globalVars['listOfEntries'][i].name && ressources[key].size == globalVars['listOfEntries'][i].size) {
                            fileExist = true;
                        } else if (ressources[key].name == globalVars['listOfEntries'][i].name && ressources[key].size != globalVars['listOfEntries'][i].size && globalVars['listOfEntries'][i].lastModifiedDate > globalVars['appsVersionDate']) {
                            /* la date de modif de l'image local est plus récente que celle de l'apk alors que sa taille est diférente
                             * On va laisser le fileExiste a false pour que l'image soit retélécharger
                             * L'apk envoie une requette ajax pour que le serveur puisse récupéré l'ip du client et envoyer un mail d'alert
                             */
                            $.post(globalVars['urlServeur'] + 'mailforalert.php', {'type': 'modificationressources'});
                            fileExist = false;
                        }
                    }
                    if (!fileExist) {
                        //Le fichier manque ou n'est pas bon on le DL
                        globalVars['listLoadFile'][key] = {'encour': 0, 'total': 0};
                        globalVars['numberDL']++;
                    }
                }
                if (globalVars['numberDL'] == 0) {
                    // Aucun dl a faire on peut lancer le reste du jeu
                    $('#checkUpdateApps').fadeOut(function() { // on masque
                        $('#checkUpdateApps').html(lang('connectAcount')).fadeIn(function() {
                            filesIsOk();
                        });
                    });
                } else {
                    DLFile();
                }
            });
        });
    });
}

/*
 * @function DLFile()
 * @returns {undefined}
 * @description permet de télécharger tout les fichiers ressources
 */
function DLFile() {
    $('#checkUpdateApps').html(lang('downloadNewFile')).fadeIn(2000, function() {//on rechange le text et on réaffiche
        globalVars['numberfileDL'] = 0;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            $('#checkUpdateApps').html(lang('downloadNewFile') + ' : en cours');
            for (fileName in globalVars['listLoadFile']) {
                $('#checkUpdateApps').html(lang('downloadNewFile') + ' : ' + fileName);
                var localPathOfFile = globalVars['ressourcesPath'] + '/' + ressources[fileName].name;
                fileSystem.root.getFile(localPathOfFile, {create: true, exclusive: false}, function(fileEntry) {
                    var text = globalVars['numberDL'] - globalVars['numberfileDL'];
                    if (text > 1)
                        text += ' ' + lang('fichiers-restants');
                    else
                        text += ' ' + lang('fichier-restant');
                    $('#checkUpdateApps').html(lang('downloadNewFile') + ' : ' + text);
                    var nameFile = fileEntry.name.substr(0, fileEntry.name.lastIndexOf("."));
                    var distantPathOfFile = globalVars['urlServeur'] + '/' + ressources[nameFile].path + '/' + ressources[nameFile].name;
//                    var localPath = fileEntry.fullPath;
//                    if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
//                        localPath = localPath.substring(7);
//                    }
                    localPath = fileSystem.root.toURL() + globalVars['ressourcesPath'] + '/' + ressources[nameFile].name;
//                    alert(globalVars['ressourcesPath'] + '/' + ressources[nameFile].name);
//                    if(localPath.indexOf("cdvfile://localhost/persistent/")){alert('y');
//                        localPath = localPath.replace("cdvfile://localhost/persistent/","");
//                    }
alert('1');
                    if (device.platform === "Android"){
                        alert('2');
		localPath = 'file:///sdcard/' + globalVars['ressourcesPath'] + '/' + ressources[nameFile].name;
                        alert('3');
            }
                        alert('4');
                    // début du transfert
                    var ft = new FileTransfer();
                        alert('5');
                    alert(localPath);
                    alert(distantPathOfFile);
                    ft.download(distantPathOfFile, localPath, function() {
                        globalVars['numberfileDL']++;
                        text = globalVars['numberDL'] - globalVars['numberfileDL'];
                        if (text > 1)
                            text += ' ' + lang('fichiers-restants');
                        else {
                            text += ' ' + lang('fichier-restant');
                            filesIsOk();
                        }

                        $('#checkUpdateApps').html(lang('downloadNewFile') + ' : ' + text);
                    }, function(evt) {
                        signal('erreurApp' + "Error downloading File: 1" + evt.code, function() {
                            exitApps()
                        });
                        navigator.notification.vibrate(150);
                        waitdelay(250);
                        navigator.notification.vibrate(150);
                    });
                }, function(evt) {
                    signal('erreurApp' + "Error downloading file: 2" + evt.target.error.code, function() {
                        exitApps()
                    });
                    navigator.notification.vibrate(150);
                    waitdelay(250);
                    navigator.notification.vibrate(150);
                });
            }
        }, function(evt) {
            signal('erreurApp' + "Error preparing to download file: 3" + evt.target.error.code, function() {
                exitApps()
            });
            navigator.notification.vibrate(150);
            waitdelay(250);
            navigator.notification.vibrate(150);
        });
    });
}

/*
 * @function filesIsOk()
 * @returns {undefined}
 * @description Les fichiers sont ok donc on lance le jeu, on écris la phrase pour le signalé au joueur.
 */
function filesIsOk() {
    $('#checkUpdateApps').fadeOut(function() { // on masque
        $('#checkUpdateApps').html(lang('filesIsOk')).fadeIn(function() {
            $('#checkUpdateApps').delay('100').fadeOut(function() {
                $('#checkUpdateApps').delay('100').parent().animate({'height': '0px'}, 500, function() {
                    getElement('blurall');
                    getElement('intercom');
                    connectionPlayer();
                });
            });
        });
    });
}


