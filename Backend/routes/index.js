var express = require('express');
var router = express.Router();

const UserModel = require('../models/users');
const ConversationsModel = require('../models/conversations')
const SignalementModel = require('../models/signalement')
const MessagesModel = require('../models/messages');
const DeletedUserModel = require('../models/DeletedUsers');

var bcrypt = require('bcrypt');
var uid2 = require('uid2');

const cost = 10;

var ObjectId = require('mongodb').ObjectId;
const { request } = require('express');
const { count } = require('../models/users');


/* GET home page. */
router.get('/', async function (req, res, next) {

});


router.post('/email-check', async function (req, res, next) {

  var user = await UserModel.findOne({ email: req.body.emailFront })

  var result;
  var error;

  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var testEmail = regex.test(String(req.body.emailFront).toLowerCase());
  if (testEmail == false) {
    res.json({ result: false, error: 'Ça ne ressemble pas à un email valide !' })
  } else if (user) {
    res.json({ result: false, error: 'Cet email est déjà associé à un compte existant' })
  } else {
    res.json({ result: true })
  }
});


router.post('/pseudo-check', async function (req, res, next) {
  var user = await UserModel.findOne({ pseudo: req.body.pseudoFront })
  var result;
  var error;
  if (user) {
    result = true;
    error = 'Ce pseudo est déjà utilisé'
  } else {
    result = false;
    error = 'Ce pseudo est disponible'
  }

  res.json({ result, error })
});


router.post('/sign-up-first-step', async function (req, res, next) {

  const hash = bcrypt.hashSync(req.body.passwordFront, cost);
  var birthDate = new Date(req.body.birthDateFront)
  var dateToday = new Date()
  var dateCompare = dateToday - birthDate
  var conditionDate = (86400000 * 365) * 18
  var isAdult;

  if (dateCompare > conditionDate) {
    isAdult = true
  } else {
    isAdult = false
  }

  var user = await new UserModel({
    token: uid2(32),
    email: req.body.emailFront,
    password: hash,
    pseudo: req.body.pseudoFront,
    birthDate: req.body.birthDateFront,
    subscriptionDate: new Date(),
    problems_types: JSON.parse(req.body.problemsFront),
    is_adult: isAdult,
    statut: 'active',
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
router.post('/sign-up-second-step', async function (req, res, next) {
  var localisation = req.body.localisation;
  var gender = req.body.genderFront;
  var problemDesc = req.body.problemDescriptionFront;
  var avatar = req.body.avatarFront;
  req.body.localisationFront == 'undefined' || req.body.localisationFront == undefined ? localisation = 'France' : localisation = JSON.parse(req.body.localisationFront);
  req.body.genderFront == 'undefined' ? gender = '' : gender = req.body.genderFront;
  req.body.problemDescriptionFront == 'undefined' ? problemDesc = '' : problemDesc = req.body.problemDescriptionFront;
  req.body.avatarFront == 'undefined' ? avatar = 'https://i.imgur.com/Xqf1Ilk.png' : avatar = req.body.avatarFront;



  var user = await UserModel.updateOne(
    { token: req.body.tokenFront }, // ciblage à gauche de la virgule
    {
      problem_description: problemDesc,
      gender: gender,
      localisation: localisation,
      avatar: avatar,
    }
  );

  var userUpdated = await UserModel.findOne({ token: req.body.tokenFront })
  console.log(userUpdated, '<------- USER UPDATED')
  var result;
  user ? result = true : result = false

  res.json({ result: result });
});


/* sign-in -> Connexion
body : emailFront : (quentin@gmail.com), passwordFront : (XXXXXX)
response : result (true), token : 1234
*/
router.post('/sign-in', async function (req, res, next) {

  var result = false;
  let user = null;
  var error = [];
  var token = null;

  console.log('ici')
  console.log(error)

  if (req.body.emailFromFront == ''
    || req.body.passwordFromFront == ''
  ) {
    error.push('champs vides')
  }


  user = await UserModel.findOne({
    email: req.body.emailFromFront,
  })
  console.log(user, 'user find sign in ');

  // user = await UserModel.findOne({
  //   email: req.body.emailFromFront,
  //   // et le PWD pour sécuriser  
  // })
  // console.log(user, 'user find sign in ');

  if (user) {
    if (bcrypt.compareSync(req.body.passwordFromFront, user.password)) {
      token = user.token
      result = true
    } else {
      error.push('mot de passe incorrect')
    }
  } else {
    error.push('email incorrect')
  }


  res.json({ result, user, token, error });
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
  var filterFront = JSON.parse(req.query.filterFront);
  //traitement date avec années bissextiles prisent en compte
  var todayYear = new Date().getFullYear();
  var ageMinFilter = filterFront.age.minAge;
  var ageMaxFilter = filterFront.age.maxAge;
  var dateMinMillisecondes = new Date() - ((86400000 * 365) * ageMinFilter);
  var dateMaxMillisecondes = new Date() - ((86400000 * 365) * ageMaxFilter);
  var dateMin = new Date(dateMinMillisecondes);
  var dateMax = new Date(dateMaxMillisecondes);
  var countBissextileAgeMin = Math.ceil((todayYear - dateMin.getFullYear()) / 4)
  var countBissextileAgeMax = Math.ceil((todayYear - dateMax.getFullYear()) / 4)
  var dateMinCondition = new Date(dateMin - (countBissextileAgeMin * 86400000));
  var dateMaxCondition = new Date(dateMax - (countBissextileAgeMax * 86400000));
  //
  var user = await UserModel.findOne({ token: req.query.tokenFront });

  console.log(req.query.tokenFront, '<----- token from front')
  var conversations = await ConversationsModel.find({
    participants: ObjectId(user._id),
  })


  var conversationsWithId = []

  if (conversations != undefined) {
    for (var i = 0; i < conversations.length; i++) {
      conversations[i].participants[0] == user._id ? conversationsWithId.push(conversations[i].participants[1]) : conversationsWithId.push(conversations[i].participants[0])
    }
  }

  var userToDisplay = await UserModel.find({
    token: { $ne: req.query.tokenFront },
    _id: { $nin: conversationsWithId },
    is_adult: user.is_adult,
    birthDate: { $gte: new Date((dateMaxCondition).toISOString()), $lt: new Date((dateMinCondition).toISOString()) },
  })


  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    console.log(lat1, lat2, lon1, lon2)
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  var userToShow = [];
  for (let i = 0; i < userToDisplay.length; i++) {
    if (filterFront.problemsTypes.some((element) => userToDisplay[i].problems_types.includes(element)) == true &&
      filterFront.gender.includes(userToDisplay[i].gender) == true &&
      user.blocked_user_id.includes(userToDisplay[i]._id) == false &&
      user.blocked_by_id.includes(userToDisplay[i]._id) == false) {
      userToShow.push(userToDisplay[i]);
    }
  }

  let userFilterOnLocation = [];
  if (filterFront.localisation == 'France') {
    res.json({ userToShow: userToShow, user: user })
  } else {
    for (var i = 0; i < userToShow.length; i++) {

      if (userToShow[i].localisation.coordinates[0]) {
        let distance = getDistanceFromLatLonInKm(user.localisation.coordinates[0], user.localisation.coordinates[1], userToShow[i].localisation.coordinates[0], userToShow[i].localisation.coordinates[1])
        if (distance <= filterFront.localisation) {
          userFilterOnLocation.push(userToShow[i])
        }
      }
    }
    res.json({ userToShow: userFilterOnLocation, user: user });
  }
});


/**
 * récupère l'id utilisateur à partir du token
 */
router.get('/get-id-from-token', async function (req, res, next) {

  if (req.query && req.query.token === '') {
    res.json({
      error: true
    })
  }

  const me = await UserModel.findOne({
    token: req.query.token
  })

  if (me) {
    res.json({
      error: false,
      id: me._id
    })
  } else {
    res.json({
      error: true,
      id: undefined,
    })
  }
})

/**
 * show-msg -> afficher les différentes conversations avec les users.
 * query : tokenFront: 1234
 * response : [{pseudo (sender) : String, date (dernier message) : date, avatar (sender) : String, last_message : String, demande : boolean, is_read (nombre de messages non-lus) : Number, delete : boolean, conversation_id : 1234}] 
 **/
router.get('/show-msg', async function (req, res, next) {

  let friendsData = []
  let conversations = []
  let askNewConversation = false
  let nbNewConversations = 0

  if (req.query.demandes && req.query.demandes === 'oui') {
    askNewConversation = true
  }

  if (req.query && req.query.user_id === '') {
    res.json({
      conversations
    })
  }

  const myConnectedId = req.query.user_id

  const user = await UserModel.findById(myConnectedId)

  const blockedBy = user.blocked_by_id
  const allBlockedId = blockedBy.concat(user.blocked_user_id)

  // console.log("allBlockedId", allBlockedId)

  // compter le nb de demandes de conversation
  const allConversations = await ConversationsModel.find({
    participants: { $in: [myConnectedId], $nin: allBlockedId },
  })
  // console.log("allConversations", allConversations)
  allConversations.forEach(element => {
    nbNewConversations = element.demand === true ? ++nbNewConversations : nbNewConversations
  });

  // load les conversations avec mes contacts
  const conversationsPerPart = await ConversationsModel.find({
    participants: { $in: [myConnectedId], $nin: allBlockedId },
    demand: askNewConversation,
  })

  // console.log('conversationsPerPart = ', conversationsPerPart)

  await Promise.all(conversationsPerPart.map(async (element, index) => {
    // compter les messages non lus par l'utilisateur de l'app
    var allUnreadMsg = await MessagesModel.find({
      conversation_id: element._id,
      to_id: new ObjectId(myConnectedId),
      read: false,
    })

    // construit un tableau listant le dernier message de chaque conversation
    var lastMsg = await MessagesModel.find({
      conversation_id: element._id
    })
      .sort({ date: -1 })
      .limit(1)

    // construit un tableau des infos de mes contacts (avatar, pseudo...)
    const notMe = element.participants[0] == myConnectedId ? element.participants[1] : element.participants[0]
    let myFriend = await UserModel.findById(notMe)

    // le confindent est Online ?? analyse date dernier message
    const lastMsgFriend = await MessagesModel.findOne({
      from_id: notMe,
    }).sort({ date: -1 })

    // console.log("lastMsgFriend", lastMsgFriend)

    now = new Date()

    let statusOnLine = 'off'
    if (lastMsgFriend) {
      statusOnLine = now - lastMsgFriend.date < 900000 ? 'on' : 'recent'    // - de 15 min, soit 1000 * 15 * 60 = 900000 ms
      statusOnLine = now - lastMsgFriend.date < 1800000 ? 'recent' : 'off'  // - de 30 min, soit 1000 * 30 * 60 = 1800000 ms
      if (myFriend) { // si !null (cas utilisateur supprimé DB)
        myFriend = { ...myFriend.toObject(), statusOnLine }
      }
    }

    friendsData.push(myFriend)
    conversations.push({
      nbUnreadMsg: allUnreadMsg.length,
      lastMessage: lastMsg[0],
      friendsDatas: myFriend,
    })
  }))

  // tri du tableau 
  conversations.sort((a, b) => {
    // par date dernier message
    if (a.lastMessage && b.lastMessage) {
      return a.lastMessage.date > b.lastMessage.date ? -1 : 1
    }
  })
  conversations.sort((a, b) => a.nbUnreadMsg > b.nbUnreadMsg ? -1 : 1) // messages non lus en 1er


  res.json({
    conversations,
    nbNewConversations,
  })
});


/* show-convers -> afficher la conversation avec les autres utilisateurs.
query : conversationIdFront : 1234     ou     tokenFront : 1234
response : collection message qui est liée et conversation_id.    OU : variable contenant 10 objets (10 dernières conv) contenant avatar, pseudo, contenu du message
*/
router.get('/show-convers', async function (req, res, next) {

  var infoContact = await UserModel.findOne(
    { _id: req.query.myContactId }
  )

  var pseudo = infoContact.pseudo
  var avatar = infoContact.avatar

  var allMessagesWithOneUser = await MessagesModel.find(
    { conversation_id: req.query.convId }
  ).sort({ date: 1 });

  // les messages non lus deviennent lus
  console.log('req.query.token == ', req.query.token)
  if (req.query.token != null) {
    console.log('tooook', req.query.token)

    const me = await UserModel.findOne({
      token: req.query.token
    })
    if (me) {
      await MessagesModel.updateMany({ to_id: me._id }, { read: true })
    }
  }

  res.json({ allMessagesWithOneUser, pseudo, avatar })
});

/* send-msg -> envoyer un message.
body : conversationIdFront : 1234, fromIdFront: 12453, toIdFront: 11234, contentFront: 'il est né le divin enfant'
response : newMessageData
*/
router.post('/send-msg', async function (req, res, next) {

  const searchConvWithUser = await ConversationsModel.findOne({
    participants: { $all: [req.body.myId, req.body.myContactId] }
  })

  var msg = new MessagesModel({
    conversation_id: searchConvWithUser._id,
    from_id: req.body.myId,
    to_id: req.body.myContactId,
    content: req.body.msg,
    date: new Date(),
    read: false
  })

  var newMsg = await msg.save()

  let demandEnd = false

  if (searchConvWithUser.demand) {
    var allMsg = await MessagesModel.find(
      { conversation_id: searchConvWithUser._id }
    )

    for (var i = 0; i < allMsg.length; i++) {
      if (allMsg[i].to_id == req.body.myId) {
        // condition fonctionnelle mais à améliorer
        var updateStatusConv = await ConversationsModel.updateOne(
          { _id: searchConvWithUser._id },
          { demand: false }
        );
        demandEnd = true
      }
    }
  }

  res.json({ result: true, demandEnd });
});

router.post('/create-conv', async function (req, res, next) {
  console.log(" req.body.myContactId", req.body.myContactId)
  console.log(" req.body.myId", req.body.myId)

  var conv = new ConversationsModel({
    participants: [req.body.myContactId, req.body.myId],
    demand: true
  })

  var newConv = await conv.save()

  res.json({
    result: true,
    convId: newConv._id,
  });
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
router.post('/signalement-help', async function (req, res, next) {


  var user = await UserModel.findOne({ token: req.body.tokenFront })
  var confident = await UserModel.findOne({ _id: req.body.confidentIdFront })

  signalementFind = await SignalementModel.findOne({
    user_emitter_id: user._id,
    user_receiver_id: confident._id,
    type: req.body.typeFront
  })

  var reason;
  req.body.reasonFront == '' ? reason = req.body.reasonOtherFront : reason = req.body.reasonFront;

  console.log(user, '<-------- USER')
  console.log(confident, '<-------- confident');


  if (signalementFind == undefined) {
    var newSignalement = new SignalementModel({
      type: req.body.typeFront,
      reason: reason,
      user_emitter_id: user._id,
      user_receiver_id: confident._id
    });
    var signalementSave = await newSignalement.save();
  }

  console.log(signalementSave, '<------- signalement saved');

  res.json();
});

router.post('/block-user', async function (req, res, next) {

  console.log('coucou');
  var user = await UserModel.findOne({ token: req.body.tokenFront });

  var userUpdate = await UserModel.updateOne(
    { token: req.body.tokenFront },
    { $push: { blocked_user_id: req.body.confidentIdFront } }
  );

  var confidentUpdate = await UserModel.updateOne(
    { _id: req.body.confidentIdFront },
    { $push: { blocked_by_id: user._id } }
  );
  console.log('coucou 2');

  res.json({ result: true, message: "L'utilisateur a été bloqué" });
});

/* loadProfil : mettre à jour les information en BDD de l'utilisateur qui modifie son profil. */
router.post('/loadProfil', async function (req, res, next) {

  var userBeforeUpdate = await UserModel.findOne({ token: req.body.tokenFront })

  console.log(userBeforeUpdate, 'userBeforeUpdate loadProfil')

  res.json({ userFromBack: userBeforeUpdate });
});

/* update-profil : mettre à jour les information en BDD de l'utilisateur qui modifie son profil.
body: emailFront: hervé@gmail.com, localisationFront: Saint-Dié, genderFront: 'Female', passwordFront: 'camionpompier75', descriptionProblemFront: 'urticaire', problemsFront: ['Familiale', 'Physique']
response: userSaved
*/
router.put("/update-profil", async function (req, res, next) {

  const hash = bcrypt.hashSync(req.body.passwordFront, cost);

  var userBeforeUpdate = await UserModel.findOne({ token: req.body.tokenFront })
  console.log(userBeforeUpdate, '<---- userBeforeUpdate')

  var problemsTypeParse = JSON.parse(req.body.problemsTypeFront)

  // ajout du genre et descriptionProblemFront
  var userUpdate = await UserModel.updateOne(
    { token: req.body.tokenFront },
    {
      avatar: req.body.avatarFront,
      email: req.body.emailFront,
      localisation: JSON.parse(req.body.localisationFront),
      password: hash,
      gender: req.body.genderFront,
      problem_description: req.body.descriptionProblemFront,
      problems_types: problemsTypeParse,
    }
  );

  var userAfterUpdate = await UserModel.findOne({ token: req.body.tokenFront })
  console.log(userAfterUpdate, '<---- userAfterUpdate')

  var result;
  userAfterUpdate ? result = true : result = false

  res.json({ userSaved: userAfterUpdate, result });
});

/* delete-my-profil: au clic sur le toggle sur supprimer mon compte, je veux modifier le statut de l'utilisateur en BDD 
body: tokenFront : 1234,
response: result: true
*/
router.post('/delete-my-profil', async function (req, res, next) {

  console.log('click du back')
  var userSupp = await UserModel.findOne(
    { token: req.body.tokenFront }
  );

  var userDeleted = await new DeletedUserModel({
    id: userSupp.token,
    email: userSupp.email,
  })

  var user = await userDeleted.save();

  var result;
  user ? result = true : result = false

  res.json({ userDeleted, result });
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
router.post('/delete-convers', async function (req, res, next) {

  await ConversationsModel.deleteOne(
    { _id: req.body.convId }
  );
  res.render('index', { title: 'Express' });
});

module.exports = router;
