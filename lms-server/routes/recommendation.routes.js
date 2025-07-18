const RecommendationRouter = require("express").Router();
const { response } = require("../utility/Response.utility");
const { upload } = require("../utility/Upload.utility");
const Recommendation = require("../model/Recommendation.model");
const OTP = require("../model/OTPSchema.model");
const Lands = require("../model/Lands.model");
const Users = require("../model/Users.model");
const mongoose = require("mongoose");



RecommendationRouter.post("/create", upload.single("documents"), async (req, res) => {
    try {

        const { landId, sellerId, buyerId, verifiedByWardOfficer } = req.body;
        const documents = req.file ? req.file.filename : null;
        if (!landId || !sellerId || !buyerId || !documents) {
            return response(res, 400, "error", { message: "All fields are required" });
        }

        if (!verifiedByWardOfficer) {
            return response(res, 400, "error", { message: "Verified by Ward Officer is required" });
        }

        // Check if the landId exists in the database
        const existingRecommendation = await Recommendation.findOne({ landId, sellerId, buyerId });
        if (existingRecommendation) {
            return response(res, 409, "error", { message: "Recommendation already exists for this land" });
        }

        const recommendationData = {
            landId,
            sellerId,
            buyerId,
            documents,
            verifiedByWardOfficer
        };

        const recommendation = new Recommendation(recommendationData);
        const savedData = await recommendation.save();

        return response(res, 201, "success", { data: savedData, message: "Recommendation created successfully" });

    } catch (error) {
        console.log(error);
        return response(res, 500, "error", { message: "Internal server error" });
    }
});


RecommendationRouter.post("/land", async (req, res) => {
    try {

        const { landId, otp, sellerEmail } = req.body;
        if (!landId || !otp || !sellerEmail) {
            return response(res, 400, "error", { message: "Field can't be empty" });
        }
        // validate lands
        const land = await Lands.findOne({ landId: landId, sellStatus: true });
        if (!land) {
            return response(res, 404, "error", { message: "Land not found" });
        }
        // Validate the OTP
        if (!otp) {
            return response(res, 400, "error", { message: "OTP is required" });
        }

        const otpRecord = await OTP.findOne({ landId: land?._id, otp });
        if (!otpRecord) {
            return response(res, 400, "error", { message: "Invalid OTP" });
        }
        // Check if the OTP has expired
        if (otpRecord.expiresAt < new Date()) {
            return response(res, 400, "error", { message: "OTP has expired" });
        }

        // join landId,sellerId,buyerId,verifiedByWardOfficer,
        const recommendations = await Recommendation.find({ landId: land?._id }).populate("landId") // Join with Lands collection
            .populate("sellerId") // Join with Users (seller)
            .populate("buyerId") // Join with Users (buyer)
            .populate("verifiedByWardOfficer"); // Join with Users (officer)


        if (recommendations.length === 0) {
            return response(res, 404, "error", { message: "No recommendations found for this land" });
        }

        return response(res, 200, "success", { message: "Land Fetched Successfully!!!", data: recommendations });
    } catch (error) {
        console.log(error);
        return response(res, 500, "error", { message: "Internal server error" });
    }
});


RecommendationRouter.post("/verifyAndTransfer", async (req, res) => {
    try {
        const { recommendationId, lroId, sellerId, buyerId } = req.body;
        if (!recommendationId || !lroId || !sellerId || !buyerId) {
            return response(res, 400, "error", { message: "Failed To Proceed!!!" });
        }

        const recommendation = await Recommendation.find({ _id: recommendationId, isExpired: false });
        if (!recommendation) {
            return response(res, 404, "error", { message: "Recommendation not found" });
        }
        console.log("Recommendation found:", recommendation[0]);
        recommendation.verifiedByLRO = lroId; // Assuming lroId is the ID of the LRO verifying the recommendation

        const land = await Lands.findById(new mongoose.Types.ObjectId(recommendation[0].landId)); ;
        if (!land) {
            return response(res, 404, "error", { message: "Land not found" });
        }
        land.sellStatus = false; // Mark the land as sold
        land.ownerId = recommendation[0].buyerId; // Transfer ownership to the buyer
        const updatedLand = await land.save();
        recommendation[0].isExpired = true; // Mark the recommendation as expired
        const rec = await recommendation[0].save();

        const deleteOTP = await OTP.deleteOne({landId: recommendation[0].landId});
        if (!deleteOTP) {
            return response(res, 500, "error", { message: "Failed to proceed" });
        }

        return response(res, 200, "success", { message: "Land Transfer Successfully!!!" });

    } catch (error) {
        console.log(error);
        return response(res, 500, "error", { message: "Internal server error" });
    }
});

module.exports = RecommendationRouter;