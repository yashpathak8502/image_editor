var express = require('express');
var router = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local');
var userModel = require('./users');
const multer = require("multer");
passport.use(new localStrategy(userModel.authenticate()));
var Jimp = require('jimp');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "-" + file.originalname)
  }
})

const upload = multer({ storage: storage })

router.get('/', function (req, res, next) {
  res.render('index');
});

router.post("/register", function (req, res) {
  const userData = new userModel({
    name: req.body.name,
    username: req.body.username,
    gender: req.body.gender,
    email: req.body.email
  })
  userModel.register(userData, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate('local')(req, res, function () {
        res.render('login');
      })
    })
    .catch(function (e) {
      res.send(e);
    })
})

router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/profile',
    failureRedirect: '/'

  }), function (req, res, next) { });

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) throw err;
    res.render('login');
  });
})

router.get('/loginpg', function (req, res, next) {
  res.render('login');
});


router.get('/profile', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (foundUser) {
      res.render("profile", { foundUser })
    })
});



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect('/');
  }
}


router.get("/deleteall", function (req, res) {
  userModel.deleteMany({}).then(function (data) {
    res.send("all data is deleted")
  });
})

router.post("/picture", isLoggedIn, upload.single("pics"), function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (ekUser) {
      ekUser.image = req.file.filename
      ekUser.save()
        .then(function () {
          res.redirect("/profile");
        })
    })
})

router.get('/invert/:image', isLoggedIn, function (req, res) {

  userModel.findOne({ username: req.session.passport.user })
    .then(function (loggedinuser) {
      Jimp.read(`./public/images/${req.params.image}`, (err, lenna) => {
        if (err) throw err;
        lenna
          .invert()
          .write("./public/images/invertedimg.jpg"); // save
        loggedinuser.image = "invertedimg.jpg";
        loggedinuser.save()
          .then(function () {

            res.redirect("/profile")
          })

      })
    })
})
router.get('/quality/:image', isLoggedIn, function (req, res) {

  userModel.findOne({ username: req.session.passport.user })
    .then(function (loggedinuser) {
      Jimp.read(`./public/images/${req.params.image}`, (err, lenna) => {
        if (err) throw err;
        lenna
          .quality(6)
          .write("./public/images/invertedimg.jpg"); // save
        loggedinuser.image = "invertedimg.jpg";
        loggedinuser.save()
          .then(function () {

            res.redirect("/profile")
          })

      })
    })
})

router.get('/greyscale/:image', isLoggedIn, function (req, res) {

  userModel.findOne({ username: req.session.passport.user })
    .then(function (loggedinuser) {
      Jimp.read(`./public/images/${req.params.image}`, (err, lenna) => {
        if (err) throw err;
        lenna
          .greyscale()
          .write("./public/images/invertedimg.jpg"); // save
        loggedinuser.image = "invertedimg.jpg";
        loggedinuser.save()
          .then(function () {

            res.redirect("/profile")
          })

      })
    })
})

router.get('/blur/:image', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (loggedinuser) {
      Jimp.read(`./public/images/${req.params.image}`, (err, lenna) => {
        if (err) throw err;
        lenna
          .blur(10)
          .write("./public/images/invertedimg.jpg"); // save
        loggedinuser.image = "invertedimg.jpg";
        loggedinuser.save()
          .then(function () {

            res.redirect("/profile")
          })

      })
    })
})

router.get('/brightness/:image', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (loggedinuser) {
      Jimp.read(`./public/images/${req.params.image}`, (err, lenna) => {
        if (err) throw err;
        lenna
          .brightness(0.2)
          .write("./public/images/invertedimg.jpg"); // save
        loggedinuser.image = "invertedimg.jpg";
        loggedinuser.save()
          .then(function () {

            res.redirect("/profile")
          })

      })
    })
})

router.get('/contrast/:image', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (loggedinuser) {
      Jimp.read(`./public/images/${req.params.image}`, (err, lenna) => {
        if (err) throw err;
        lenna
        .contrast( 0.5)
          .write("./public/images/invertedimg.jpg"); // save
        loggedinuser.image = "invertedimg.jpg";
        loggedinuser.save()
          .then(function () {

            res.redirect("/profile")
          })

      })
    })
})

router.get('/resize/:image', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (loggedinuser) {
      Jimp.read(`./public/images/${req.params.image}`, (err, lenna) => {
        if (err) throw err;
        lenna
      .resize(50, 50) 
        .write("./public/images/invertedimg.jpg"); // save
        loggedinuser.image = "invertedimg.jpg";
        loggedinuser.save()
          .then(function () {
            res.redirect("/profile")
          })
      })
    })
})

router.get('/blur/:image/:blurval', isLoggedIn, function (req, res) {
  var bv=Number(req.params.blurval);
  userModel.findOne({ username: req.session.passport.user })
    .then(function (loggedinuser) {
      Jimp.read(`./public/images/${req.params.image}`, (err, lenna) => {
        if (err) throw err;
        lenna
          .blur(bv)
          .write("./public/images/invertedimg.jpg"); // save
        loggedinuser.image = "invertedimg.jpg";
        loggedinuser.save()
          .then(function () {

            res.redirect("/profile")
          })
      })
    })
})

module.exports = router;

