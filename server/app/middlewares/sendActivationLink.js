import nodemailer from 'nodemailer';

const sendActivationLink = (hash, email) => {
    var transporter = nodemailer.createTransport({
        host: "smtp.us.edu.pl",
        port: 587,
        security: true,
        auth: {
          user: 'mherman1@us.edu.pl',
          pass: 'Predator1'
        }
      });
      
      const text = `Twój adres email został użyty do rejestracji na stronie <a href="${frontEndUrl}">${frontEndUrl}</a>.
      w celu aktywacji konta kliknij w następujący link: <a href="${frontEndUrl}activateUser/${hash}">Link</a>.
      Jeżeli nie rejestrowałeś się na naszej stronie zignoruj tę wiadmość.`;

      var mailOptions = {
        from: "marcin.herman@steganografia.pl",
        to: email,
        subject: 'Aktywacja konta',
        html: text,
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

export default sendActivationLink;