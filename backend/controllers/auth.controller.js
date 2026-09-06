import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"
import { sendOtpMail } from "../utils/mail.js"
export const SignUp = async (req, res) => {
    try {
        //{input details }
        const { fullname, email, password, mobile, role } = req.body
        //{check if the user already exits }
        let user = await User.findOne({ email })
        if(user) {
            return res.status(400).json({ message: "User Already Exists.." })
        }
        else if(mobile.length < 10) {
            return res.status(400).json({ message: "mobile number should atleast be of 10 digits" })
        }
        else if(password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast of 6 characters" })
        }
        //{So as the user don't exists so we now Bcrypt the password}
        const hashedPassword = await bcrypt.hash(password, 10)

        //create user
        user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            mobile,
            role
        })

        //as we have created the user now we generate token 
        const token = await genToken(user._id)

        //so now as the token is generated so we now add the token to the cookie
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.status(201).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message
        })
    }
}


export const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("EMAIL:", email);
        console.log("PASSWORD:", password);

        const user = await User.findOne({ email });

        console.log("USER FOUND:", user);

        if (!user) {
            return res.status(400).json({
                message: "User does not exists"
            });
        }

        const isMatched = await bcrypt.compare(password, user.password);

        console.log("PASSWORD MATCH:", isMatched);

        if (!isMatched) {
            return res.status(400).json({
                message: "Incorrect Password.."
            });
        }
        //as we have created the user now we generate token 
        const token = await genToken(user._id)

        //so now as the token is generated so we now add the token to the cookie
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.status(201).json(user)
    }catch (error) {
    console.log(error);

    return res.status(500).json({
        message: error.message
    });
}
}


export const SignOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "LogOut Successfully" })
    } catch (error) {
        return res.status(400).json(`sign out error ${error}`)
    }
}

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exists" })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetOtp = otp
        user.otpExpire = Date.now() + 5 * 60 * 1000
        user.isOtpVerified = false
        await user.save()
        await sendOtpMail(email, otp)
        return res.status(200).json({ message: "otp sent successfully" })
    } catch (error) {
    console.log(error);

    return res.status(500).json({
        message: error.message
    });
}
}



// export const sendOtp = async (req, res) => {
//     try {
//         console.log("BODY:", req.body);

//         const { email } = req.body;
//         console.log("EMAIL:", email);

//         const user = await User.findOne({ email });
//         console.log("USER:", user);

//         if (!user) {
//             return res.status(400).json({
//                 message: "User does not exists"
//             });
//         }

//         const otp = Math.floor(1000 + Math.random() * 9000).toString();

//         user.resetOtp = otp;
//         user.otpExpire = Date.now() + 5 * 60 * 1000;
//         user.isOtpVerified = false;

//         await user.save();

//         console.log("OTP:", otp);

//         await sendOtpMail(email, otp);

//         return res.status(200).json({
//             message: "otp sent successfully"
//         });

//     } catch (error) {
//         console.log("SEND OTP ERROR:", error);

//         return res.status(500).json({
//             message: error.message
//         });
//     }
// };

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })
        if (!user || user.resetOtp != otp || user.otpExpire < Date.now()) {
            return res.status(400).json({ message: "invalid/expired Otp" })
        }
        user.resetOtp = undefined
        user.isOtpVerified = true
        user.otpExpire = undefined
        await user.save()
        return res.status(200).json({ message: "Opt verified successfully.." })
    } catch (error) {
        return res.status(400).json(`verify otp error ${error}`)
    }
}
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "User does not exists/verification required" })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.isOtpVerified = false
        await user.save()
        return res.status(200).json({ message: "newpassword saved successfully" })
    } catch (error) {
        return res.status(400).json(`resetPassword error ${error}`)
    }
}

export const GoogleAuth = async (req, res) => {
    try {
        const { fullname, email, mobile , role} = req.body
        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({
                fullname,
                email,
                mobile , 
                role
            })
        }


        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({
            message:"google auth error"
        })
    }
}