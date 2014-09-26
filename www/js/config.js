/*
 * Listes des paramètres configurables
 */

// tableau de variables global, permet d'utilisé des variable global sans avoir a les initialiser
var globalVars = [];
// version de l'application et date de mise a jour
globalVars['appsVersion'] = 0.002;
globalVars['appsVersionDate'] = 1390979570000;

// url du serveur, sert pour les ressources par exemple
globalVars['urlServeur'] = "http://worldofnemesis.com/game_wLtx9lRa6NSWOz3OfLEe";

//Dosssier local des ressources
globalVars['ressourcesPath'] = 'ressources';

// url de versification de version
globalVars['urlTestVersion'] = "http://worldofnemesis.com/game_wLtx9lRa6NSWOz3OfLEe/version.php";

//url pour télécharger la derniere version de l'application
globalVars['urlLastApk'] = "http://worldofnemesis.com/apk/device/won.apk";

// Langue par default du jeu modifiable dans les paramètres du jeu
globalVars['lang'] = 'FR';

// sert uniquement pour la fonction signal afin de pouoir laisser l'intercom ouvert dans certain cas
globalVars['noCloseIntercom'] = false;

//pour les fichier audio
globalVars['audio'] = [];
globalVars['loopAudio'] = [];
globalVars['loopAudioTime'] = [];

// Variable a MelonJs
globalVars['fps'] = 20;
globalVars['tileSize'] = 8;
globalVars['double_buffering'] = false;
globalVars['scale'] = '';
globalVars['maintainAspectRatio'] = '';
globalVars['save']=[];

// Autre variable;
var ressources = [];