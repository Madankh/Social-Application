const router = require("express").Router();
const User = require("../Modals/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken } = require("./verifytoken");
const Post = require("../Modals/Post");
const { generateOTP } = require("./Extra/mail");
const VerificationToken = require("../Modals/VerificationToken");
const JWTSEC = "#2@!@$ndja45883 r7##";
const nodemailer = require('nodemailer');
const ResetToken = require("../Modals/ResetToken");
const crypto = require("crypto");
router.post("/create/user" ,
    body('email').isEmail(),
    body('password').isLength({ min: 6 }) ,
    body('username').isLength({ min: 3 }) ,
    body('phonenumber').isLength({ min: 10}) ,
    async(req , res)=>{
          const error = validationResult(req);
          if(!error.isEmpty()){
                    return res.status(400).json("some error occured")
          }
        //   try {
        
          let user = await User.findOne({email:req.body.email});
          if(user){
                    return res.status(200).json("Please login with correct password")
          };
          const salt = await bcrypt.genSalt(10);
          const secpass = await bcrypt.hash(req.body.password , salt)

          user = await User.create({
                    username:req.body.username,
                    email:req.body.email,
                    password:secpass,
                    profile:req.body.profile,
                    phonenumber:req.body.phonenumber
          })
          const accessToken = jwt.sign({
                    id:user._id,
                    username:user.username
          }, JWTSEC);
          const OTP = generateOTP();
          const verificationToken = await VerificationToken.create({
            user:user._id,
            token:OTP
          });
          verificationToken.save();
          await user.save();
          const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.USER,
              pass: process.env.PASS
            }
          });
          transport.sendMail({
            from:"sociaMedia@gmail.com",
            to:user.email,
            subject:"Verify your email using OTP",
            html:`<h1>Your OTP CODE ${OTP}</h1>`
          })
          res.status(200).json({Status:"Pending" , msg:"Please check your email" , user:user._id})
                  
// } catch (error) {
//           return res.status(400).json("Internal error occured")         
// }
          
})


//verify email
router.post("/verify/email" , async(req , res)=>{
    const {user , OTP} = req.body;
    const mainuser = await User.findById(user);
    if(!mainuser) return res.status(400).json("User not found");
    if(mainuser.verifed === true){
        return res.status(400).json("User already verifed")
    };
    const token = await VerificationToken.findOne({user:mainuser._id});
    if(!token){
        return res.status(400).json("Sorry token not found")
    }
    const isMatch = await bcrypt.compareSync(OTP , token.token);
    if(!isMatch){return res.status(400).json("Token is not valid")};

    mainuser.verifed = true;
    await VerificationToken.findByIdAndDelete(token._id);
    await mainuser.save();
    const accessToken = jwt.sign({
        id:mainuser._id,
        username:mainuser.username
    } , JWTSEC);
    const {password , ...other} = mainuser._doc;
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        }
      });
      transport.sendMail({
        from:"sociaMedia@gmail.com",
        to:mainuser.email,
        subject:"Successfully verify your email",
        html:`Now you can login in social app`
      })
      return res.status(200).json({other , accessToken})

})

//Login
router.post("/login" ,
    body('email').isEmail(),
    body('password').isLength({ min: 6 }) ,
    async(req , res)=>{
        //   const error = validationResult(req);
        //   if(!error.isEmpty()){
        //             return res.status(400).json("some error occured")
        //   }

        //   try {
          const user = await User.findOne({email:req.body.email});
          if(!user){
                  return res.status(400).json("User doesn't found")  
          }

          const Comparepassword = await bcrypt.compare(req.body.password , user.password);
          if(!Comparepassword){
                    return res.status(400).json("Password error")
          }
          const accessToken = jwt.sign({
                    id:user._id,
                    username:user.username
          }, JWTSEC);
          const {password , ...other} = user._doc
          res.status(200).json({other , accessToken});
                    
// } catch (error) {
//             res.status(500).json("Internal error occured")        
// }

})

//Forgot password
router.post("/forgot/password" , async(req , res)=>{
    const {email} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(400).json("User not found");
    }
    const token = await ResetToken.findOne({user:user._id});
    if(token){
        return res.status(400).json("After one hour you can request for another token");
    }

    const RandomTxt = crypto.randomBytes(20).toString('hex');
    const resetToken = new ResetToken({
        user:user._id,
        token:RandomTxt
    });
    await resetToken.save();
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        }
      });
      transport.sendMail({
        from:"sociaMedia@gmail.com",
        to:user.email,
        subject:"Reset Token",
        html:`http://localhost:3000/reset/password?token=${RandomTxt}&_id=${user._id}`
      })

      return res.status(200).json("Check your email to reset password")
    
})


//reset password
router.put("/reset/password" , async(req , res)=>{
    const {token , _id} = req.query;
    if(!token || !_id){
        return res.status(400).json("Invalid req");
    }
    const user = await User.findOne({_id:_id});
    if(!user){
        return res.status(400).json("user not found")
    }
    const resetToken = await ResetToken.findOne({user:user._id});
    if(!resetToken){
        return res.status(400).json("Reset token is not found")
    }
    console.log(resetToken.token)
    const isMatch = await bcrypt.compareSync(token , resetToken.token);
    if(!isMatch){
        return res.status(400).json("Token is not valid");
    }

    const {password} = req.body;
    // const salt = await bcrypt.getSalt(10);
    const secpass = await bcrypt.hash(password , 10);
    user.password = secpass;
    await user.save();
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        }
      });
      transport.sendMail({
        from:"sociaMedia@gmail.com",
        to:user.email,
        subject:"Your password reset successfully",
        html:`Now you can login with new password`
      })

      return res.status(200).json("Email has been send")

})

//Following
router.put("/following/:id" , verifyToken , async(req , res)=>{
    if(req.params.id !== req.body.user){
        const user = await User.findById(req.params.id);
        const otheruser = await User.findById(req.body.user);

        if(!user.Followers.includes(req.body.user)){
            await user.updateOne({$push:{Followers:req.body.user}});
            await otheruser.updateOne({$push:{Following:req.params.id}});
            return res.status(200).json("User has followed");
        }else{
            await user.updateOne({$pull:{Followers:req.body.user}});
            await otheruser.updateOne({$pull:{Following:req.params.id}});
            return res.status(200).json("User has Unfollowed");
        }
    }else{
        return res.status(400).json("You can't follow yourself")
    }
})

//Fetch post from following
router.get("/flw/:id" , verifyToken , async(req , res)=>{
    try {
        const user = await User.findById(req.params.id);
        const followersPost = await Promise.all(
            user.Following.map((item)=>{
                return Post.find({user:item})
            })
        )
        const userPost = await Post.find({user:user._id});

        res.status(200).json(userPost.concat(...followersPost));
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})

//Update User Profile
router.put("/update/:id" , verifyToken , async(req , res)=>{
    try {
        if(req.params.id === req.user.id){
            if(req.body.password){
                const salt = await bcrypt.genSalt(10);
                const secpass = await bcrypt.hash(req.body.password , salt);
                req.body.password = secpass;
                const updateuser = await User.findByIdAndUpdate(req.params.id , {
                    $set:req.body
                });
                await updateuser.save();
                res.status(200).json(updateuser);
            }
        }else{
            return res.status(400).json("Your are not allow to update this user details ")
        }
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})

//Delete User account 
router.delete("/delete/:id" , verifyToken , async(req , res)=>{
    try {
        if(req.params.id !== req.user.id){
            return res.status(400).json("Account doesn't match")
        }else{
            const user = await User.findByIdAndDelete(req.params.id);
            return res.status(200).json("User account has been deleted")
        }
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})

//get user details for post
router.get("/post/user/details/:id" , async(req , res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(400).json("User not found")
        }
        const {email , password , phonenumber , ...others}=user._doc;
        res.status(200).json(others);
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})

//get user to follow
router.get("/all/user/:id" , async(req , res)=>{
    try {
        const allUser = await User.find();
        const user = await User.findById(req.params.id);
        const followinguser = await Promise.all(
            user.Following.map((item)=>{
                return item;
            })
        )
        let UserToFollow = allUser.filter((val)=>{
            return !followinguser.find((item)=>{
                return val._id.toString()===item;
            })
        })

        let filteruser = await Promise.all(
            UserToFollow.map((item)=>{
                const {email , phonenumber , Followers , Following , password , ...others} = item._doc;
                return others
            })
        )

        res.status(200).json(filteruser)
    } catch (error) {
        
    }
})



module.exports = router;