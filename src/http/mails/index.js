const path = require('path');
const config = require('../../config');
const sgMail = require('@sendgrid/mail');
const { Mail, MailerTemplateSetup } = require('mail-template-sender');
const { SendGridProvider } = require('mail-template-sender/providers');

sgMail.setApiKey(config.email.sgKey);
const sgProvider = new SendGridProvider(sgMail);

const mailer = MailerTemplateSetup.config({
  provider: sgProvider,
  templateDir: path.join(__dirname, 'templates'),
});

const mails = {
  verification: new Mail({
    template: 'verification',
    from: config.email.from,
    subject: 'Email Verification',
  }),
};

mailer.onError((err, mail) => {
  console.error(err)
  console.log(mail)
});

module.exports = {
  mailer: mailer.mailSender,
  mails,
};
