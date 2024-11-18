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

  static getFileFromBase64(base64) {
    const base64Data = base64.replace(/^data:.+;base64,/, '');
    const byteCharacters = atob(base64Data); // decode Base64 string
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    
    // we don't use file names, so doesn't matter what will it be
    const file = new File([byteArray], "placeholder");
    return file;
  }

}