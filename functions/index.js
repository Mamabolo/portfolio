const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

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
