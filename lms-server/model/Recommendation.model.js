const { Schema, model } = require("mongoose");

const RecommendationSchema = new Schema(
  {
    landId: { type: Schema.Types.ObjectId, required: true, ref: "Lands" },
    sellerId: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
    buyerId: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
    description: { type: String },
    documents:{type:String, default:''},
    verifiedByWardOfficer: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
    verifiedByLRO: { type: Schema.Types.ObjectId, ref: "Users" },
    isExpired: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("Recommendation", RecommendationSchema); // Changed model name to "User"

