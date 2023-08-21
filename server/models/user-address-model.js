const {Schema, model} = require('mongoose');

const UserAddressSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  email: {type: String, unique: true, required: true},
  phoneNumber: {type: String, unique: true, required: true}
});

module.exports = model('UserAddress', UserAddressSchema);