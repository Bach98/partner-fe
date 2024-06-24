import validator from 'validator';
import _ from 'lodash';

class FormValidator {
  constructor(validations) {
    this.validations = validations;
  }

  validate = state => {
    let validation = this.reset();
    this.validations.forEach(v => {
      if (!validation[v.field].isInvalid) {
        let args = v.args || [],
          validation_method = typeof v.method === 'string' ? validator[v.method] : v.method,
          value = _.get(state, v.field, '');

        if (_.isNull(value) || _.isUndefined(value) || _.isNaN(value)) {
          value = '';
        }

        value = value.toString().trim();

        if (validation_method(value, ...args, state) !== v.validWhen) {
          validation[v.field] = {
            isInvalid: true,
            data: v.data,
            message: v.message
          };
          validation.isValid = false;
        }
      }
    });

    return validation;
  }

  reset = () => {
    const validation = {}
    this.validations.map(v => (

      validation[v.field] = {
        isInvalid: false,
        message: ''
      }
    ));

    return {
      isValid: true,
      ...validation
    };
  }
}

export default FormValidator;