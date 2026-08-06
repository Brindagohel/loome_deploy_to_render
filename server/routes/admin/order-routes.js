const express = require("express");

const { getAllOrderOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus, deleteOrder } = require('../../controllers/admin/order-controller');

const router = express.Router();



router.get("/get", getAllOrderOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);
router.delete("/delete/:id", deleteOrder);




module.exports = router;