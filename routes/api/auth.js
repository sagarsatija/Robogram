const express=require('express');
const router=express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const auth=require('../../middleware/auth');
const User=require('../../models/Users')
router.get('/',auth, async(req,res) => {

    try {
        const user=await User.findById(req.user.id).select('-passowrd');
        res.json(user)
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})
router.post(
    "/",
    [
      check("email", "Please include a valid email").isEmail(),
      check(
        "password",
        "Please enter password"
      ).exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid Credentials" }] });
        }
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res
            .status(400)
            .json({ errors: [{ msg: "Invalid Credentials" }] });
        }
        const payload = {
          user: {
            id: user.id,
          },
        };
  
        jwt.sign(payload, 
            config.get("jwtSecret"),{expiresIn:36000},(err,token)=>{
            if(err) throw err;
  
            res.json({token});
        });
      } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
      }
    }
  );
  

module.exports=router;