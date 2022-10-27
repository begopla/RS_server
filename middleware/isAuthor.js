const House = require("../models/House.model");

const isAuthor = async (req, res, next) => {
	const { houseId } = req.params;
	const house = await House.findById(houseId).populate('author');

	if (req.payload._id === house.author._id.valueOf()) {
		return next()
	}
	return res.status(400).json({ message: "You are not the author" })
}

module.exports = isAuthor;