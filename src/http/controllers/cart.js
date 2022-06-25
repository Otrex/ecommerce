const RequestHandler = require('.');
const CartService = require('../services/cart.service');
const {
  AddToCartValidator,
  DeleteFromCartValidator,
} = require('../validators');

class CartController {
  static addToCart = RequestHandler({
    validator: AddToCartValidator,
    handler: CartService.addToCart,
  });

  static getCart = RequestHandler({
    handler: CartService.getCart,
  });

  static checkoutCart = RequestHandler({
    handler: CartService.checkoutCart,
  });

  static getCheckoutDetails = RequestHandler({
    handler: CartService.getCheckoutDetails,
  });

  static deleteItemFromCart = RequestHandler({
    validator: DeleteFromCartValidator,
    handler: CartService.deleteItemInCart,
  });
}

module.exports = CartController;
