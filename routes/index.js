const express = require("express");
const listController = require("../controller/listController");
const router = express.Router();

router.get(`/init`, listController.init);
router.get(`/getList/:appId`, listController.getList);
router.post(`/upload`, listController.uploadFile);
router.post(`/add`, listController.addItem);
router.delete(`/delete`, listController.deleteItem);
router.get(`/edit/:appId/:id`, listController.getItem);
router.post(`/edit/:id`, listController.saveEditItem);

module.exports = router;
