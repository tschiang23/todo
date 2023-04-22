const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email })

      if (!user) {
        return done(null, false, { message: 'That email is not registered!' })
      }

      const result = await bcrypt.compare(password, user.password)
      if (!result) {
        return done(null, false, { message: 'Email or Password incorrect.' })
      }

      return done(null, user)

    } catch (err) {
      done(err, false)
    }
  }
  ));
  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean()
      done(null, user)
    } catch (err) {
      done(err, null)
    }
  })
}