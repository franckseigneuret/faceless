var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Sign-up -> Inscription 
  Body :
      REQUIRED ---> email : (quentin@gmail.com), password : (XXXXXX), pseudo : (HelicoptèreDeCombat), birthDate : (12/23/1992) --> vérification majorité , problems_types : String
      OPTIONALE --> problem_description : String, localisation : String, gender : String, avatar : String, 
  Response : result (true), token (1234), birthDate : (12/23/1992), problems_types : String, localisation : String
*/
router.post('/sign-up', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* sign-in -> Connexion
body : email : (quentin@gmail.com), password : (XXXXXX)
response : result (true), token : 1234
*/
router.post('/sign-in', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* sign-out -> déconnexion
body : token : 1234, 
response : result (true), 
*/
router.post('/sign-out', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* show-card -> afficher les autres utilisateurs dans le swipe.
query : token : 1234, birthDate : (12/23/1992), problems_types : String, localisation : String, gender : String, 
response : userFiltered : array, pseudo (celui du user connecté) : String
*/
router.get('/show-card', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* show-msg -> afficher les différentes conversations avec les users.
query : token 1234
response : [{pseudo (sender) : String, date (dernier message) : date, avatar (sender) : String, last_message : String, demande : boolean, is_read (nombre de messages non-lus) : Number, delete : boolean, conversation_id : 1234}]
*/
router.get('/show-msg', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* show-convers -> afficher la conversation avec les autres utilisateurs.
query : conversation_id : 1234
response : collection message qui est liée et conversation_id.
*/
router.get('/show-convers', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* first-message -> écriture du premier message avec création de la convers en base.
body :
response : 
*/
router.post('/first-msg', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* send-msg -> envoyer un message.
body : conversation_id : 1234
response : 
*/
router.post('/send-msg', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.put('/update-filter', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signalement', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.put('/update-profil', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/show-profil', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.delete('/delete-profil', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.put('/delete-msg', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.put('/delete-convers', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
