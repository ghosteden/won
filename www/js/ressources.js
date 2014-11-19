/*
 * Ici se trouve la listes des éléments a récupéré comme les images les son etc
 * Ils servent aussi bien a melonjs qu'au jeu en générale
 */

// Listes des tableau de ressources avec le path relatif
ressources['z1m1json'] = {'name': 'z1m1.json', 'type': 'json', 'size': '44697', 'path': 'ressources/map'};
ressources['z1m1'] = {'name': 'z1m1.jpg', 'type': 'image', 'size': '44697', 'path': 'ressources/map'};
ressources['z1m1-min'] = {'name': 'z1m1-min.jpg', 'type': 'image', 'size': '44697', 'path': 'ressources/map'};

//sprite perso 1
ressources['sprites-perso1'] = {'name': 'sprites-perso1.png', 'type': 'image', 'size': '3785060', 'path': 'ressources/perso/sprite'};
ressources['shema-perso1'] = {'name': 'shema-perso1.json', 'type':'json', 'size': '3785060', 'path': 'ressources/perso/shema'};
ressources['portrait-perso1-1'] = {'name': 'portrait-perso1-1.png', 'type': 'image', 'size': '1276482', 'path': 'ressources/perso/portrait'};
ressources['portrait-perso1-2'] = {'name': 'portrait-perso1-2.png', 'type': 'image', 'size': '1276482', 'path': 'ressources/perso/portrait'};
ressources['portrait-perso1-3'] = {'name': 'portrait-perso1-3.png', 'type': 'image', 'size': '1276482', 'path': 'ressources/perso/portrait'};
ressources['portrait-perso1-4'] = {'name': 'portrait-perso1-4.png', 'type': 'image', 'size': '1276482', 'path': 'ressources/perso/portrait'};
ressources['portrait-perso1-5'] = {'name': 'portrait-perso1-5.png', 'type': 'image', 'size': '1276482', 'path': 'ressources/perso/portrait'};


ressources['sprites-curseur'] = {'name': 'sprites-curseur.png', 'type': 'image', 'size': '1509952', 'path': 'ressources/game'};

ressources['sprites-paul'] = {'name': 'sprites-paul.png', 'type': 'image', 'size': '3785060', 'path': 'ressources/pnj/sprite'};
ressources['shema-paul'] = {'name': 'shema-paul.json', 'type':'json', 'size': '3785060', 'path': 'ressources/perso/shema'};
ressources['portrait-paul-1'] = {'name': 'portrait-perso1-1.png', 'type': 'image', 'size': '1276482', 'path': 'ressources/perso/portrait'};
ressources['portrait-paul-2'] = {'name': 'portrait-perso1-2.png', 'type': 'image', 'size': '1276482', 'path': 'ressources/perso/portrait'};
ressources['portrait-paul-3'] = {'name': 'portrait-perso1-3.png', 'type': 'image', 'size': '1276482', 'path': 'ressources/perso/portrait'};
ressources['portrait-paul-4'] = {'name': 'portrait-perso1-4.png', 'type': 'image', 'size': '1276482', 'path': 'ressources/perso/portrait'};
ressources['portrait-paul-5'] = {'name': 'portrait-perso1-5.png', 'type': 'image', 'size': '1276482', 'path': 'ressources/perso/portrait'};


var mapjson = {
	"illustration":"z1m1-min",
	"posx": -800,
	"posy": -600,
	"width": 2217,
	"height": 1484,
	"map": "z1m1",
	"ressources": [
		"z1m1",
		"sprites-paul",
		"shema-paul",
		"portrait-paul-1",
		"portrait-paul-2",
		"portrait-paul-3",
		"portrait-paul-4",
		"portrait-paul-5",
		"sprites-perso",
		"shema-perso",
		"portrait-perso-1",
		"portrait-perso-2",
		"portrait-perso-3",
		"portrait-perso-4",
		"portrait-perso-5",
		"sprites-curseur"
	],
	"joueur": {
		"posx": 750,
		"posy": 560,
		"direction": "X45W"
	},
	"interets": {
		"Paul": {
			"posx": 2010,
			"posy": 990,
			"ressource": "sprites-paul",
			"shema": "shema-paul",
			"width": 120,
			"height": 120,
			"action": {
				"posx": 30,
				"posy": 60,
				"fct": "interaction('paul')",
				"hitbox":{
					"x":0,
					"y":0,
					"h":120,
					"w":120
				}
			},
			"joueur": {
				"posx": 1960,
				"posy": 1020,
				"direction": "XM45W"
			}
		}
	}
};

var shemaperso1 = {
	"fps":10,
	"start":"X90W",
    "X0":[5,6,7,8,9,10,11,12,13,14],
	"X0S":[0,1,2],
	"X0E":[18,19],
	"X0W":[30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49],
	"X0W2":[51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99],
	"X0W3":[99,98,97,96,95,94,93,92,91,90,89,90,91,92,93,94,95,96,97,98,99],
	"X0W4":[71,72,73,74,75,76,77,78,79,80,81],
	"X22":[105,106,107,108,109,110,111,112,113,114],
	"X22S":[100,101,102],
	"X22E":[118,119],
	"X22W":[130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149],
	"X22W2":[151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199],
	"X22W3":[199,198,197,196,195,194,193,192,191,190,189,190,191,192,193,194,195,196,197,198,199],
	"X22W4":[171,172,173,174,175,176,177,178,179,180,181],
	"X45":[205,206,207,208,209,210,211,212,213,214],
	"X45S":[200,201,202],
	"X45E":[218,219],
	"X45W":[230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249],
	"X45W2":[251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299],
	"X45W3":[299,298,297,296,295,294,293,292,291,290,289,290,291,292,293,294,295,296,297,298,299],
	"X45W4":[271,272,273,274,275,276,277,278,279,280,281],
	"X67":[305,306,307,308,309,310,311,312,313,314],
	"X67S":[300,301,302],
	"X67E":[318,319],
	"X67W":[330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349],
	"X67W2":[351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399],
	"X67W3":[399,398,397,396,395,394,393,392,391,390,389,390,391,392,393,394,395,396,397,398,399],
	"X67W4":[371,372,373,374,375,376,377,378,379,380,381],
	"X90":[405,406,407,408,409,410,411,412,413,414],
	"X90S":[400,401,402],
	"X90E":[418,419],
	"X90W":[430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449],
	"X90W2":[451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499],
	"X90W3":[499,498,497,496,495,494,493,492,491,490,489,490,491,492,493,494,495,496,497,498,499],
	"X90W4":[482,481,480,479,478,477,476,475,475,475,476,477,478,479,480,481,482],
	"X90W5":[419,314,210,109,14,1510,1309,1214,1110,1009,914,710,609,514,410,509,614,710,809,914,1010,1109,1214,1310,1409,1514,10,109,214,310,419],
	"X90W7":[419,314,210,109,14,110,209,314,410,509,614,710,809,714,610,509,414,310,209,114,10,109,214,310,419],
	"X112":[505,506,507,508,509,510,511,512,513,514],
	"X112S":[500,501,502],
	"X112E":[518,519],
	"X112W":[530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,549],
	"X112W2":[551,552,553,554,555,556,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,572,573,574,575,576,577,578,579,580,581,582,583,584,585,586,587,588,589,590,591,592,593,594,595,596,597,598,599],
	"X112W3":[599,598,597,596,595,594,593,592,591,590,589,590,591,592,593,594,595,596,597,598,599],
	"X112W4":[571,572,573,574,575,576,577,578,579,580,581],
	"X135":[605,606,607,608,609,610,611,612,613,614],
	"X135S":[600,601,602],
	"X135E":[618,619],
	"X135W":[630,631,632,633,634,635,636,637,638,639,640,641,642,643,644,645,646,647,648,649],
	"X135W2":[651,652,653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,689,690,691,692,693,694,695,696,697,698,699],
	"X135W3":[699,698,697,696,695,694,693,692,691,690,689,690,691,692,693,694,695,696,697,698,699],
	"X135W4":[671,672,673,674,675,676,677,678,679,680,681],
	"X157":[705,706,707,708,709,710,711,712,713,714],
	"X157S":[700,701,702],
	"X157E":[718,719],
	"X157W":[730,731,732,733,734,735,736,737,738,739,740,741,742,743,744,745,746,747,748,749],
	"X157W2":[751,752,753,754,755,756,757,758,759,760,761,762,763,764,765,766,767,768,769,770,771,772,773,774,775,776,777,778,779,780,781,782,783,784,785,786,787,788,789,790,791,792,793,794,795,796,797,798,799],
	"X157W3":[799,798,797,796,795,794,793,792,791,790,789,790,791,792,793,794,795,796,797,798,799],
	"X157W4":[771,772,773,774,775,776,777,778,779,780,781],
	"X180":[805,806,807,808,809,810,811,812,813,814],
	"X180S":[800,801,802],
	"X180E":[818,819],
	"X180W":[830,831,832,833,834,835,836,837,838,839,840,841,842,843,844,845,846,847,848,849],
	"X180W2":[851,852,853,854,855,856,857,858,859,860,861,862,863,864,865,866,867,868,869,870,871,872,873,874,875,876,877,878,879,880,881,882,883,884,885,886,887,888,889,890,891,892,893,894,895,896,897,898,899],
	"X180W3":[899,898,897,896,895,894,893,892,891,890,889,890,891,892,893,894,895,896,897,898,899],
	"X180W4":[871,872,873,874,875,876,877,878,879,880,881],
	"XM157":[905,906,907,908,909,910,911,912,913,914],
	"XM157S":[900,901,902],
	"XM157E":[918,919],
	"XM157W":[930,931,932,933,934,935,936,937,938,939,940,941,942,943,944,945,946,947,948,949],
	"XM157W2":[951,952,953,954,955,956,957,958,959,960,961,962,963,964,965,966,967,968,969,970,971,972,973,974,975,976,977,978,979,980,981,982,983,984,985,986,987,988,989,990,991,992,993,994,995,996,997,998,999],
	"XM157W3":[999,998,997,996,995,994,993,992,991,990,989,990,991,992,993,994,995,996,997,998,999],
	"XM157W4":[971,972,973,974,975,976,977,978,979,980,981],
	"XM135":[1005,1006,1007,1008,1009,1010,1011,1012,1013,1014],
	"XM135S":[1000,1001,1002],
	"XM135E":[1018,1019],
	"XM135W":[1030,1031,1032,1033,1034,1035,1036,1037,1038,1039,1040,1041,1042,1043,1044,1045,1046,1047,1048,1049],
	"XM135W2":[1051,1052,1053,1054,1055,1056,1057,1058,1059,1060,1061,1062,1063,1064,1065,1066,1067,1068,1069,1070,1071,1072,1073,1074,1075,1076,1077,1078,1079,1080,1081,1082,1083,1084,1085,1086,1087,1088,1089,1090,1091,1092,1093,1094,1095,1096,1097,1098,1099],
	"XM135W3":[1099,1098,1097,1096,1095,1094,1093,1092,1091,1090,1089,1090,1091,1092,1093,1094,1095,1096,1097,1098,1099],
	"XM135W4":[1071,1072,1073,1074,1075,1076,1077,1078,1079,1080,1081],
	"XM112":[1105,1106,1107,1108,1109,1110,1111,1112,1113,1114],
	"XM112S":[1100,1101,1102],
	"XM112E":[1118,1119],
	"XM112W":[1130,1131,1132,1133,1134,1135,1136,1137,1138,1139,1140,1141,1142,1143,1144,1145,1146,1147,1148,1149],
	"XM112W2":[1151,1152,1153,1154,1155,1156,1157,1158,1159,1160,1161,1162,1163,1164,1165,1166,1167,1168,1169,1170,1171,1172,1173,1174,1175,1176,1177,1178,1179,1180,1181,1182,1183,1184,1185,1186,1187,1188,1189,1190,1191,1192,1193,1194,1195,1196,1197,1198,1199],
	"XM112W3":[1199,1198,1197,1196,1195,1194,1193,1192,1191,1190,1189,1190,1191,1192,1193,1194,1195,1196,1197,1198,1199],
	"XM112W4":[1171,1172,1173,1174,1175,1176,1177,1178,1179,1180,1181],
	"XM90":[1205,1206,1207,1208,1209,1210,1211,1212,1213,1214],
	"XM90S":[1200,1201,1202],
	"XM90E":[1218,1219],
	"XM90W":[1230,1231,1232,1233,1234,1235,1236,1237,1238,1239,1240,1241,1242,1243,1244,1245,1246,1247,1248,1249],
	"XM90W2":[1251,1252,1253,1254,1255,1256,1257,1258,1259,1260,1261,1262,1263,1264,1265,1266,1267,1268,1269,1270,1271,1272,1273,1274,1275,1276,1277,1278,1279,1280,1281,1282,1283,1284,1285,1286,1287,1288,1289,1290,1291,1292,1293,1294,1295,1296,1297,1298,1299],
	"XM90W3":[1299,1298,1297,1296,1295,1294,1293,1292,1291,1290,1289,1290,1291,1292,1293,1294,1295,1296,1297,1298,1299],
	"XM90W4":[1271,1272,1273,1274,1275,1276,1277,1278,1279,1280,1281],
	"XM67":[1305,1306,1307,1308,1309,1310,1311,1312,1313,1314],
	"XM67S":[1300,1301,1302],
	"XM67E":[1318,1319],
	"XM67W":[1330,1331,1332,1333,1334,1335,1336,1337,1338,1339,1340,1341,1342,1343,1344,1345,1346,1347,1348,1349],
	"XM67W2":[1351,1352,1353,1354,1355,1356,1357,1358,1359,1360,1361,1362,1363,1364,1365,1366,1367,1368,1369,1370,1371,1372,1373,1374,1375,1376,1377,1378,1379,1380,1381,1382,1383,1384,1385,1386,1387,1388,1389,1390,1391,1392,1393,1394,1395,1396,1397,1398,1399],
	"XM67W3":[1399,1398,1397,1396,1395,1394,1393,1392,1391,1390,1389,1390,1391,1392,1393,1394,1395,1396,1397,1398,1399],
	"XM67W4":[1371,1372,1373,1374,1375,1376,1377,1378,1379,1380,1381],
	"XM45":[1405,1406,1407,1408,1409,1410,1411,1412,1413,1414],
	"XM45S":[1400,1401,1402],
	"XM45E":[1418,1419],
	"XM45W":[1430,1431,1432,1433,1434,1435,1436,1437,1438,1439,1440,1441,1442,1443,1444,1445,1446,1447,1448,1449],
	"XM45W2":[1451,1452,1453,1454,1455,1456,1457,1458,1459,1460,1461,1462,1463,1464,1465,1466,1467,1468,1469,1470,1471,1472,1473,1474,1475,1476,1477,1478,1479,1480,1481,1482,1483,1484,1485,1486,1487,1488,1489,1490,1491,1492,1493,1494,1495,1496,1497,1498,1499],
	"XM45W3":[1499,1498,1497,1496,1495,1494,1493,1492,1491,1490,1489,1490,1491,1492,1493,1494,1495,1496,1497,1498,1499],
	"XM45W4":[1471,1472,1473,1474,1475,1476,1477,1478,1479,1480,1481],
	"XM22":[1505,1506,1507,1508,1509,1510,1511,1512,1513,1514],
	"XM22S":[1500,1501,1502],
	"XM22E":[1518,1519],
	"XM22W":[1530,1531,1532,1533,1534,1535,1536,1537,1538,1539,1540,1541,1542,1543,1544,1545,1546,1547,1548,1549],
	"XM22W2":[1551,1552,1553,1554,1555,1556,1557,1558,1559,1560,1561,1562,1563,1564,1565,1566,1567,1568,1569,1570,1571,1572,1573,1574,1575,1576,1577,1578,1579,1580,1581,1582,1583,1584,1585,1586,1587,1588,1589,1590,1591,1592,1593,1594,1595,1596,1597,1598,1599],
	"XM22W3":[1599,1598,1597,1596,1595,1594,1593,1592,1591,1590,1589,1590,1591,1592,1593,1594,1595,1596,1597,1598,1599],
	"XM22W4":[1571,1572,1573,1574,1575,1576,1577,1578,1579,1580,1581]
};

var langFile = {
	"LANG_FR": {
		"tutoFirstDialogue" : "Bienvenue dans World of Nemesis. Ce monde a été dévasté, ici vous apprendrez les rudiments nécessaire a votre survit. Aller à la rencontre de Paul. Vous le trouverez dans la ville où vous vous situez. Ils sera votre allié durant cette épreuve. Parcourez la ville, et recherchez les différents points d'intérêt. ils sont repérables par ce symbole <img style='vertical-align:middle' width='50' src='./img/cursor-front.png'/>"
	},
	"LANG_EN": {
		"tutoFirstDialogue" : ""
	}
};
