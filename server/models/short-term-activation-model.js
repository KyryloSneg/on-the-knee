const {Schema, model} = require('mongoose');
const { SHORT_TERM_EMAIL_EXPIRES_AFTER_S } = require("../consts");

const ShortTermActivationEmailSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  email: {type: String, unique: true, required: true},
  activationLink: {type: String, required: true},
  expireAt: { 
    type: Date,  
    default: Date.now,
    // 1 minute before it expires
    expires: SHORT_TERM_EMAIL_EXPIRES_AFTER_S 
  }
});

module.exports = model('ShortTermActivationEmail', ShortTermActivationEmailSchema);