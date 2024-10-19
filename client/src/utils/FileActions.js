export default class FileActions {
  
  static getBase64(file) {
    const reader = new FileReader();

    return new Promise(resolve => {
      reader.onload = e => {
        resolve(e.target.result);
      }
      reader.readAsDataURL(file);
    })
  }

}