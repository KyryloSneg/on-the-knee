const {Schema, model} = require('mongoose');

const TokenSchema = new Schema({
    userDevice: {type: Schema.Types.ObjectId, ref: 'UserDevice'},
    refreshToken: {type: String, required: true},
})

module.exports = model('Token', TokenSchema);