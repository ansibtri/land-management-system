const nodemailer = require("nodemailer");

const email = process.env.GMAIL_ACC;


function replaceUnderscoreWithSpace(str) {
  return str.replace(/_/g, ' ');
}
const pass = replaceUnderscoreWithSpace(process.env.G_APP_PSW);


const transporter = nodemailer.createTransport({
    port: 465,
    host:"smtp.gmail.com",
    auth:{
        user:email,
        pass:pass,
    },
    secure:true
});


module.exports= {transporter};