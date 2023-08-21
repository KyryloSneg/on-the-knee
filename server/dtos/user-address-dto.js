module.exports = class UserAddressDto {
  id;
  user
  email;
  phoneNumber;

  constructor(model) {
      this.id = model._id;
      this.user = model.user;
      this.email = model.email;
      this.phoneNumber = model.phoneNumber;
  }
}
