var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sign-up', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sign-in', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sign-out', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/show-card', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/show-msg', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/show-convers', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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
