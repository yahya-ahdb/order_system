const Users = require("../models/authModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  // role_id == 0 && admin
  try {
    const password = req.body.password;
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    const newUser = new Users({ ...req.body, password: hashedPassword });
    await newUser.save();
    res.status(201).send("create");
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.LoginAuth = async (req, res) => {
    try {
      const user = await Users.findOne({ email: req.body.email });
      if (!user) return res.status(401).send("Email or password is not found");
      
      const passwordIsTrue = CryptoJS.SHA256(req.body.password).toString(
        CryptoJS.enc.Hex
      );
      
      if (passwordIsTrue !== user.password)
        return res.status(401).send("Email or password is not found");
  
      const userDataToSend = { ...user._doc, password: null };
      const token = jwt.sign(
        { id: user._id, role_id: user.role_id },
        process.env.SEC_JWT
      );
      res.status(200).json({ user: userDataToSend, token, success: true });
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
