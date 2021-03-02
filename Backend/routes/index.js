var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var uid2 = require('uid2');
const cost = 10;



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get(`/email-check/?email=${req.query.emailFront}`, async function(req, res, next){

  var user = await userModel.find({email: req.query.emailFront})
  let result;
  let error;
  if(user) {
    result = true;
    error= 'Cet email appartient déjà à un autre compte'
  }
  res.json({result: result, error: error})
})

router.post('/sign-up-first-step', async function(req, res, next){

  const hash = bcrypt.hashSync(req.body.passwordFront, cost);

  var user = await new userModel({
    token: uid2(32),
    email: req.body.emailFront,
    password: hash,
    pseudo: req.body.pseudoFront,
    birthDate: req.body.birthDateFront,
    problems_types: req.body.problemsFront
  })

  var userSaved = await user.save()
  console.log(userSaved, '<------ userSaved on backend')

  res.json({userSaved: userSaved})
})

/* Sign-up -> Inscription 
  Body :
      REQUIRED ---> emailFront : (quentin@gmail.com), passwordFront : (XXXXXX), pseudoFront : (HelicoptèreDeCombat), birthDateFront : (12/23/1992) --> vérification majorité , problemsTypesFront : String
      OPTIONALE --> problemDescriptionFront : String, localisationFront : String, genderFront : StringFront, avatarFront : String, 
  Response : result (true), token (1234), birthDate : (12/23/1992), problems_types : String, localisation : String
*/
router.post('/sign-up-second-step', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* sign-in -> Connexion
body : emailFront : (quentin@gmail.com), passwordFront : (XXXXXX)
response : result (true), token : 1234
*/
router.post('/sign-in', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* sign-out -> déconnexion
body : tokenFront : 1234, 
response : result (true), 
*/
router.post('/sign-out', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* show-card -> afficher les autres utilisateurs dans le swipe.
query : tokenFront : 1234, birthDateFront : (12/23/1992), problemsTypesFront : String, localisationFront : String, genderFront : String, 
response : userFiltered : array, pseudo (celui du user connecté) : String
*/
router.get('/show-card', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* show-msg -> afficher les différentes conversations avec les users.
query : tokenFront: 1234
response : [{pseudo (sender) : String, date (dernier message) : date, avatar (sender) : String, last_message : String, demande : boolean, is_read (nombre de messages non-lus) : Number, delete : boolean, conversation_id : 1234}]
*/
router.get('/show-msg', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* show-convers -> afficher la conversation avec les autres utilisateurs.
query : conversationIdFront : 1234     ou     tokenFront : 1234
response : collection message qui est liée et conversation_id.    OU : variable contenant 10 objets (10 dernières conv) contenant avatar, pseudo, contenu du message
*/
router.get('/show-convers', async function(req, res, next) {

  var user = await userModel.find({token: req.body.tokenFront})
  
  var lastConvId = []
  var toUsersId = []
  var usersData = []
  var messagesId =  []
  var conversationsDisplay = []

  // idée de fonctionnement :
  // cherche dans les 10 dernières conversations, l'avatar de chaque user trouvé grâce au from_to_id, et le dernier message de chaque conversation

  for (var i = user.conversation_list_id.length ; (i = user.conversation_list_id.length - 10) ; i--) {
    lastConvId.push(user.conversation_list_id[i]);
  }

  var conversations = await conversationsModel.find({_id: lastConvId.map(e => e), demande_receiver: true, delete: false}); // ne sait pas si cette methode pour find fonctionne

  toUsersId = conversations.map(e => e.to_id);
  
  var toUsersData = await userModel.find({_id: toUsersId.map(e => e)})

  usersData = toUsersData.map((e) => ({
    avatar: e.avatar,
    pseudo: e.pseudo
  }))

  for (var i = 0; i< conversations.length ; i++) {
    messagesId.push(conversations[i].messages_id[message_id.length-1])
  }

  var messagesData = await messagesModel.find({_id: messagesId.map(e => e)})

  for (var i =0; i<lastConvId.length ; i++) {
    conversationsDisplay.push({
      avatar: avatarData[i].avatar,
      pseudo: avatarData[i].pseudo,
      lastMessage: messagesData[i],
    })
  }


  res.json({conversationsDisplay})
});

/* first-message -> création de la convers en base.
body : idReceiverFront: 1234, tokenSenderFront: 1234, avatarReceiverFront : 'exemple.jpg', pseudoReceiverFront: 'gigatank3000', 
response : new_conversation_data
*/
router.post('/first-msg', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* send-msg -> envoyer un message.
body : conversationIdFront : 1234, fromIdFront: 12453, toIdFront: 11234, contentFront: 'il est né le divin enfant'
response : newMessageData
*/
router.post('/send-msg', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/*update-filter -> mettre à jour le filtre pour permettre de mettre à jour la page card-show 

Pourquoi faire une route ? On a besoin d'aucune info de la BDD pour rendre dynamique la page, au onPress du bouton enregistrer on modifie
le local storage et on redirige vers la page card-show qui aura un useEffect permettant de chercher dans la base de données et de filtrer en
fonction du local storage.

*/
router.put('/update-filter', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* signalement-help: incrémenter le compteur warning_signal de l'utilisateur qui a besoin d'aide
body: idUserSignaledFront: 1234, warningSignalFront: 1234
response: result: true ? message: Nous avons bien pris en compte votre signalement : message: 'Erreur, l'utilisateur n'a pas pu être signalé, vous
pouvez nous envoyer un email à l'adresse mail....'
 */
router.post('/signalement-help', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* update-profil : mettre à jour les information en BDD de l'utilisateur qui modifie son profil.
body: emailFront: hervé@gmail.com, localisationFront: Saint-Dié, genre: 'Female', passwordFront: 'camionpompier75', descriptionProblemFront: 'urticaire', problemsFront: ['Familiale', 'Physique']
response: userSaved
*/
router.put('/update-profil', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* show-profil : montrer le profil de l'utilisateur au clic sur l'icône user de la bottom tab 
body: tokenFront: 1243
response: userFind
*/
router.get('/show-my-profil', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* show-user-profil: au clic sur le card de l'utilisateur dans card-shop ou au clic sur l'avatar dans la conversation j'affiche les éléments de l'utilisateur cliqué
body: idUserSelectedFront: 1234
response: userSelected
 */
router.get('/show-user-profil', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* delete-my-profil: au clic sur le toggle sur supprimer mon compte, je veux modifier le statut de l'utilisateur en BDD 
body: tokenFront : 1234,
response: result: true
*/
router.delete('/delete-my-profil', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* delete-message: lorsqu'on reste appuyer sur le message, on ouvre un overlay un un bouton pour supprimer le message
body: idMessageFront: 1234
response: messagesUpdated
 */
router.put('/delete-msg', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* delete-convers: au swipe à gauche d'une card conversation on veut pouvoir cliquer sur bouton supprimer pour modifier le statut de la conversation en BDD 
body: idConversFront: 1234
response: conversationsUpdated
*/
router.put('/delete-convers', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
