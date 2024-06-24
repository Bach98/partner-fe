import md5 from 'md5';
import moment from 'moment';
import { commonConstants } from '../constants';

class StringFormatHelper {
  toVNDate = miniseconds => {
    let newDate = new Date(miniseconds)
    let day = newDate.getDate();
    let month = newDate.getMonth();
    let year = newDate.getFullYear();
    return day.toString() + '/' + (month + 1).toString() + '/' + year;
  }
  toVNDateByString = (input) => {
    let result = input.toString().indexOf('T') === -1 ? moment(input).format('YYYY-MM-DD') + 'T17:00:00Z' : input
    return moment(result).format('DD/MM/YYYY')
  }
  toDateObject = (input) => {
    let result = input && input.toString().indexOf('T') === -1 ? moment(input).format('YYYY-MM-DD') + 'T17:00:00Z' : input
    if (result === undefined) {
      result = null
    }
    return moment(result)
  }
  toVNAddressString = fullAddress => {
    const {
      country,
      city,
      district,
      ward,
      street,
      address
    } = fullAddress
    let addressString = ''
    if (address) {
      addressString += address
    }
    if (street && street.name && street.name !== '') {
      addressString += `, đường ${street.name}`
    }
    if (ward && ward.name && ward.name !== '') {
      addressString += `,phường ${ward.name}`
    }
    if (district && district.name && district.name !== '') {
      addressString += `, ${district.name}`
    }
    if (city && city.name && city.name !== '') {
      addressString += `, ${city.name}`
    }
    if (country && country.name && country.name !== '') {
      addressString += ` ${country.name}`
    }
    return addressString;
  }
  toOBjectAddress = address => {
    address.countryid = address.country ? address.country.id : 0;
    address.cityid = address.city ? address.city.id : 0;
    address.districtid = address.district ? address.district.id : 0;
    address.wardid = address.ward ? address.ward.id : 0;
    address.streetid = address.street ? address.street.id : 0;
    return address
  }


  formatNumber(number = 0) {
    let numberInt = parseFloat(number),
      lang = localStorage.getItem('lang') || 'en';

    if (Number.isNaN(numberInt)) {
      return 0;
    }

    if (lang === 'vi') {
      lang = 'vi';
    }

    return numberInt.toLocaleString(lang);
  }

  numberToString(val) {
    return val ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : "0";
  }

  stringToNumber(val) {
    return `${val || "0"}`.replace(/\$\s?|(,*)/g, '') - 0;
  }

  formatVnCurrency(number = 0) {
    if (Number.isNaN(number)) {
      number = 0;
    }
    let numberFloat = parseFloat(`${number}`);
    let lang = 'vi';
  
    return `${numberFloat.toLocaleString(lang)} đ`;
  }

  hashMd5(param) {
    let dataHash = '';

    switch (typeof param) {
      case 'object':
        dataHash = JSON.stringify(param);
        break;

      case 'number':
        dataHash = JSON.stringify(param.toString);
        break;

      case 'string':
        dataHash = param;
        break;

      default:
        throw new Error('Please pass the parameter. Parameter is object, string, number!!!');
    }

    return md5(dataHash);
  }
  formatCondition(locations) {
    let result = [];
    locations && locations.map((item) => {
      if (result.length === 0) {
        result.push({
          cityId: item.cityId,
          cityName: item.cityName,
          districts: [{
            districtId: item.districtId,
            districtName: item.districtName
          }]
        })
      } else {
        result.map((item1, index) => {
          if (result.filter(e => e.cityId === item.cityId).length > 0) {
            if (item1.cityId === item.cityId) {
              let temp = result[index]
              if (temp.districts.filter(e => e.districtId === item.districtId).length === 0) {
                temp.districts.push({
                  districtId: item.districtId,
                  districtName: item.districtName
                })
              }
            }
          } else {
            result.push({
              cityId: item.cityId,
              cityName: item.cityName,
              districts: [{
                districtId: item.districtId,
                districtName: item.districtName
              }]
            })
          }
          return result;
        })
      }
      return locations
    })
    return result;
  }

  makeUUID(length) {
    var result = '';
    var characters = commonConstants.CHARACTERS;
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}

const helper = new StringFormatHelper();
export default helper;