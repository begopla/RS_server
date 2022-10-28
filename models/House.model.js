const {Schema, model} = require("mongoose");

const houseSchema = new Schema(
{
    name: {type: String, 
        //required: true
    }, 
    imageCover: {
        type: String, 
        default: 'https://www.sinrumbofijo.com/wp-content/uploads/2016/05/default-placeholder.png'
    },
    type: {
        type: String,
        enum: ["Flat", "House or chalet", "Rustic house"],
       // required: true
    },
    typeOfFlat:{
        type: String,
        enum:["Flat", "Penthouse", "Duplex", "Studio/Loft"]
    },
    author: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    },
    description: {
        type: String,
       // required: true
    },
    address:{
        coordinates: [Number, Number],
        city: String

    },
    dateFrom: {
        type: Date,
      //  required: true
    },
    floor: Number,
    showAddress:{
        type: String,
        enum: ["NoAddress", "FullAddress", "PartialAddress" ],
     //   required: true
    },
    price: {
        type: Number, 
      //  required: true
    },
    deposit: {
        type: String,
        enum:["1 month", "2 months", "3 months"],
       //required: true
    },
    preferredContact: {
        type: String,
        enum: ["email", "phone"]
    },
    condition:{
        type: String,
        enum:["toReform", "goodCondition"]
    },
    size: {
        type: Number,
       // required: true
    },
    bedrooms: {
        type: Number,
       // required: true,
    },
    bathrooms: {
        type: Number,
      //  required: true,
    },
    orientation:{
        type:String,
        enum:["Exterior", "Inside", "North", "South", "East", "West"]
    },
    equipment:{
        type: String,
        enum:["Unequipped kitchen and house without furniture", "Equipped kitchen and house without furniture","Equipped kitchen and furnished house"],
       // required: true
    },
    elevator: {
        type: Boolean,
        //required: true
    },
    energyCertificate:{
        type: String,
        enum:["not yet available", "A", "B", "C", "D","E", "F", "G","In process", "Exempt property"],
    },
    otherFeatures:{
        type: [String],
        enum: ["Build-in cabinets", "Air-conditioning", "Terrace", "Balcony", "Storage room", "Parking place", "Swimming pool", "Green area"]
    },
    maxNumTenants:Number,
    children: Boolean,
    petFriendly: Boolean,
    reducedMobility: Boolean,
    visitsNeeded: {
        type:Boolean,
    },
    photosNeeded: {
        type: Boolean,
    }
});

const House = model("House", houseSchema);

module.exports = House;