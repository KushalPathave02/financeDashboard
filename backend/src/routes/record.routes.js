const router = require("express").Router();
const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
} = require("../controllers/record.controller");

const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.use(protect);

router.get("/", authorize("analyst", "admin"), getRecords);
router.post("/", authorize("admin"), createRecord);
router.put("/:id", authorize("admin"), updateRecord);
router.delete("/:id", authorize("admin"), deleteRecord);

module.exports = router;
