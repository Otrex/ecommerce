const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const sendChamp = require('../lib/sendChamp');
const Handlebars = require('handlebars')

class MailService {
  constructor(templatePath) {
    this.templateSources = {}
    readdirSync(templatePath)
      .filter((temp) => temp.includes('.hbs'))
      .forEach(($path) => {
        this.templateSources[
          $path.replace('.hbs', '')
        ] = this.#compileTemplates(join(templatePath, $path));
      });
  }

  #compileTemplates(templatePath) {
    const source = readFileSync(templatePath, 'utf8');
    return Handlebars.compile(source);
  }

  async sendVerificationMail(email, firstName, code){
    await sendChamp.sendEmail(
      'Email Verification',
      { email, firstName },
      this.templateSources['email-verify']({
        code
      })
    )
  }
}

module.exports = new MailService(join(__dirname, '..', 'mails')); 