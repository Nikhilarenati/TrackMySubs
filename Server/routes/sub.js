const express = require("express");
const auth = require("../middleware/auth");
const {
  listSubs,
  createSub,
  updateSub,
  deleteSub,
} = require("../controller/subController");

const router = express.Router();

router.use(auth);

router.get("/", listSubs);
router.post("/", createSub);
router.put("/:id", updateSub);
router.delete("/:id", deleteSub);

module.exports = router;
