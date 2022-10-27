const router = require("express").Router();
const authRoutes = require("./auth.routes");
const houseRoutes = require("./house.routes");
const profileRoutes = require("./house.routes");
/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRoutes);
router.use("/houses", houseRoutes);
router.use("/profile", profileRoutes);

module.exports = router;
