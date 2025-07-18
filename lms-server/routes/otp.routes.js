const OTPRouter = require("express").Router();
const OTP = require("../model/OTPSchema.model");
const Lands = require("../model/Lands.model");
const {response} = require("../utility/Response.utility");
const Users = require("../model/Users.model");

OTPRouter.post("/verifyOTPandSellProcess", async (req, res) => {

    try {
        const { landId, otp, sellerEmail } = req.body;
        console.log("Received data:", { landId, otp, sellerEmail });
        // validate lands
        const land = await Lands.findOne({landId:landId, sellStatus:true});
        if (!land) {
            return response(res, 404, "error", { message: "Land not found" });
        }
        
        console.log("Land found:", land);
        
        // Validate the OTP
        const otpRecord = await OTP.findOne({landId:land?._id,otp});
        
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Check if the OTP has expired
        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        // Check if the seller's email and citizenship number match
        if (otpRecord.email !== sellerEmail) {
            return res.status(400).json({ message: "Seller information does not match" });
        }

        // Proceed with the selling process
        // Here you would typically update the land status and seller information
        const user = await Users.findById(land.ownerId);
        const data = {
            _id: land._id,
            landId: land.landId,
            ownerId: land.ownerId,
            citizenshipNo: land.citizenshipNo,
            areaSize: land.areaSize,
            price: land.price,
            landType: land.landType,
            district: land.district,
            municipality: land.municipality,
            wardNo: land.wardNo,
            state: land.state,
            sellStatus: land.sellStatus,
            verifiedByRevenueDepart: land.verifiedByRevenueDepart,
            verifiedByLRO: land.verifiedByLRO,
            verifiedByWard: land.verifiedByWard,
            verifiedByWardOfficer: land.verifiedByWardOfficer,
            verifiedByNapi: land.verifiedByNapi,
            verifiedByNapiOfficer: land.verifiedByNapiOfficer,
            verificationDate: land.verificationDate,
            verifiedBy: land.verifiedBy,
            rejectedByLRO: land.rejectedByLRO,
            rejectedByNapi: land.rejectedByNapi,
            rejectedByWardOfficer: land.rejectedByWardOfficer,
            verifiedByWardOfficer: land.verifiedByWardOfficer,
            verifiedMsgByLRO: land.verifiedMsgByLRO,
            verifiedMsgByNapi: land.verifiedMsgByNapi,
            verifiedMsgByWardOfficer: land.verifiedMsgByWardOfficer,
            documents: land.documents,
            userId: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            photo: user.photo,
            email: user.email,
            password: user.password,
            citizenshipNo: user.citizenshipNo,
            isVerified: user.isVerified,
            role: user.role,
            isVerified: user.isVerified,
            role: user.role,
            fatherName: user.fatherName,
            grandFatherName: user.grandFatherName,
            citizenshipDoc: user.citizenshipDoc,
        }

        // For demonstration, let's assume we just return a success message
        return response(res, 200, "success", { message: "OTP verified successfully. Proceed with selling process.", data });

    } catch (error) {
        console.log(error);
    }
});
module.exports = OTPRouter;