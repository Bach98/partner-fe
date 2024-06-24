export const utils = {
  swap,
  dateFromStamp,
  isStringOrEmpty,
  isValidFileVideo,
  removeVietnameseTones
}

function swap(array, position1, postition2) {
  let changedArray = array;
  try {
    let object1 = changedArray[position1];
    let object2 = changedArray[postition2];
    changedArray[postition2] = object1;
    changedArray[position1] = object2;
    return changedArray;
  } catch (err) {
    console.log(err);
    return array;
  }
}

function dateFromStamp(stamp) {
  if (stamp) {
    try {
      var date = new Date(stamp);
      return date;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
  return undefined;
}


function isStringOrEmpty(value) {
  return value !== null || value !== "null" || value !== undefined || value !== "undefined" || value !== "" || value !== '""';
}

/**
 * Is valid video
 * @param url string
 */
function isValidFileVideo(fileName) {
  if (isStringOrEmpty(fileName)) {
    var extension = fileName.split('.').pop().toLowerCase();
    var lstEx = ['png', 'gif', 'jpeg', 'jpg', 'bmp'];
    if (lstEx.indexOf(extension) === -1) {
      // Video 
      return true;
    } else {
      // Img
      return false;
    }
  } else {
    return false;
  }
}

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace.replace(/[^\w\s]/gi, '');
  return str;
}