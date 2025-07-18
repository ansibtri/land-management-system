const singleMailOptions = (email, otp,) => ({
    from: process.env.GMAIL_ACC,
    to: email,
    subject: "Your OTP Code for Land Management System",
    text: `Your One-Time Password (OTP) is: ${otp}. It is valid for 10 minutes.`,
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
            <h2 style="color: #0066cc;">Land Management System</h2>
            <p>Dear User,</p>
            <p>You have requested an action that requires verification.</p>
            <p style="font-size: 18px; font-weight: bold;">Your OTP is: 
                <span style="color: #d63384;">${otp}</span>
            </p>
            <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with any unauthorized person.</p>
            <br>
            <p>If you did not request this OTP, please ignore this email or report it to our support team.</p>
            <hr style="margin-top: 30px;">
            <footer style="font-size: 12px; color: #888;">
                This email was sent by the Land Management System. Please do not reply to this automated message.
            </footer>
        </div>
    `
});

const multipleMailOptions = (otp,ccList=[],email="ourtechsverse@gmail.com") => ({
    from: process.env.GMAIL_ACC,
    to: email,
    bcc: ccList,
    subject: "Your OTP Code for Land Management System",
    text: `Your One-Time Password (OTP) is: ${otp}. It is valid for 10 minutes.`,
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
            <h2 style="color: #0066cc;">Land Management System</h2>
            <p>Dear User,</p>
            <p>You have requested an action that requires verification.</p>
            <p style="font-size: 18px; font-weight: bold;">Your OTP is: 
                <span style="color: #d63384;">${otp}</span>
            </p>
            <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with any unauthorized person.</p>
            <br>
            <p>If you did not request this OTP, please ignore this email or report it to our support team.</p>
            <hr style="margin-top: 30px;">
            <footer style="font-size: 12px; color: #888;">
                This email was sent by the Land Management System. Please do not reply to this automated message.
            </footer>
        </div>
    `
});


module.exports = { singleMailOptions, multipleMailOptions };