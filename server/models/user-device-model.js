const {Schema, model} = require('mongoose');

const UserDeviceSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    ip: {type: String},
});

module.exports = model('UserDevice', UserDeviceSchema);