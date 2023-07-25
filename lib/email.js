require ("../settings");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const mailer = {
  inboxGmailRegist: (email, codeverify) => {
    try {
      const inboxGmail = `<div
        style="width: 600px; height: 500px;margin: auto;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
        <div
            style="line-height: 2; letter-spacing: 0.5px; position: relative; padding: 10px 20px; width: 540px;min-height: 360px; margin: auto; border: 1px solid #DDD; border-radius: 14px;">
            <h3>Bem-vindo ao anya api - uma incrível API REST!</h3>
            <p>
                Obrigado por inscrever-se! Você deve seguir este link 
                dentro de 30 minutos após o registro para ativar sua conta:
            </p>
            <a style="cursor: pointer;text-align: center; display: block; width: 160px; margin: 30px auto; padding: 10px 10px; border: 1px solid #00FFFA; border-radius: 14px; color: #FF5700; text-decoration: none; font-size: 1rem; font-weight: 500;"
                href="${codeverify}">Verifique sua conta</a>
            <span style="display: block;">Se você não está fazendo essa ação, por favor Se você não está fazendo essa ação, por favor
sinta-se livre para ignorar este email<br>
<br>
Se você tiver qualquer problema, entre em contato via <span
                    style="color: #4D96FF;"><a href="https://api.whatsapp.com/send?phone=558898204406">WhatsApp</a></span></span>
            <span style="display: block;"><br>Cumprimentos,<br>alonezxkk</span>
        </div>
    </div>
      `;

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          // ENV
          user: your_email,
          pass: email_password,
        },
      });
      let mailOptions = {
        from: '"AloneOfc" <no-reply@gmail.com>',
        to: email,
        subject: `Verificar e-mail - anya api`,
        html: inboxGmail,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.log(err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
};
module.exports = mailer;
