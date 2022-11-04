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
        enum: ["Apartment", "Chalet", "Rustic house", ],
       // required: true
    },
    typeOfFlat:{
        type: String,
        enum:["Apartment", "Penthouse", "Duplex", "Studio", "Loft"]
    },
    author: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    },
    price: {
        type: Number, 
      //  required: true
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
    condition:{
        type: String,
        enum:["New", "GoodCondition","ToReform", "Reformed"]
    },
    orientation:{
        type:String,
        enum:["Exterior", "Inside", "North", "South", "East", "West"]
    },
    description: {
        type: String,
        // required: true
    },
    dateFrom: {
        type: Date,
      //  required: true
    },
    deposit: {
        type: String,
        enum:["1 month", "2 months", "3 months"],
       //required: true
    },
    address:{
        coordinates: [Number, Number],
        city: String

    },
    floor: Number,
    showAddress:{
        type: String,
        enum: ["NoAddress", "FullAddress", "PartialAddress" ],
     //   required: true
    },
    preferredContact: {
        type: String,
        enum: ["email", "phone"]
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