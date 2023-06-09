const router = require('express').Router()
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/users/login');
  });
});

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body

    const user = await User.findOne({ email })

    if (user) {
      console.log('Email already exists.')
      return res.render('register', { name, email, password, confirmPassword })
    }

    const hash = await bcrypt.hash(password, 10)
    await User.create({
      name, email, password: hash
    })

    res.redirect('/')

  } catch (err) {
    console.log(err)
  }




})

module.exports = router