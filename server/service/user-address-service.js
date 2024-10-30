const ApiError = require("../exceptions/api-error");
const UserAddressModel = require("../models/user-address-model");
const EmailToConfirmModel = require("../models/email-to-confirm-model");
const uuid = require("uuid");
const { EMAIL_TO_CONFIRM_EXPIRES_AFTER_S } = require("../consts");
const mailService = require("./mail-service");
const { parsePhoneNumber } = require('libphonenumber-js');
const UserAddressDto = require("../dtos/user-address-dto");

class UserAddressService {

  async changeEmail(newEmail, userId) {
      const address = await UserAddressModel.findOne({user: userId});
      
      if (!address) throw ApiError.BadRequest("The user doesn't exist");
      if (address.email === newEmail) throw ApiError.BadRequest("You have passed the same email as the current one");

      // deleting existing emails to confirm of the user to reset the confirmation operation
      await EmailToConfirmModel.deleteMany({user: userId});

      const currentEmailInConfirmationList = await EmailToConfirmModel.findOne({email: address.email});
      if (currentEmailInConfirmationList) throw ApiError.BadRequest("This email is already tried to be confirmed");

      const emailToConfirm = await EmailToConfirmModel.findOne({user: userId});
      if (emailToConfirm) {
        if (emailToConfirm.email === newEmail) throw ApiError.BadRequest("This email is already tried to be confirmed");
      }
      
      const currentEmailConfirmationLink = uuid.v4();
      const newEmailConfirmationLink = uuid.v4();

      // creating corresponding emails that needs to be confirmed by user later on
      await EmailToConfirmModel.create({ 
          user: userId, 
          email: address.email, 
          isConfirmed: false, 
          confirmationLink: currentEmailConfirmationLink, 
          expireAt: new Date() 
      });

      await EmailToConfirmModel.create({ 
          user: userId, 
          email: newEmail, 
          isConfirmed: false, 
          confirmationLink: newEmailConfirmationLink, 
          expireAt: new Date() 
      });

      const linkForCurrEmailMail = `${process.env.API_URL}/api/activate/${currentEmailConfirmationLink}?isChangingEmail=true`;
      const linkForNewEmailMail = `${process.env.API_URL}/api/activate/${newEmailConfirmationLink}?isChangingEmail=true`;

      const expiresAfterHours = Math.round(EMAIL_TO_CONFIRM_EXPIRES_AFTER_S / 3600);
      const expireDurationString = `${expiresAfterHours} hour${expiresAfterHours > 1 ? "s" : ""}`;

      // sending the activation mails
      await mailService.sendActivationMail(address.email, linkForCurrEmailMail, expireDurationString);
      await mailService.sendActivationMail(newEmail, linkForNewEmailMail, expireDurationString);
  }

  async changePhoneNumber(newPhoneNumber, userId) {
      const address = await UserAddressModel.findOne({user: userId});

      const numberObj = parsePhoneNumber(newPhoneNumber);
      const internationalNumber = numberObj.formatInternational();

      if (address.phoneNumber !== internationalNumber) {
        address.phoneNumber = internationalNumber;
        await address.save();
      }

      const addressDto = new UserAddressDto(address);
      return addressDto;
  }

}

module.exports = new UserAddressService();