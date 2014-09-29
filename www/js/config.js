/*
 * Listes des paramètres configurables
 */

// tableau de variables global, permet d'utilisé des variable global sans avoir a les initialiser
var globalVars = [];
// version de l'application et date de mise a jour
globalVars['appsVersion'] = 0.003;
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

// Variable pour l'app
var save = [];

// Autre variable;
var ressources = [];
var erreurDLFile={
	1:'NOT_FOUND_ERR',
	2:'SECURITY_ERR',
	3:'ABORT_ERR',
	4:'NOT_READABLE_ERR',
	5:'ENCODING_ERR',
	6:'NO_MODIFICATION_ALLOWED_ERR',
	7:'INVALID_STATE_ERR',
	8:'SYNTAX_ERR',
	9:'INVALID_MODIFICATION_ERR',
	10:'QUOTA_EXCEEDED_ERR',
	11:'TYPE_MISMATCH_ERR',
	12:'PATH_EXISTS_ERR',
}