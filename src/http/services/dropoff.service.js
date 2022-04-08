const models = require('../models');
const ObjectId = require('mongoose').Types.ObjectId;

class DropOffService {
  static createDropOff = async ({ items }) => {
    const newItems = items.map((item) => ({
      quantity: item.quantity,
      weightId: ObjectId(item.weightId),
      categoryId: ObjectId(item.categoryId),
    }));

    const dropOff = new models.DropOff();
    dropOff.orderNo = Math.floor(Math.random() * 999999);

    newItems.forEach((item) => {
      dropOff.items.push(item);
    });

    return { data: await dropOff.save() };
  };
}

module.exports = DropOffService;
