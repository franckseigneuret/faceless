var express = require('express');
var router = express.Router();

var userModel = require('../models/user')
var msgModel = require('../models/messages')

router.get('/random-msg', async function (req, res, next) {

  var users = await userModel.find()

  var one = users.splice(Math.floor(Math.random() * users.length), 1)
  var two = users.splice(Math.floor(Math.random() * users.length), 1)
  // console.log(one[0]._id)
  // console.log(two)

  for (let i = 0; i < 10; i++) {


    let who1 = Math.random() > .5 ? one : two
    let who2 = who1 === one ? two : one

    var newMsg = new msgModel({
      from_id: who1[0]._id,
      to_id: who2[0]._id,
      content: 'lorem ' + Math.random(),
      read_user_id1: false,
      read_user_id2: false,
      date: new Date(),
      delete_user_id1: false,
      delete_user_id2: false,
    })
    let msg = await newMsg.save()
    console.log('msg = ', msg)

    let majUser1 = userModel.updateOne(
      {
        id: msg.from_id,
      },
      {
        with_id: msg.to_id,
        archived: false,
        delete: false,
        demande: false,
      })
  }


  res.render('index', { title: 'Save messages between 2 users' });
})
router.get('/random-users', async function (req, res, next) {

  var users = ["Tony", "Matteo", "Maud", "Ines", "Jeremy", "Antoine", "Emeline", "Zoe", "Alan", "Alexis", "Maelle", "Lena",
    "Mathias", "Theo", "Victoire", "Anais", "Aaron", "Louis", "Lise", "Anais", "Jean", "Nicolas", "Ninon"]
  var date = ["1985-02-01", "1987-03-02", "2000-07-03", "1999-02-04", "1976-08-30"]

  var desc = [
    'Praesent et nulla leo. Nam non interdum risus. In venenatis efficitur sem sit amet dictum. Etiam feugiat lacus non odio malesuada, et eleifend ligula hendrerit. Aenean condimentum risus vel iaculis lobortis. Sed venenatis dolor ut sapien pellentesque tempus. Sed id ipsum nibh.',
    'Fusce quis dolor varius, auctor felis at, bibendum velit. Sed in bibendum enim. Pellentesque consectetur, lacus ultrices porta venenatis, tellus lorem faucibus ex, id dapibus quam lorem sit amet lacus. Integer vel nisi venenatis, luctus lacus id, ultrices ex. Proin convallis dui risus.',
    'Sed viverra est orci, at luctus nibh elementum fermentum. Phasellus leo diam, eleifend non facilisis non, cursus scelerisque orci. Proin at lectus ornare, dapibus purus sit amet, mollis dui. ',
    'Nulla pulvinar nulla ac justo eleifend laoreet. Nulla sed enim metus. Quisque cursus quam venenatis finibus aliquam. ',
    'Donec egestas nibh vehicula risus pulvinar interdum. Maecenas ultricies lacus quis lacus feugiat tempus.',
  ]

  var count = 8

  // Save  ---------------------------------------------------
  for (var i = 0; i < count; i++) {

    randomUsers = users[Math.floor(Math.random() * Math.floor(users.length))]
    randomBirthday = date[Math.floor(Math.random() * Math.floor(users.length))]
    randomDesc = desc[Math.floor(Math.random() * Math.floor(users.length))]

    var doesUserNameExist = await userModel.findOne({ pseudo: randomUsers })

    if (doesUserNameExist.length === 0) {

      var newUser = new userModel({
        email: randomUsers + '@gmail.com',
        password: 'azerty',
        pseudo: randomUsers,
        birthDate: randomBirthday,
        is_adult: true,
        problems_types: ['mon problème'],
        problem_description: randomDesc,
        localisation: randomUsers,
        gender: Math.random() > .5 ? 'male' : 'femelle',
        avatar: 'avatar',
        statut: 'statut',
        blocked_user_id: 'blocked_user_id',
        blocked_by_id: 'blocked_by_id',
        // conversations: 'conversations',
      });

      let s = await newUser.save();
      console.log('s = ', s)
    }
  }
  res.render('index', { title: 'Save users' });
});

module.exports = router;