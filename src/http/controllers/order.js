const RequestHandler = require('.');
const OrderService = require('../services/order.service');

class OrderController {
  static stats = RequestHandler({
    handler: OrderService.stats
  })
}

module.exports = OrderController;