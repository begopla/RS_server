const router = require("express").Router();
const authRoutes = require("./auth.routes");
const houseRoutes = require("./house.routes");
const profileRoutes = require("./profile.routes");
const House = require("./house.routes");
/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    const houses = await House.propfind();
    return res.status(200).json(houses);
  } catch (error) {
    
  }
});

router.use("/auth", authRoutes);
router.use("/houses", houseRoutes);
 router.use("/profile", profileRoutes);

module.exports = router;
