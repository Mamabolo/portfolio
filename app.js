const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

admin.initializeApp();

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Subject: ${req.body.subject}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'magdel.mamabolo@younglings.africa', // generated ethereal user
        pass: 'Password1'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <magdel.mamabolo@younglings.africa>', // sender address
      to: 'kgadi95@gmail.com', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });

app.listen(3000, () => console.log('Server started...'));

// nodemailer send to email function

function sendmail(name, email, subject, message){

  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: "zulacker.com@gmail.com",
      pass: "zulacker5" 
    }
  });

  // Mail sender transport object
  transporter.sendMail({
    from: "zulacker.com@gmail.com", 
    to: "magdel.mamabolo@younglings.africa", 
    subject: "Firebase Message",
    html: `
    <p><b>Name</b><p>
    ${name}
    <p><b>Email</b><p>
    ${email}
    <p><b>Subject</b><p>
    ${subject}
    <p><b>Message</b><p>
    ${message}
     
    `
  });

 
}


exports.sendToMyEmail = functions.database.ref('/messages/{pushId}')
    .onCreate((snapshot, context) => {

      const original = snapshot.val();
      var name = original.name;
      var email = original.email;
      var subject = original.subject;
      var message = original.message;

      sendmail( name, email, subject, message);
      return null;
    });