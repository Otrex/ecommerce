const models = require('../models');

class WaitingListService {
  static addToWaitingList = async ({ email, otherDetails }) => {
    const waitList = await models.WaitingList.create({
      email,
      otherDetails,
    });

    return {
      message: 'user added to waitlist successfully',
      data: waitList,
    };
  };
}

module.exports = WaitingListService;
