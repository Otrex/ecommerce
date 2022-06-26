const db = require('../models/TimedToken');
const { generateNumbers } = require('../../scripts/utils');
const moment = require('moment');

class TimeToken {
  static create(key, type) {}

  hasExp(m) {
    return new Date(m).getTime() > Date.now();
  }

  async generate(key, type, accountId, expIn = 1, n = 5) {
    let token = generateNumbers(n);
    while (true) {
      let $ex = await db.findOne({
        accountId,
        token,
        type,
      });

      if (!$ex) break;

      if (this.hasExp($ex.expiryTimestamp)) {
        await db.deleteOne({ _id: $ex._id });
        $ex = undefined;
      }
    }

    await db.create({
      expiryTimestamp: moment().add(expIn, 'hour').toDate().getTime(),
      token: generateNumbers(nod),
      accountId,
      type,
    });
  }
  invalidate(token, type) {}
  checkValidity(token, type) {}
}

module.exports = TimeToken;
