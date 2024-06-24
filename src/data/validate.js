import React from "react";
import { Translate } from "react-localize-redux";
import moment from 'moment'

export const rules = {
  required: {
    required: true,
    message: <Translate id="VALIDATE_REQUIRED" />
  },
  whitespace: {
    whitespace: true,
    message: <Translate id="VALIDATE_REQUIRED" />
  },
  type: {
    number: {
      type: "number",
      transform: val => val - 0,
      message: <Translate id="VALIDATE_FORMAT_TYPE_NUMBER" />
    },
    integer: {
      type: "integer",
      transform: val => val - 0,
      message: <Translate id="VALIDATE_FORMAT_TYPE_INTEGER" />
    },
    decimal: {
      type: "float",
      transform: val => val - 0,
      message: <Translate id="VALIDATE_FORMAT_TYPE_DECIMAL" />
    },
    date: {
      type: "date",
      message: <Translate id="VALIDATE_FORMAT_TYPE_DATE" />
    },
    email: {
      type: "email",
      message: <Translate id="VALIDATE_FORMAT_TYPE_EMAIL" />
    },
  },
  string: {
    len: (len) => ({
      len,
      message: <Translate id="VALIDATE_FORMAT_STRING_LEN" data={{ len }} />
    }),
    min: (min) => ({
      min,
      message: <Translate id="VALIDATE_FORMAT_STRING_MIN" data={{ min }} />
    }),
    max: (max) => ({
      max,
      message: <Translate id="VALIDATE_FORMAT_STRING_MAX" data={{ max }} />
    }),
    range: (min, max) => ({
      min,
      max,
      message: <Translate id="VALIDATE_FORMAT_STRING_RANGE" data={{ min, max }} />
    }),
  },
  number: {
    lenNum: (len) => ({
      type: "number",
      transform: val => val - 0,
      len,
      message: <Translate id="VALIDATE_FORMAT_NUMBER_LEN" data={{ len }} />
    }),
    minNum: (min) => ({
      type: "number",
      transform: val => val - 0,
      min,
      message: <Translate id="VALIDATE_FORMAT_NUMBER_MIN" data={{ min }} />
    }),
    maxNum: (max) => ({
      type: "number",
      transform: val => val - 0,
      max,
      message: <Translate id="VALIDATE_FORMAT_NUMBER_MAX" data={{ max }} />
    }),
    rangeNum: (min, max) => ({
      type: "number",
      transform: val => val - 0,
      min,
      max,
      message: <Translate id="VALIDATE_FORMAT_NUMBER_RANGE" data={{ min, max }} />
    })
  },
  repassword: ({ getFieldValue }) => ({
    validator(rule, value) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(<Translate id="VALIDATE_REPASSWORD" />);
    }
  }),
  selectBox: (list, key = "id") => ({
    type: "number",
    transform: val => list.findIndex(k => k[key] === val),
    min: 0,
    message: <Translate id="VALIDATE_FORMAT_NUMBER_MAX" />
  }),
  dateFromFilter: ({ getFieldValue }) => ({
    required: true,
    validator(rule, value) {

      if (value === null) {
        return Promise.reject(<Translate id="VALIDATE_REQUIRED" />);
      }

      let dateTo = getFieldValue('dateTo');
      if (dateTo) {
        let totalDay = dateTo.clone().startOf('day').diff(value.clone().startOf('day'), 'day');
        if (totalDay >= 0 && totalDay <= 90) {
          return Promise.resolve();
        }
        return Promise.reject(<Translate id="DATE_FILTER_INVALID" />);
      }

      let toDate = getFieldValue('toDate');
      if (toDate) {
        let totalDay = toDate.clone().startOf('day').diff(value.clone().startOf('day'), 'day');
        if (totalDay >= 0 && totalDay <= 90) {
          return Promise.resolve();
        }
        return Promise.reject(<Translate id="DATE_FILTER_INVALID" />);
      }

      return Promise.resolve();
    }
  }),

  dateToFilter: ({ getFieldValue }) => ({
    required: true,
    validator(rule, value) {

      if (value === null) {
        return Promise.reject(<Translate id="VALIDATE_REQUIRED" />);
      }

      let dateFrom = getFieldValue('dateFrom');
      if (dateFrom) {
        let totalDay = value.clone().startOf('day').diff(dateFrom.clone().startOf('day'), 'day');
        if (totalDay >= 0 && totalDay <= 90) {
          return Promise.resolve();
        }
        return Promise.reject(<Translate id="DATE_FILTER_INVALID" />);
      }

      let fromDate = getFieldValue('fromDate');
      if (fromDate) {
        let totalDay = value.clone().startOf('day').diff(fromDate.clone().startOf('day'), 'day');
        if (totalDay >= 0 && totalDay <= 90) {
          return Promise.resolve();
        }
        return Promise.reject(<Translate id="DATE_FILTER_INVALID" />);
      }

      return Promise.resolve();
    }
  }),
  dateFromFilter7days: ({ getFieldValue }) => ({
    required: true,
    validator(rule, curValue) {
      if (curValue === null) {
        return Promise.reject(<Translate id="VALIDATE_REQUIRED" />);
      }
      let value = moment(curValue).clone();
      let curDateTo = getFieldValue('toDate');
      if (curDateTo) {
        let dateTo = moment(curDateTo).clone();
        if (dateTo.isBefore(value)) {
          return Promise.reject(<Translate id="DATE_FILTER_7DAYS_INVALID" />);
        }

        let totalDay = dateTo.startOf('day').diff(value.startOf('day'), 'day');
        if (totalDay >= 0 && totalDay <= 7) {
          return Promise.resolve();
        }

        return Promise.reject(<Translate id="DATE_FILTER_7DAYS_INVALID" />);
      }

      return Promise.resolve();
    }
  }),
  dateToFilter7days: ({ getFieldValue }) => ({
    required: true,
    validator(rule, curValue) {
      if (curValue === null) {
        return Promise.reject(<Translate id="VALIDATE_REQUIRED" />);
      }
      let value = moment(curValue).clone();
      let curDateFrom = getFieldValue('fromDate');
      if (curDateFrom) {
        let dateFrom = moment(curDateFrom).clone();
        if (dateFrom.isAfter(value)) {
          return Promise.reject(<Translate id="DATE_FILTER_7DAYS_INVALID" />);
        }

        let totalDay = value.startOf('day').diff(dateFrom.startOf('day'), 'day');
        if (totalDay >= 0 && totalDay <= 7) {
          return Promise.resolve();
        }
        return Promise.reject(<Translate id="DATE_FILTER_7DAYS_INVALID" />);
      }

      return Promise.resolve();
    }
  })
}