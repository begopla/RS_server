const router = require("express").Router(); 
const isAuthenticated = require("../middleware/isAuthenticated");
const isAuthor = requestIdleCallback("../middleware/isAuthor.js");
const House = require("../models/House.model");
const User = require("../models/User.model");
const Contact = require("../models/House.model");
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
	{dateFrom: {$regex: `${q}`, $options: 'i'}},
	{type: {$regex: `${q}`, $options: 'i'}},
	{address: {$regex: `${q}`, $options: 'i'}},
    {price: {$regex: `${q}`, $options: 'i'}},
    {size: {$regex: `${q}`, $options: 'i'}} 
	]
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
		const allContacts = await Review.find({house:houseId}).populate('author');
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
       console.log(house);
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
        const {name, imageCover, type, typeOfFlat, author, description, address, dateFrom, floor, showAddress, price, deposit, additionalGuarantee, preferredContact, condition, size, bedrooms, bathrooms, orientation, equipment, elevator, energyCertificate, otherfeatures, maxNumTenants, children, petFriendly, reducedMobility, visitsNeeded, photosNeeded} = req.body;
        if (!name || !type || !description || !address || !dateFrom || !showAddress || !price || !deposit || !size || !bedrooms || !bathrooms || !equipment || !elevator ||!energyCertificate || !visitsNeeded || !photosNeeded) {
			return res.status(400).json({ message: "Please, comple all required information" })
		}
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
                additionalGuarantee,
                preferredContact,
                condition,
                size,
                bedrooms,
                bathrooms,
                orientation,
                equipment,
                elevator,
                energyCertificate,
                otherfeatures,
                maxNumTenants,
                children,
                petFriendly,
                reducedMobility,
                visitsNeeded,
                photosNeeded
            }
        );
        return res.status(200).json(house)
    } catch (error) {
        next (error);
    }
});

//Save house

//Remove saved house

//Contact house owner