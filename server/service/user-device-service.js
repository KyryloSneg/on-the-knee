const { default: axios } = require("axios");

class UserDeviceService {

  // move it into the frontend
  async getUserDeviceIp() {
    const { data } = await axios.get("https://api64.ipify.org?format=json");
    return data.ip;
  }

}

module.exports = new UserDeviceService();