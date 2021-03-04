var express = require('express');
var router = express.Router();
const UserModel = require('../models/users');
const MessagesModel = require('../models/messages')
const ConversationsModel = require('../models/conversations')

var bcrypt = require('bcrypt');
var uid2 = require('uid2');

const cost = 10;




/* GET home page. */
router.get('/', async function (req, res, next) {

});


router.post('/email-check', async function(req, res, next){

  var user = await UserModel.findOne({email: req.body.emailFront})
  var result;
  var error;
  if(user) {
    result = true;
    error= 'Cet adresse mail est déjà associée à un compte'
  } else {
    result = false;
    error = 'Aucun email semblable trouvé en BDD, next step'
  }

  res.json({result, error})
})


router.post('/pseudo-check', async function (req, res, next){
  var user = await UserModel.findOne({pseudo: req.body.pseudoFront})
  var result;
  var error;
  if(user) {
    result = true;
    error = 'Ce pseudo est déjà utilisé'
  } else {
    result = false;
    error = 'Ce pseudo est disponible'
  }

  res.json({result, error})
});


router.post('/sign-up-first-step', async function(req, res, next){

  const hash = bcrypt.hashSync(req.body.passwordFront, cost);

  var user = await new UserModel({
    token: uid2(32),
    email: req.body.emailFront,
    password: hash,
    pseudo: req.body.pseudoFront,
    birthDate: req.body.birthDateFront,
    problems_types: JSON.parse(req.body.problemsFront)
  })

  var userSaved = await user.save()

  res.json({ userSaved: userSaved })
})

/* Sign-up -> Inscription 
  Body :
      REQUIRED ---> emailFront : (quentin@gmail.com), passwordFront : (XXXXXX), pseudoFront : (HelicoptèreDeCombat), birthDateFront : (12/23/1992) --> vérification majorité , problemsTypesFront : String
      OPTIONALE --> problemDescriptionFront : String, localisationFront : String, genderFront : StringFront, avatarFront : String, 
  Response : result (true), token (1234), birthDate : (12/23/1992), problems_types : String, localisation : String
problemDescriptionFront=${props.userDisplay}&genderFront=${props.userDisplay.gender}&localisationFront=${JSON.stringify(props.userDisplay.localisation.coordinates)}&avatarFront=${props.userDisplay.avatar}&tokenFront=${tokenOnLocalStorage}
  */
router.post('/sign-up-second-step', async function(req, res, next) {

  console.log(req.body.tokenFront, '----> token front')

  var user = await UserModel.updateOne(
    { token: req.body.tokenFront}, // ciblage à gauche de la virgule
    { 
      problem_description: req.body.problemDescriptionFront,
      gender: req.body.genderFront,
      localisation: JSON.parse(req.body.localisationFront),
      avatar: req.body.avatarFront,
     }
);

  var result;
  user ? result = true : result = false
  
  res.json({result: result});
});


/* sign-in -> Connexion
body : emailFront : (quentin@gmail.com), passwordFront : (XXXXXX)
response : result (true), token : 1234
*/
router.post('/sign-in', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


/* sign-out -> déconnexion
body : tokenFront : 1234, 
response : result (true), 
*/
router.post('/sign-out', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


/* show-card -> afficher les autres utilisateurs dans le swipe.
query : tokenFront : 1234, birthDateFront : (12/23/1992), problemsTypesFront : String, localisationFront : String, genderFront : String, 
response : userFiltered : array, pseudo (celui du user connecté) : String
*/
router.get('/show-card', async function (req, res, next) {

  var user = await UserModel.findOne({token: req.query.tokenFront})
  var userToDisplay = await UserModel.find({token: {$ne : req.query.tokenFront}})

  var birthDate = user.birthDate
  var dateToday = new Date()
  var dateCompare = dateToday - birthDate
  var conditionDate = (86400000*365)*18
  if((dateToday - dateCompare) > conditionDate && (user.is_adult = false)) {
    UserModel.updateOne(
      { is_adult: false },
      { $set: { is_adult: true },
    })
  }

  if(user.is_adult) {
    var userToShow = userToDisplay.filter(e => e.is_adult == true);
  } else {
    var userToShow = userToDisplay.filter(e => e.is_adult == false);
  }

  console.log('Users----->',userToShow)

  res.json({user:user, userToShow:userToShow, });
});


/**
 * show-msg -> afficher les différentes conversations avec les users.
 * query : tokenFront: 1234
 * response : [{pseudo (sender) : String, date (dernier message) : date, avatar (sender) : String, last_message : String, demande : boolean, is_read (nombre de messages non-lus) : Number, delete : boolean, conversation_id : 1234}] 
 **/
router.get('/show-msg', async function (req, res, next) {

  let messagesPerPerson = []
  let friendsData = []
  let conversations = []

  if (req.query && req.query.user_id === '') {
    res.json({
      conversations
    })
  }

  const myConnectedId = req.query.user_id

  // load les conversations avec mes contacts
  const allMyConversations = await ConversationsModel.find({
    participants: { $in: [myConnectedId] }
  })

  // console.log('allMyConversations = ', allMyConversations)


  await Promise.all(allMyConversations.map(async (element, index) => {
    // 1/ construit un tableau listant le dernier message de chaque conversation
    var allMsg = await MessagesModel.find(
      { conversation_id: element._id }
    )
      .sort({ datefield: -1 })
      .limit(1)
    messagesPerPerson.push(allMsg)

    // 2/ construit un tableau des infos de mes contacts (avatar, pseudo...)
    const notMe = element.participants[0] === myConnectedId ? element.participants[0] : element.participants[1]
    const myFriends = await UserModel.findById(notMe)
    console.log('myFriends', myFriends)
    friendsData.push(myFriends)

    conversations.push({
      lastMessage: allMsg[0],
      friendsDatas: myFriends
    })
  }))

  res.json({
    conversations
  })
});


/* show-convers -> afficher la conversation avec les autres utilisateurs.
query : conversationIdFront : 1234     ou     tokenFront : 1234
response : collection message qui est liée et conversation_id.    OU : variable contenant 10 objets (10 dernières conv) contenant avatar, pseudo, contenu du message
*/
router.get('/show-convers', async function (req, res, next) {

  // var user = await userModel.find({ token: req.body.tokenFront })

  // var user = await userModel.find({token: req.body.tokenFront})

  // var lastConvId = []
  // var toUsersId = []
  // var usersData = []
  // var messagesId =  []
  // var conversationsDisplay = []

  // // idée de fonctionnement :
  // // cherche dans les 10 dernières conversations, l'avatar de chaque user trouvé grâce au from_to_id, et le dernier message de chaque conversation

  // for (var i = user.conversation_list_id.length ; (i = user.conversation_list_id.length - 10) ; i--) {
  //   lastConvId.push(user.conversation_list_id[i]);
  // }

  // var conversations = await conversationsModel.find({_id: lastConvId.map(e => e), demande_receiver: true, delete: false}); // ne sait pas si cette methode pour find fonctionne

  // toUsersId = conversations.map(e => e.to_id);

  // var toUsersData = await userModel.find({_id: toUsersId.map(e => e)})

  // usersData = toUsersData.map((e) => ({
  //   avatar: e.avatar,
  //   pseudo: e.pseudo
  // }))

  // for (var i = 0; i< conversations.length ; i++) {
  //   messagesId.push(conversations[i].messages_id[message_id.length-1])
  // }

  // var messagesData = await messagesModel.find({_id: messagesId.map(e => e)})

  // for (var i =0; i<lastConvId.length ; i++) {
  //   conversationsDisplay.push({
  //     avatar: avatarData[i].avatar,
  //     pseudo: avatarData[i].pseudo,
  //     lastMessage: messagesData[i],
  //   })
  // }

  var pseudo = "Alexis"
  var avatar = "../assets/women_4.png"
  var id = "603f67380ce5ea52ee401325"

  var allMessagesWithOneUser = await MessagesModel.find(
    { conversation_id: "603f98460ced2c1ed9fe2e6b" }
  ).limit(5);

  console.log("allMessagesWithOneUser", allMessagesWithOneUser)

  res.json({ allMessagesWithOneUser, pseudo, avatar, id })
});

/* first-message -> création de la convers en base.
body : idReceiverFront: 1234, tokenSenderFront: 1234, avatarReceiverFront : 'exemple.jpg', pseudoReceiverFront: 'gigatank3000', 
response : new_conversation_data
*/
router.post('/first-msg', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* send-msg -> envoyer un message.
body : conversationIdFront : 1234, fromIdFront: 12453, toIdFront: 11234, contentFront: 'il est né le divin enfant'
response : newMessageData
*/
router.post('/send-msg', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


/*update-filter -> mettre à jour le filtre pour permettre de mettre à jour la page card-show 

Pourquoi faire une route ? On a besoin d'aucune info de la BDD pour rendre dynamique la page, au onPress du bouton enregistrer on modifie
le local storage et on redirige vers la page card-show qui aura un useEffect permettant de chercher dans la base de données et de filtrer en
fonction du local storage.

*/
router.put('/update-filter', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


/* signalement-help: incrémenter le compteur warning_signal de l'utilisateur qui a besoin d'aide
body: idUserSignaledFront: 1234, warningSignalFront: 1234
response: result: true ? message: Nous avons bien pris en compte votre signalement : message: 'Erreur, l'utilisateur n'a pas pu être signalé, vous
pouvez nous envoyer un email à l'adresse mail....'
 */
router.post('/signalement-help', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* loadProfil : mettre à jour les information en BDD de l'utilisateur qui modifie son profil. */
router.post('/loadProfil', async function(req, res, next) {
  var userBeforeUpdate = await UserModel.findOne({token: req.body.tokenFront})
  res.json({ userFromBack: userBeforeUpdate });
});

/* update-profil : mettre à jour les information en BDD de l'utilisateur qui modifie son profil.
body: emailFront: hervé@gmail.com, localisationFront: Saint-Dié, genderFront: 'Female', passwordFront: 'camionpompier75', descriptionProblemFront: 'urticaire', problemsFront: ['Familiale', 'Physique']
response: userSaved
*/
router.put("/update-profil", async function (req, res, next) {

  var userBeforeUpdate = await UserModel.findOne({token: req.body.tokenFront})
  console.log(userBeforeUpdate, '<---- userBeforeUpdate')

  // ajout du genre et descriptionProblemFront
  var userUpdate = await UserModel.updateOne(
    { token: req.body.tokenFront },
    {
      email: req.body.emailFront,
      localisation: req.body.localisationFront,
      password: req.body.passwordFront,
      gender: req.body.genderFront,
      problem_description: req.body.descriptionProblemFront
    }
  );

  var userAfterUpdate = await UserModel.findOne({token: req.body.tokenFront})
  console.log(userAfterUpdate, '<---- userAfterUpdate')

  res.json({ user: userBeforeUpdate });
});

/* show-profil : montrer le profil de l'utilisateur au clic sur l'icône user de la bottom tab 
body: tokenFront: 1243
response: userFind
*/
router.get('/show-my-profil', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* show-user-profil: au clic sur le card de l'utilisateur dans card-shop ou au clic sur l'avatar dans la conversation j'affiche les éléments de l'utilisateur cliqué
body: idUserSelectedFront: 1234
response: userSelected
 */
router.get('/show-user-profil', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* delete-my-profil: au clic sur le toggle sur supprimer mon compte, je veux modifier le statut de l'utilisateur en BDD 
body: tokenFront : 1234,
response: result: true
*/
router.delete('/delete-my-profil', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* delete-message: lorsqu'on reste appuyer sur le message, on ouvre un overlay un un bouton pour supprimer le message
body: idMessageFront: 1234
response: messagesUpdated
 */
router.put('/delete-msg', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* delete-convers: au swipe à gauche d'une card conversation on veut pouvoir cliquer sur bouton supprimer pour modifier le statut de la conversation en BDD 
body: idConversFront: 1234
response: conversationsUpdated
*/
router.put('/delete-convers', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
