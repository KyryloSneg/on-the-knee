module.exports = class UserDeviceDto {
  id;

  constructor(model) {
      this.id = model._doc._id;
  }
}
