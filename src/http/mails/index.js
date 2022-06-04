const path = require('path');
const config = require('../../config');
const sgMail = require('@sendgrid/mail');
const { Mail, MailerTemplateSetup } = require('mail-template-sender');
const {
  SendGridProvider,
} = require('mail-template-sender/providers');

const options = {
  method: 'POST',
  url: 'https://api.sendchamp.com/api/v1/sms/send',
  headers: {
    Accept: 'application/json, */*',
    'Content-Type': 'application/json',
    Authorization: 'Bearer sendchamp_live_$2y$10$oDw0g9ACR3DvfGRBT6lgSuq6ihBp6uG/.Q/p810oTqvJhsNsNlmFi'
  },
  form: {
    to: ['+2349052289089'],
    message: 'Test message 6777778',
    sender_name: 'flitaa',
    route: 'dnd'
  }
};

const Provider = require('mail-template-sender/core/Provider');

class SendChampProvider extends Provider {
  async send() {
    
  }
}

sgMail.setApiKey(config.email.sgKey);
const sgProvider = new SendGridProvider(sgMail);

const mailer = MailerTemplateSetup.config({
  templateDir: path.join(__dirname, 'templates'),
  provider: sgProvider,
});

const mails = {
  verification: new Mail({
    template: 'verification',
    from: config.email.from,
    subject: 'Email Verification',
  }),
};

mailer.onError((err, mail) => {
  console.error(err);
  console.log(mail);
});

module.exports = {
  mailer: mailer.mailSender,
  mails,
};
