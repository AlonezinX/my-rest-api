require("../settings");
const express = require('express');
const router = express.Router();
const passport = require('passport'),
   jwt = require('jsonwebtoken');

const {
   createActivationToken,
   getHashedPassword,
   randomText
} = require('../lib/functions');
const {
   checkEmail,
   checkUsername,
   addUser
} = require('../MongoDB/function');
const {
   notAuthenticated
} = require('../lib/auth');
const sendEmail = require('../lib/email');

router.get('/login', notAuthenticated, (req, res) => {
   res.render('login', {
      layout: 'login'
   });
});

router.post('/login', async (req, res, next) => {
   passport.authenticate('local', {
      successRedirect: '/docs',
      failureRedirect: '/users/login',
      failureFlash: `<div class="alert alert-danger">
                  <button type="button" aria-hidden="true" class="close" data-dismiss="alert" aria-label="Close">
                    <i class="tim-icons icon-simple-remove"></i>
                  </button>
                  <span><b>Nome de usuário ou senha não encontrados</span>
                </div>`,
   })(req, res, next);
});
//Verifikasi email
router.get('/activation/', async (req, res) => {
   let id = req.query.id;
   if (!id) {
      req.flash('error_msg', "Token de ativação inválido")
      res.redirect("/users/register");
   }

   await jwt.verify(id, ACTIVATION_TOKEN_SECRET, async (err, user) => {
      if (err) {
         req.flash('error_msg', "Token de ativação inválido")
         res.redirect("/users/register");
      } else {
         const {
            apikey,
            username,
            email,
            password
         } = user
         let checking = await checkUsername(username);
         let checkingEmail = await checkEmail(email);
         if (checking) {
            req.flash('error_msg', "Desculpe. Um usuário com esse nome já existe. Use outro nome de usuário!")
            res.redirect("/users/signup");
         } else if (checkingEmail) {
            req.flash('error_msg', "Desculpe. Já existe um usuário com esse endereço de e-mail. Por favor, use outro e-mail!")
            res.redirect("/users/signup");
         } else {
            addUser(username, email, password, apikey);
            req.flash('success_msg', "Cadastro bem sucedido. Por favor, faça login para usar nosso serviço.")
            res.redirect("/users/login");
         }
      }
   });
});
router.get('/signup', notAuthenticated, (req, res) => {
   res.render('signup', {
      layout: 'signup'
   });
});

router.post('/signup', async (req, res) => {
   try {
      let {
         email,
         username,
         pass,
         pass2
      } = req.body;
      if (pass.length < 6 || pass2 < 6) {
         req.flash('error_msg', 'A senha deve conter pelo menos 6 caracteres');
         return res.redirect('/users/signup');
      }
      if (pass === pass2) {
         let checking = await checkUsername(username);
         let checkingEmail = await checkEmail(email);
         if (checkingEmail) {
            req.flash('error_msg', 'Já existe um usuário com o mesmo e-mail');
            return res.redirect('/users/signup');
         }
         if (checking) {
            req.flash('error_msg', 'usuário com o mesmo nome de usuário já existe');
            return res.redirect('/users/signup');
         } else {
            let hashedPassword = getHashedPassword(pass);
            let apikey = randomText(10);
            const newUser = {
               apikey,
               username: username,
               email,
               password: hashedPassword
            }
            const activationToken = createActivationToken(newUser)
            const url = `https://${req.hostname}/users/activation?id=${activationToken}`
            await sendEmail.inboxGmailRegist(email, url);
            req.flash('success_msg', 'Agora você está registrado, verifique seu e-mail para verificar sua conta');
            return res.redirect('/users/login');
         }
      } else {
         req.flash('error_msg', 'A senha e a confirmação da senha não são iguais');
         return res.redirect('/users/signup');
      }
   } catch (err) {
      console.log(err);
   }
})

router.get('/logout', (req, res) => {
   req.logout();
   req.flash('success_msg', 'sucesso de logout');
   res.redirect('/users/login');
});

module.exports = router;
