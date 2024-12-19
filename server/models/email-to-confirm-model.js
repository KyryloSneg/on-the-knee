const {Schema, model} = require('mongoose');
const { EMAIL_TO_CONFIRM_EXPIRES_AFTER_S } = require("../consts");

const EmailToConfirmSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  email: {type: String, unique: true, required: true},
  isConfirmed: {type: Boolean, default: false},
  confirmationLink: {type: String},
  expireAt: { 
    type: Date,  
    default: Date.now,
    // 3 days to expire
    expires: EMAIL_TO_CONFIRM_EXPIRES_AFTER_S 
  }
});

module.exports = model('EmailToConfirm', EmailToConfirmSchema);