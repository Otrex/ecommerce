const axios = require('axios');
const config = require('../../config');

class SendChamp {
  senderName = '';
  constructor (token) {
    this.token = token;
    this.headers = {
      Accept: 'application/json, */*',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }

  async sendSMS (phoneNumber, message, route = 'dnd') {
    await axios({
      method: 'POST',
      url: 'https://api.sendchamp.com/api/v1/sms/send',
      headers: {
        ...this.headers
      },
      form: {
        to: [phoneNumber],
        sender_name: this.senderName,
        message,
        route,
      }
    })
  }

  async sendEmail () {
    const emailUrl = 'https://api.sendchamp.com/api/v1/email/send'

    await axios({
      
    })
  }
}

module.exports = new SendChamp(config.email.sendChampKey);