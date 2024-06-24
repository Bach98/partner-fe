class DataValidatorHelper {
  isPhoneNumber(string) {
		var isnum = /^(0)[0-9]{9}$/g.test(string);
		return isnum && string.length < 12
	}
  isOnlyNumber(string) {
		var isnum = /^\d+$/g.test(string);
		return isnum
	}
}
const validatorHelper = new DataValidatorHelper();
export default validatorHelper;