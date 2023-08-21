module.exports = class ActivationInfoDto {
  id;
  user
  isActivated;

  constructor(model) {
      this.id = model._id;
      this.user = model.user;
      this.isActivated = model.isActivated;
  }
}
