module.exports = class EmailToConfirmDto {
  id;
  user
  email;
  isConfirmed;

  constructor(model) {
      this.id = model._id;
      this.user = model.user;
      this.email = model.email;
      this.isConfirmed = model.isConfirmed;
  }
}
