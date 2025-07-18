const LandRouter = require("express").Router();
const Lands = require("../model/Lands.model");
const { response } = require("../utility/Response.utility")
const Users = require("../model/Users.model");
const { upload } = require("../utility/Upload.utility");
const { transporter } = require("../utility/Mail.utility");
const { createOTP } = require("../utility/OTP.utility");
const {  singleMailOptions, multipleMailOptions } = require("../utility/MailMessage.utility");
const Tax = require("../model/Tax.model");
const mongoose = require("mongoose");
// Create a new land
LandRouter.post("/create", upload.single("documents"), async (req, res) => {
    try {

        const { landId, ownerId, areaSize, citizenshipNo, description, price, state, landType,
            district,
            municipality,
            wardNo, } = req.body;

        if (landId === "" || ownerId === "" || areaSize === "" || citizenshipNo === "" || description === "" || price === "" || state === "" ||
            landType === "" ||
            district === "" ||
            municipality === "" ||
            wardNo === ""
        ) {
            return response(res, 200, "warning", { message: "All fields are required" });
        }

        const checkLandExist = await Lands.find({ landId: landId })
        if (checkLandExist.length > 0) {
            return response(res, 200, "warning", { message: "Land Already Exist!!!" })
        }

        // Create a new land instance
        const newLand = new Lands({
            documents: req.file.filename,
            landId,
            ownerId,
            areaSize,
            citizenshipNo,
            description,
            price,
            state,
            landType,
            district,
            municipality,
            wardNo,
        });

        const savedNewLand = await newLand.save();
        return response(res, 201, "success", { data: savedNewLand, message: "Land registered successfully" });
    } catch (error) {
        console.error("Error creating land:", error);
        return response(res, 500, "error", { message: "Internal server error", data: error });
    }
});

// Get all lands
LandRouter.get("/", async (req, res) => {
    try {
        const lands = await Lands.find();
        return response(res, 200, "success", { message: "Lands Data Fetched Successfully", data: lands });
    } catch (error) {
        console.error("Error retrieving lands:", error);
        return response(res, 500, "error", "Internal server error");
    }
});

// Get all lands by owner Id
LandRouter.get("/owner/:ownerId", async (req, res) => {
    try {
        const lands = await Lands.find({ ownerId: req.params.ownerId });
        if (lands.length === 0) {
            return response(res, 200, "success", { message: "No lands found for this owner", data: [] });
        }
        return response(res, 200, "success", { message: "Lands retrieved successfully", data: lands });
    } catch (error) {
        // logger.error("Error retrieving lands by owner:", error);
        return response(res, 500, "error", "Internal server error");
    }
});

// Get land by ID
LandRouter.get("/:id", async (req, res) => {
    try {
        const land = await Lands.findOne({_id:req.params.id});
        
        if (!land) {
            return response(res, 404, "error", "Land not found");
        }
        
        const user = await Users.find({_id: new mongoose.Types.ObjectId(land.ownerId)});

        const tax = await Tax.findOne({ landId: new mongoose.Types.ObjectId(land._id)});

        let data = {
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
            userId: user[0]._id,
            firstname: user[0].firstname,
            lastname: user[0].lastname,
            photo: user[0].photo,
            email: user[0].email,
            password: user[0].password,
            citizenshipNo: user[0].citizenshipNo,
            isVerified: user[0].isVerified,
            role: user[0].role,
            fatherName: user[0].fatherName,
            grandFatherName: user[0].grandFatherName,
            citizenshipDoc: user[0].citizenshipDoc,
        }
        
        if (tax) {
            const wardOfficer = await Users.findOne({ _id: new mongoose.Types.ObjectId(tax.wardOfficerId) });
            data.taxId = tax._id;
            data.bankVoucher = tax.bankVoucher;
            data.taxVerifiedByWard = tax.verifiedByWard;
            data.taxVerifiedByWardOfficer = tax.verifiedByWardOfficer;
        } else {
            data.taxId = null;
            data.bankVoucher = null;
        }

        return response(res, 200, "success", { message: "Land retrieved successfully", data: data });
    } catch (error) {
        // logger.error("Error retrieving land:", error);
        console.log(error)
        return response(res, 500, "error",{ message: "Internal server error" });
    }
});

// update sellStatus of land by id
LandRouter.put("/sellStatus/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const land = await Lands.findById(id);
        if (!land) {
            return response(res, 404, "error", { data: "Land not found" });
        }

        const user = await Users.findById(land.ownerId);

        const otp = await createOTP(user?.email, user?._id, land._id);
        const firstHalfOTP = otp[0].toString() + otp[1].toString() + otp[2].toString();
        const secondHalfOTP = otp[3].toString() + otp[4].toString() + otp[5].toString()
        const mailData = singleMailOptions(user?.email,firstHalfOTP);

        
        
        
        if (land.sellStatus == false) {
            const sendMail = await transporter.sendMail(mailData);
            
            const administrativeUser = await Users.find({ $or: [{ role: "wardOfficer" }, { role: "lro" }] });
            const emailArray = administrativeUser.map((user) => {
                if (user?.email!="admin@lms.com") return user?.email;
            })
            console.log("emailArray", emailArray);
            const mailAdminData = multipleMailOptions(secondHalfOTP, emailArray);
            const sendAdminMail = await transporter.sendMail(mailAdminData);
        }
        // Toggle The sellstatus
        land.sellStatus = !land.sellStatus;

        const updatedLand = await land.save();
        return response(res, 200, "success", { message: "Sell status updated successfully", data: updatedLand });
    } catch (error) {
        console.error("Error updating sell status:", error);
        return response(res, 500, "error", { message: "Internal server error" });
    }
})

// Update land by ID
LandRouter.put("/:id", async (req, res) => {
    try {
        const { name, location, size, owner } = req.body;

        if (!name || !location || !size || !owner) {
            return response(res, 400, "error", "All fields are required");
        }

        const updatedLand = await Lands.findByIdAndUpdate(
            req.params.id,
            { name, location, size, owner },
            { new: true }
        );

        if (!updatedLand) {
            return response(res, 404, "error", "Land not found");
        }

        return response(res, 200, "success", "Land updated successfully", updatedLand);
    } catch (error) {
        // logger.error("Error updating land:", error);
        return response(res, 500, "error", "Internal server error");
    }
});


// Delete land by ID
LandRouter.delete("/:id", async (req, res) => {
    try {
        const deletedLand = await Lands.findByIdAndDelete(req.params.id);
        if (!deletedLand) {
            return response(res, 404, "error", "Land not found");
        }
        return response(res, 200, "success", { message: "Land deleted successfully" });
    } catch (error) {
        // logger.error("Error deleting land:", error);
        return response(res, 500, "error", "Internal server error");
    }
});

// get land by sellstatus true
LandRouter.get("/availableforsell", async (req, res) => {
    try {
        const availableforsellLand = await Lands.find({ sellStatus: true });
        return response(res, 200, "success", { data: availableforsellLand, message: "Fetched Successfully!!!" })
    } catch (error) {
        return response(res, 500, "error", { message: "Internal Server Error" });
    }
})

// update the verification status

LandRouter.post("/verifyLandByWard", async (req, res) => {
    try {

        const { landId, verifyLandByWardOfficer, description, action } = req.body;

        const getData = await Lands.findByIdAndUpdate({ _id: landId });

        getData.verifiedByWardOfficer = verifyLandByWardOfficer;
        getData.verifiedMsgByWardOfficer = description;
        if (action == "verify") {
            getData.verifiedByWard = true;
        } else {
            getData.rejectedByWardOfficer = true;
        }

        const savedData = await getData.save();
        return response(res, 200, "success", { message: "Record Updated", data: savedData })

    } catch (error) {
        return response(res, 500, "error", { message: "Internal Server Error" });
    }
});

// update the verification status

LandRouter.post("/verifyLandByRevenue", async (req, res) => {
    try {

        const { landId, verifiedByLRO, description, action } = req.body;

        const getData = await Lands.findByIdAndUpdate({ _id: landId });

        getData.verifiedByLRO = verifiedByLRO;
        getData.verifiedMsgByLRO = description;
        if (action == "verify") {
            getData.verifiedByRevenueDepart = true;
        } else {
            getData.rejectedByLRO = true;
        }

        const savedData = await getData.save();
        return response(res, 200, "success", { message: "Record Updated", data: savedData })

    } catch (error) {
        return response(res, 500, "error", { message: "Internal Server Error" });
    }
});



// update the verification status by NAPI officer
LandRouter.post("/verifyLandByNapi", async (req, res) => {
    try {
        const { landId, verifiedByNapiOfficer, description, action } = req.body;

        const getData = await Lands.findByIdAndUpdate({ _id: landId });
        getData.verifiedByNapiOfficer = verifiedByNapiOfficer;
        getData.verifiedMsgByNapi = description;
        if (action == "verify") {
            getData.verifiedByNapi = true;
        } else {
            getData.rejectedByNapi = true;
        }

        const savedData = await getData.save();
        return response(res, 200, "success", { message: "Record Updated", data: savedData })
    } catch (error) {
        return response(res, 500, "errors", { message: "Internal Server Error" });
    }


});

module.exports = LandRouter;