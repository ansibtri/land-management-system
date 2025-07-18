const AuthRouter = require("express").Router();
const Users = require("../model/Users.model");
const { response } = require("../utility/Response.utility");
const bcrypt = require("bcryptjs");
const { logger } = require("../utility/Logger.utility");
const { setCookie } = require("../utility/Cookie.utility");
const { generateJWT, verifyJWT } = require("../utility/AuthJWT.utility");
const jwt = require("jsonwebtoken");
const {upload} = require("../utility/Upload.utility");

AuthRouter.post("/register",upload.single("citizenshipDoc"), async (req, res) => {
    try {
        // check if any variable is empty
        if (
            req.body.email == "" ||
            req.body.firstname == "" ||
            req.body.lastname == "" ||
            req.body.password == "" ||
            req.body.citizenshipNo == "" ||
            req.body.grandFatherName == "" ||
            req.body.fatherName == ""
        ) {
            // response back with warning if variable is empty
            return response(res, 199, "warning", "Field can't be empty");
        }

        // get email and password
        const { email, password, citizenshipNo, ..._ } = req.body;
        // check email in database if it exists
        const user = await Users.findOne({ email: email });
        
        // if email exists send a response
        if (user !== null && user?.email === email) {
            return response(res, 400, "warning", {
                message: "Email Already Exists!!!",
            });
        }

        const citizenshipUser = await Users.findOne({ citizenshipNo: citizenshipNo });
        
        // if citizenship number exists send a response
        if (citizenshipUser != null && citizenshipUser?.citizenshipNo == citizenshipNo) {
            return response(res, 400, "warning", {
                message: "Citizenship Number Already Exists!!!",
            });
        }
       
        
        // Create new account
        const salt = await bcrypt.genSalt(10); // generate salt
        console.log(req.file)
        
        const createNewUser = new Users({
            email: email,
            password: await bcrypt.hash(password, salt),
            citizenshipDoc: req.file.filename,
            citizenshipNo: citizenshipNo,
            ..._,
        });
        
        // save the new user
        const savedNewUser = await createNewUser.save();
        // send response back to client

       
        return response(res, 200, "success", {
            message: "Account Created Successfully!!!",
            user: savedNewUser,
        });
    } catch (error) {
        // log the error
        logger("error", error.message, error.name);
        console.log("Error in registration:", error);
        // return unsuccess response
        return response(res, 400, "error", { message: error?._message });
    }
});


AuthRouter.post("/login", async (req, res) => {
    try {
        // destructuring
        const { email, password, role } = req.body;
        // check if email exists
        if (email == "" || password == "")
            return response(res, 401, "warning", {
                message: "Credentials is missing",
            });

        const user = await Users.findOne({ email: email });
        
        if(user?.role !== role){
            return response(res, 401, "warning", { message: "No users found" });
        }
        if(user?.isVerified === false){
            return response(res, 401, "warning", { message: "User is not verified" });
        }
        
        if (!user?.email)
            return response(res, 401, "warning", { message: "Invalid Credentials" });

        
        const validPassword = await bcrypt.compare(password, user?.password);
        if (!validPassword)
            return response(res, 401, "warning", { message: "Invalid Credentials" });

        const data = {
            phone: user?.contact,
            email: user?.email,
            firstname: user?.firstname,
            lastname: user?.lastname,
            photo: user?.photo,
            id: user?._id,
            firstname: user?.firstname,
            password: user?.password,
            citizenshipNo: user?.citizenshipNo,
        }
        // generate JSON Web Token
        const token = generateJWT(data);
        // set cookie
        setCookie(res, "authToken", token);

        // response back
        return response(res, 200, "success", {
            message: "Logged In!!!",
            token: generateJWT(user),
            data,
        });
    } catch (error) {
        console.log(error)
        logger("error", error._message);
        return response(res, 400, "Failed", error?._message);
    }
});


AuthRouter.post("/cookie", async(req,res)=>{
    try {
        console.log("Cookie request received");
        console.log("Cookies:", req.cookies)
        const { authToken } = req.cookies;

        console.log("Cookie authToken:", authToken);
        
        if (authToken) {
          const token = jwt.verify(authToken, process.env.TOKEN_KEY);
          return res
            .status(200)
            .json({
              user: token.data || null,
              isAuthenticated: true,
              authToken: authToken || null,
            });
        } else {
          return res
            .clearCookie("authToken")
            .status(200)
            .json({ isAuthenticated: false, authToken: null, user: null });
        }
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res
            .clearCookie("authToken")
            .status(200)
            .json({ isAuthenticated: false, authToken: null, user: null });
        }
        if (error.name === "JsonWebTokenError") {
          return res
            .status(200)
            .json({ isAuthenticated: false, authToken: null, user: null });
        }
        if (error.name === "NotBeforeError") {
          return res
            .status(200)
            .json({ isAuthenticated: false, authToken: null, user: null });
        }
        if (error.name === "SyntaxError") {
          return res
            .status(200)
            .json({ isAuthenticated: false, authToken: null, user: null });
        }
        return res.status(400).json({ type: error.name, message: error.message });
      }
});


// logout account
AuthRouter.post("/logout", async (req, res) => {
  try {
    // clear cookies
    res.clearCookie("authToken");
    return response(res, 200, "success", { message: "Logged Out" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = AuthRouter;