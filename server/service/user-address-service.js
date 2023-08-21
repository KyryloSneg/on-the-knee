const UserAddressModel = require("../models/user-address-model");

class UserAddressService {

  async updateAddress(id, email, phoneNumber) {
    const address = await UserAddressModel.updateOne({ _id: id }, { $set: { email: email, phoneNumber: phoneNumber } });
    return address;
  }

}

module.exports = new UserAddressService();