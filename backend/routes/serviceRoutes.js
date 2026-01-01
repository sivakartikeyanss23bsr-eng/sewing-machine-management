const router = require("express").Router();
const {
  createServiceRequest,
  getAllServiceRequests
} = require("../controllers/serviceController");

router.post("/", createServiceRequest);
router.get("/", getAllServiceRequests);

module.exports = router;
