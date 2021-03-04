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


router.post('/email-check', async function (req, res, next) {
  console.log(req.body.emailFront, '<------ req body')
  var user = await UserModel.find()
  console.log(user, '<-------- user found ?')
  // var userFind = user.filter(e => e.email == req.body.emailFront)
  // let result;
  // let error;
  // if(userFind != null) {
  //   result = true;
  //   error= 'Cet email appartient déjà à un autre compte'
  // } else {
  //   result = false;
  //   error= 'Email valable pour inscription, pas trouvé en BDD'
  // }

  // console.log(user, '<------ user');
  // console.log(result, '<------- result');
  // console.log(error, '<------ erro sent')

  res.json({ result: true })
})

router.post('/sign-up-first-step', async function (req, res, next) {

  const hash = bcrypt.hashSync(req.body.passwordFront, cost);

  var user = await new UserModel({
    token: uid2(32),
    email: req.body.emailFront,
    password: hash,
    pseudo: req.body.pseudoFront,
    birthDate: req.body.birthDateFront,
    problems_types: req.body.problemsFront
  })

  var userSaved = await user.save()
  console.log(userSaved, '<------ userSaved on backend')

  res.json({ userSaved: userSaved })
})

/* Sign-up -> Inscription 
  Body :
      REQUIRED ---> emailFront : (quentin@gmail.com), passwordFront : (XXXXXX), pseudoFront : (HelicoptèreDeCombat), birthDateFront : (12/23/1992) --> vérification majorité , problemsTypesFront : String
      OPTIONALE --> problemDescriptionFront : String, localisationFront : String, genderFront : StringFront, avatarFront : String, 
  Response : result (true), token (1234), birthDate : (12/23/1992), problems_types : String, localisation : String
*/
router.post('/sign-up-second-step', function (req, res, next) {
  res.render('index', { title: 'Express' });
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
  
  var infoContact = await UserModel.findOne(
    {_id: req.query.myContactId}
    )

    console.log("infoContact", infoContact)
    
    var pseudo = infoContact.pseudo
    var avatar = infoContact.avatar

    console.log("pseudo", pseudo)
    console.log("pseudo", pseudo)
  
  var allMessagesWithOneUser = await MessagesModel.find(
    { conversation_id: req.query.convId }
  ).limit(5);

  console.log("allMessagesWithOneUser", allMessagesWithOneUser)

  res.json({ allMessagesWithOneUser, pseudo, avatar })
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
router.post('/send-msg', async function (req, res, next) {
  console.log("MSG", req.body.msg)
  console.log("ID", req.body.myContactId)

  const searchConvWithUser = await ConversationsModel.find({
    participants: { $all: ['603f618c78727809c7e1ad9a', req.body.myContactId] }
  })

  var msg = await new MessagesModel({
    conversation_id: searchConvWithUser._id,
    from_id: myToken,
    to_id: req.body.myContactId,
    content: req.body.msg,
    date: new Date(),
  })

  var mewMsg = await msg.save()

  console.log("searchConvWithUser", searchConvWithUser)


  res.json({result: true});
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
      emailFront: req.body.emailFront,
      localisationFront: req.body.localisationFront,
      passwordFront: req.body.passwordFront,
      genderFront: req.body.genderFront,
      descriptionProblemFront: req.body.descriptionProblemFront
    }
  );


  var userAfterUpdate = await UserModel.findOne({token: req.body.tokenFront})
  console.log(userAfterUpdate, '<---- userAfterUpdate')

  res.json({ userFromBack: userBeforeUpdate });
});

router.post('/loadProfil', async function(req, res, next) {
  var userBeforeUpdate = await UserModel.findOne({token: req.body.tokenFront})
  res.json({ userFromBack: userBeforeUpdate });
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
