const { Schema, model } = require("mongoose");
const Users = require("./Users.model"); // Import Users model
const Lands = require("./Lands.model"); // Import Lands model

const TaxSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        landId: { type: Schema.Types.ObjectId, ref: "Lands", required: true },
        bankVoucher: { type: String, required: true },
        verifiedByWard: { type: Boolean, default: false },
        verifiedMsgByWardOfficer: { type: String, default: "" },
        verifiedWardOfficer: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = model("Tax", TaxSchema); // Changed model name to "Tax"