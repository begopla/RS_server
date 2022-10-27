const {Schema, model} = require("mongoose");

const contactSchema = new Schema(
    {
        house: {type: Schema.Types.ObjectId, ref: "House", required: true},
        author: {type: Schema.Types.ObjectId, ref: "User", required: true},
        message: {type: String, maxLength:350, required: true},
        date: {type: Date, default: Date.now}
    }
);

const Contact = model("Contact", contactSchema);

module.exports = Contact;