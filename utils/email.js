const { options } = require('mongoose');
const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');

module.exports = class Email {
    constructor(user,url){
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Ashok <${process.env.EMAIL_FROM}>`;
    }

    newTransport(){
        // Create a transporter
        if(process.env.NODE_ENV==='development'){
            return nodemailer.createTransport({
                host : process.env.EMAIL_HOST,
                port : process.env.EMAIL_PORT,
                auth : {
                    user : process.env.EMAIL_USERNAME,
                    pass : process.env.EMAIL_PASSWORD
                }
            })
        }
        else{
            return 1;
            // return nodemailer.createTransport({
            //     service:'SendGrid',
            //     auth : {
            //         user : process.env.SENDGRID_USERNAME,
            //         pass : process.env.SENDGRID_PASSWORD
            //     }
            // })
        }
    }

    async send(template,subject){
        //send the actual mail
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
            firstName : this.firstName,
            url : this.url,
            subject
        });
        // Define the email options
        const mailOptions = {
        from : this.from,
        to : this.to,
        subject,
        html,
        text : htmlToText.fromString(html)
    };

    //Create a transport and send email.
    await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome(){
        await this.send('welcome','Welcome to the Natours family!!');
    }

    async sendPasswordReset(){
        await this.send('passwordReset', 'Your password reset token(valid for next 10 mins)');
    }
};
