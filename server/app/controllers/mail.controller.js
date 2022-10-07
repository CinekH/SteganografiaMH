import express from 'express';

import nodemailer from 'nodemailer';

const router = express.Router();

export const sendMail = async (req, res) => {
  const { name, fromAddress, toAddress, subject, text, encodedImage } = req.body;
  try {

    var transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        security: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

      var mailOptions = {
        from: `"${name}" <${fromAddress}>`,
        to: `${toAddress}`,
        subject: `${subject}`,
        text: `${text}`,
        attachments: [
            {
                path: `${encodedImage}`
            }
        ]
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
      
    res.status(200).json({ message: "Na podany przez ciebie adres email została wysłana wiadomość z załączonym obrazem" });
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: "Coś poszło nie tak, spróbuj ponownie poźniej" });
  }
};

export default router;