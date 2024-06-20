const express = require('express');
const router = express.Router();

const { authorizeRoles } = require("../middleware/auth");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController');

router.route("/order/new").post(newOrder);

router.route('/order/:id').get(getSingleOrder);

router.route('/orders/me').get(myOrders);

router
    .route('/admin/orders')
    .get(authorizeRoles('admin'), getAllOrders)

router
    .route('/admin/order/:id')
    .put(authorizeRoles('admin'), updateOrder)
    .delete(authorizeRoles('admin'), deleteOrder);
module.exports = router;