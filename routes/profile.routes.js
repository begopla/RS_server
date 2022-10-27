const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const User = require("../models/User.model");
const House = require("../models/House.model");
const jwt = require("jsonwebtoken")
const uploader = require('../config/cloudinary.config')

/**
 *
 * * All the routes are prefixed with `/api/profile`
 *
 */

// C(R)UD -- Read and return current user favourite houses
router.get("/favourites", isAuthenticated, async (req, res, next) => {

    try {
        const userId = req.payload._id;
        const user = await User.findById(userId).populate("bookmarkList");
        const savedMarkets = user.bookmarkList;
        res.status(200).json({
            savedList: savedMarkets,
        });
    } catch (error) {
        next(error)
    }
})

// C(R)UD -- Reade profile information
router.get("/", isAuthenticated, (req, res, next) => {
    res.status(200).json(req.payload);
});

// CR(U)D -- Update user object adding image string
router.put('/', isAuthenticated, uploader.single('profilePicture'), async (req, res, next) => {
    const { profilePicture } = req.body;
    if (req.file) {
        req.body.profilePicture = req.file.path;
    }
    try {
        const user = await User.findByIdAndUpdate(req.payload._id, req.body, { new: true });
        const authToken = jwt.sign(user.toObject(), process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "2d",
        });
        //console.log(profilePicture)
        console.log(user)
        res.status(200).json({
            message: 'File successfully uploaded',
            image: profilePicture,
            user: user,
            token: authToken
        });

    } catch (error) {
        next(error);
    }
});

//CR(U)D -- return ImageURL
router.post('/upload', isAuthenticated, async (req, res, next) => {
    try {
        userObjectImage = req.payload.profilePicture
        console.log(userObjectImage);
        return res.status(200).json({
            message: 'Current user profile picture has been sent',
            user: userObjectImage
        })

    } catch (error) {
        next(error)
    }
});

// CR(U)D -- Update user object adding user preferences 
router.put('/user-info', isAuthenticated, async (req, res, next) => {
    try {
        const { name, email, city} = req.body;
        const user = await User.findByIdAndUpdate(
            req.payload._id,
            {
                name,
                email,
                city,
            },
            { new: true }
        );
        const authToken = jwt.sign(user.toObject(), process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "2d",
        });
        console.log(name, email, city)
        res.status(200).json({

            message: 'User data updated',
            user: user,
            token: authToken

        });

    } catch (error) {
        next(error);
    }
})


module.exports = router;