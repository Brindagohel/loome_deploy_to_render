
const express = require('express');

const {
addToCart,
fetchCartItems,
updateCartItemQty,
deleteCartItem
} = require('../../controllers/shop/cart-controller');

const router = express.Router();

router.post('/add', addToCart);
router.get('/:userId', fetchCartItems);
router.put('/update/:userId/:productId', updateCartItemQty);
router.delete('/delete/:userId/:productId', deleteCartItem);

module.exports = router;

