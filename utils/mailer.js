const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jobboardmailer@gmail.com',
    pass: 'ozrs lild dbcu ecpr' // Your 16-character App Password
  }
});

const sendStatusEmail = async (to, subject, message) => {
  const mailOptions = {
    from: '"Job Board Team" <jobboardmailer@gmail.com>',  // Friendlier sender name
    to,
    subject,
    text: message,  // fallback for plain-text email clients
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;">
        <h2 style="color:#333;">${subject}</h2>
        <p>${message}</p>
        <hr />
        <p style="font-size:0.9em;color:#555;">
          This is an automated message from the Job Board. Please do not reply.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

module.exports = { sendStatusEmail };
