const TaxRouter = require("express").Router();
const Tax = require("../model/Tax.model");
const {upload}=require("../utility/Upload.utility");
const {response} = require("../utility/Response.utility");
const mongoose = require("mongoose");
// Create a new tax record
TaxRouter.post("/create",upload.single("documents"),async(req,res)=>{

    try {
        
        const { userId, landId } = req.body;
        
        const bankVoucher = req.file.filename; // Assuming the file is uploaded successfully
        if (!userId || !landId || !bankVoucher) {
            return response(res,400, "error", {message:"Missing required fields"});
        }
        const newTax = new Tax({
            userId,
            landId,
            bankVoucher
        });

        const savedTax = await newTax.save();
        return response(res,200, "success", {message:"Tax record created successfully", data:savedTax});
    } catch (error) {
        console.error("Error creating tax record:", error);
        return response(res,500, "error", {message:"Failed to record tax", error: error.message});
    }
});

// update a tax record
// TaxRouter.put("/update/:id", async(req,res)=>{
//     try {

//         const taxId = req.params.id;
//         const updateData = req.body;
//         console.log("Update Data:", taxId,updateData);

//         const updatedTax = await Tax.findByIdAndUpdate(new mongoose.Types.ObjectId(taxId),
//             {
//                 verifiedByWardOfficer: true,
//                 verifiedWardOfficer: updateData.wardOfficer,
//                 verifiedMsgByWardOfficer: updateData.verifiedMsgByWardOfficer,
//             }
//          );
//         if (!updatedTax) {
//             return response(res,404, "error", {message:"Tax record not found"});
//         }


//         return response(res,200, "success", {message:"Tax record updated successfully", data:updatedTax});
//     } catch (error) {
//         console.error("Error updating tax record:", error);
//         return response(res,500, "error", {message:"Failed to update tax record", error: error.message});
//     };
// })



TaxRouter.put("/update/:id", async (req, res) => {
  try {
    const taxId = req.params.id;
    const updateData = req.body;

    console.log("Update Data:", taxId, updateData);

    if (!mongoose.Types.ObjectId.isValid(taxId)) {
      return response(res, 400, "error", { message: "Invalid Tax ID" });
    }

    const updatedTax = await Tax.findByIdAndUpdate(
      taxId,
      {
        verifiedByWard: true,
        verifiedWardOfficer: updateData.verifiedWardOfficer,
        verifiedMsgByWardOfficer: updateData.verifiedMsgByWardOfficer,
      },
      { new: true } // ✅ return updated document
    );

    console.log(updatedTax);

    if (!updatedTax) {
      return response(res, 404, "error", { message: "Tax record not found" });
    }

    return response(res, 200, "success", {
      message: "Tax record updated successfully",
      data: updatedTax,
    });
  } catch (error) {
    console.error("Error updating tax record:", error);
    return response(res, 500, "error", {
      message: "Failed to update tax record",
      error: error.message,
    });
  }
});

module.exports = TaxRouter;