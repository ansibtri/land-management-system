const UserRouter = require("express").Router();
const Users = require("../model/Users.model");
const { response } = require("../utility/Response.utility");

// get all unverified users
UserRouter.get("/unverified", async (req, res) => {
    try {
        const users = await Users.find({ isVerified: false });
        console.log(users)
        if (users.length === 0) {
            return response(res, 200, "success", { message: "No unverified users" });
        }
        return response(res, 200, "success", { data: users, message: "Unverified users fetched successfully" });
    } catch (error) {
        console.error("Error fetching unverified users:", error);
        return response(res, 500, "error", { message: "Internal server error" });
    }
})


// verify user
UserRouter.patch("/verify/:id", async (req, res) => {
    const userId = req.params.id;
    console.log(userId)
    try {
        console.log(userId)
        const user = await Users.findById({ _id: userId });
        if (!user) {
            return response(res, 404, "warning", { message: "User not found" });
        }
        user.isVerified = true;
        await user.save();
        return response(res, 200, "success", { message: "User verified successfully" });
    } catch (error) {
        console.error("Error verifying user:", error);
        return response(res, 500, "error", { message: "Internal server error" });
    }
})


// fetch user by email and citizenship number
UserRouter.post("/fetchbuyer", async (req, res) => {
    
    const { buyerEmail, buyerCitizenshipNo } = req.body;
    try {
        const user = await Users.findOne({ email: buyerEmail, citizenshipNo: buyerCitizenshipNo });
      
        if (!user) {
            return response(res, 404, "warning", { message: "User not found" });
        }

        return response(res, 200, "success", { data: user, message: "User fetched successfully" });

    } catch (error) {
        console.error("Error fetching user by email and citizenship number:", error);
        return response(res, 500, "error", { message: "Internal server error" });
    }
});

module.exports = UserRouter;