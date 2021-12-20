const localstrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function intialize(passport,getUserByEmail)
{
    const authenticateuser = async(email,password,done) => {
        const user = getUserByEmail(email)
        if(user == null)
        {
            return done(null,false,{message:'no user with that email'});
        }
        try{
            if(await bcrypt.compare(password,user.password))
            {
                return done(null,user)

            } else {
                return done(nul,false,{message :'password incorrect'});
            }
        } catch (e) {
            return done(e)

        }

    }

    passport.use(new localstrategy({usernameField : 'email'}), authenticateuser)
    passport.serializeUser((user,done) => {})
    passport.desserializeUser((user,done) => {})  
}

module.exports = initialize 