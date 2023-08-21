const {Schema, model} = require('mongoose');

const ActivationInfoSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  isActivated: {type: Boolean, default: false},
  activationLink: {type: String},
});

module.exports = model('ActivationInfo', ActivationInfoSchema);