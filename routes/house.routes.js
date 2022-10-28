const router = require("express").Router(); 
const isAuthenticated = require("../middleware/isAuthenticated");
const isAuthor = require("../middleware/isAuthor.js");
const House = require("../models/House.model");
const User = require("../models/User.model");
const Contact = require("../models/Contact.model");
const uploader = require('../config/cloudinary.config');
/**
 *
 * * All the routes are prefixed with `/api/houses`
 *
 */

//Display houses creted by user

router.get("/my-houses", isAuthenticated, async (req, res, next) => {
    try {
        const houses = await House.find().populate('author');
        const userId = req.payload._id;

        const housesByAuthor = [];
        for(let i = 0; i < houses.length; i++)
        {
            const currentHouse = houses[i];
            const houseAuthorID = currentHouse.author._id;
            const houseID = houseAuthorID.valuOf();
            if(houseID == userId)
                housesByAuthor.push(currentHouse);
        }
        return res.status(200).json(housesByAuthor);

    } catch (error) {
        next(error);
    }
});

//Display search results

router.get("/search", async (req, res, next) => {
	const q = req.query.q;
	const options = [
	{dateFrom: {$gte:Date(q)}},
	{type: {$regex: `${q}`, $options: 'i'}},
	{address: {$regex: `${q}`, $options: 'i'}},
    {price: {$lte: q}},
    {size: {$lte: q}} 
	];
    //console.log("req.query: ", req.query)
	//console.log("q: ", q)
	try {
		const searchResults = await House.find({$or: options})
		//console.log(searchResults.length, " search results")
		return res.status(200).json(searchResults);
	} catch (error) {
		next(error);
	}
});

//Display house detail page
router.get("/:houseId", async (req, res, next) => {
	try {
		const { houseId } = req.params;
		const house = await House.findById(houseId).populate('author');
		const allContacts = await Contact.find({house:houseId}).populate('author');
		//console.log(house, allContacts)
		
		return res.status(200).json({house, allContacts})
	} catch (error) {
		next(error)
	}
});

//Edit house details

router.put("/:houseId", isAuthenticated, isAuthor,  async (req, res, next)=> {
   // const {name, imageCover, type, typeOfFlat, author, description, address, dateFrom, floor, showAddress, price, deposit, additionalGuarantee, preferredContact, condition, size, bedrooms, bathrooms, orientation, equipment, elevator, energyCertificate, otherfeatures, maxNumTenants, children, petFriendly, reducedMobility, visitsNeeded, photosNeeded} = req.body;
   try {
       const { houseId } = req.params;
       const house = await House.findByIdAndUpdate(houseId, req.body, {new:true});
       console.log('req params', req.body )
       return res.status(200).json(house);
   } catch (error) {
    next(error);
   } 
});

// Delete house 

router.delete("/:houseId", isAuthenticated, isAuthor, async(req, res, next) => {
    try {
        const { houseId } = req.params;
        await House.findByIdAndDelete(houseId);
        return res.status(200).json({ message: `House ${houseId} deleted`})
    } catch (error) {
        next(error);
    }
});

//Create new house

router.post("/", isAuthenticated, uploader.single('imageUrl'), async (req, res, next) => 
{
    try {
        const {name, imageCover, type, typeOfFlat, author, description, address, dateFrom, floor, showAddress, price, deposit, preferredContact, condition, size, bedrooms, bathrooms, orientation, equipment, elevator, energyCertificate, otherFeatures, maxNumTenants, children, petFriendly, reducedMobility, visitsNeeded, photosNeeded} = req.body;
        // if (!name || !type || !description || !address || !dateFrom || !showAddress || !price || !deposit || !size || !bedrooms || !bathrooms || !equipment || !elevator ||!energyCertificate || !visitsNeeded || !photosNeeded) {
		// 	return res.status(400).json({ message: "Please, comple all required information" })
		
        const house = await House.create(
            {
                 name,
                 imageCover,
                 type,
                 typeOfFlat,
                 author: req.payload,
                 description,
                 address,
                 dateFrom,
                 floor,
                 showAddress,
                 price,
                 deposit,
                 preferredContact,
                 condition,
                 size,
                 bedrooms,
                 bathrooms,
                 orientation,
                 equipment,
                 elevator,
                 energyCertificate,
                 otherFeatures,
                 maxNumTenants,
                 children,
                 petFriendly,
                 reducedMobility,
                 visitsNeeded,
                 photosNeeded
          }
          

        );
        // console.log('req:', req.body);
        // console.log('house', house)
        return res.status(200).json(house)
    } catch (error) {
        next (error);
    }
});

//Save house as favourite

router.post("/:houseId/savedfavourites", isAuthenticated, async (req, res, next) =>{

    try {
       const { houseId } = req.params;
       const newUser = await User.findByIdAndUpdate(
        req.payload._id,
        {
            $addToSet: {bookmarkList: houseId}
        },
        {new: true}
       ); 
       return res.status(200).json({message: `House ${houseId} saved as favourite`,
				users: newUser.bookmarkList });
    } catch (error) {
        next(error)
    }
});

//Remove saved house from favourite list

router.post("/:houseId/removefav", isAuthenticated, async (req, res, next) =>{

	try {
		const { houseId } = req.params;
		
		const newUser = await User.findByIdAndUpdate(
			req.payload._id,
			{$pull: {bookmarkList: houseId}},
			{new: true}
		);
		return res.status(200).json({message: `House ${houseId} removed from favourite list`,
				users: newUser.bookmarkList});
	} catch (error) {
		next(error);
	}
});

//Contact house owner (message)

router.post("/:houseId/message", isAuthenticated, async(req, res, next) => {
    try {
        const { houseId } = req.params;
        const { message } = req.body;
        const newMessage = await Contact.create({
            house: houseId,
            author: req.payload._id,
            message
        });
        //const allMessages = await Contact.find();
       // console.log(allMessages);
        // const currentMessages = [];
        // for (let i = 0; i < allMessages.length; i++)
        // {
        //     const currentHouseId = allMessages[i].house.valueOf();
        //     if(currentHouseId === houseId)
        //         currentMessages.push(allMessages[i]);
        // }
        // console.log('messages:', currentMessages);
        return res.status(200).json({message: 'Message created', 
                newMessage
          });
    } catch (error) {
        next (error);
    }
});

module.exports = router;