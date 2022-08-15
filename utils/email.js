const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: "2525",

    secure: false,
    logger: true,
    auth: {
      user: "e265ca17a7a332",
      pass: "14512e5325fd1c",
    },
  });

  const mailOptions = {
    from: "Otoniel Almeida <otonieledward@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
