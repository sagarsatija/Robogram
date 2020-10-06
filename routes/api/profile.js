const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {check,validationResult}=require('express-validator')
const Profile = require("../../models/Profile");
const User = require("../../models/Users");

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if(!profile){
        return res.status(400).json({msg:'There is no profile for this user'})
    }
    res.send(Profile)
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.post('/',[auth,[check('status','Status is required').not().isEmpty(),check('skills','skills is required').not().isEmpty()]],
async (req,res)=>{
const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

const {company,website,location,bio,status,githubusername,skills,youtube,facebook,twitter,instagram,linkedin} = req.body;

const profileFields={};
profileFields.user=req.user.id;
})

module.exports = router;
