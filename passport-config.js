const LocalStrategy = require("passport-local").Strategy

const bcrypt = require("bcrypt")
const user = require("./db_schemes/user.js")

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {

        const userToCheck = await getUserByEmail(email)
        if (userToCheck == null) {
            return done(null, false, { message: "No user with that email" })
        }
        try {

            if (await bcrypt.compare(password, userToCheck.password)) {
                return done(null, userToCheck)
            } else {
                return done(null, false, { message: "Password incorrect" })
            }
        } catch (error) {
            return done(error)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((userToCheck, done) => done(null, userToCheck.id))
    passport.deserializeUser((id, done) => done(null, getUserById(id)))
}



module.exports = initialize