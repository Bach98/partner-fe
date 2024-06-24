import React from "react";
import { Translate, withLocalize } from "react-localize-redux";
import helper from "../helper/string.helper"
import moment from "moment";
export const globalProps = {
  panel: {
    marginTop: 10
  },
  okButton: {
    style: {
      backgroundColor: "#3076bb",
      color: "white",
      border: "none",
      width: "110px",
      transition: "none"
    },
  },
  cancelButton: {
    style: {
      backgroundColor: "white",
      color: "black",
      border: "none",
      width: "110px",
    }
  },
  table: {
    size: "small",
    bordered: true,
    scroll: { x: true },
    style: {
      whiteSpace: "nowrap"
    },
    pagination: {
      showSizeChanger: true,
      showTotal: sum => <div>{sum} (<Translate id="RESULT" />)</div>
    }
  },
  tableRow: {
    ellipsis: true,
    width: 70
  },
  col: {
    xxl: 8,
    xl: 8,
    lg: 8,
    md: 12,
    xs: 24
  },
  col2: {
    xxl: 16,
    xl: 16,
    lg: 16,
    md: 24,
    xs: 24
  },
  col3: {
    span: 24
  },
  colHalf: {
    xxl: 12,
    xl: 12,
    lg: 12,
    md: 12,
    xs: 24
  },
  colQuarter: {
    xxl: 6,
    xl: 6,
    lg: 6,
    md: 12,
    xs: 24
  },
  row: {
    gutter: [32, 0]
  },
  form: {
    labelAlign: "right",
    layout: "vertical",
    scrollToFirstError: true
  },
  formItem: {
    className: "custom-form-item"
  },
  selectSearch: {
    showSearch: true,
    filterOption: (input, option) =>
      stringToASCII(option.children).indexOf(stringToASCII(input)) >= 0
  },
  inputNumber: {
    formatter: value => !isNaN(value) ? helper.numberToString(value) : "0",
    parser: value => {
      let result = helper.stringToNumber(value);
      return !isNaN(result) ? result : 0;
    },
  },
  inputNumberVND: {
    formatter: value => !isNaN(value) ? helper.numberToString(value) + " VND" : "0",
    parser: value => {
      let result = helper.stringToNumber(value);
      return !isNaN(result) ? result + " VND" : 0;
    },
  },
}

export function stringToASCII(str) {
  try {
    return str.trim().toLowerCase()
      .replace(/[àáảãạâầấẩẫậăằắẳẵặ]/g, 'a')
      .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
      .replace(/[đ]/g, 'd')
      .replace(/[ìíỉĩị]/g, 'i')
      .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o')
      .replace(/[ùúủũụưừứửữự]/g, 'u')
      .replace(/[ỳýỷỹỵ]/g, 'y')
  } catch (e) {
    return ''
  }
}

export const RenderText = withLocalize((props) => {
  let { value, type, format, translate } = props;
  if (typeof value === "undefined") {
    return "";
  }
  let text;
  switch (type) {
    case "STRING": text = format === "TRANSLATE" ? (value ? <Translate id={value} /> : value) : value; break;
    case "DATE": text = !!value ? moment(value).format(translate(`FORMAT_${type}`)) : ""; break;
    case "DATETIME": text = !!value ? moment(value).format(translate(`FORMAT_${type}`)) : ""; break;
    case "NUMBER": text = (value || 0).toFixed(format || 2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); break;
    case "NUMBER_NO_DOT": text = (value || 0).toFixed(format || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","); break;
    case "PERCENT": text = (value || 0) + "%"; break;
    default: text = value; break;
  }
  return <React.Fragment>{text}</React.Fragment>;
})

export function getRandomColor() {
  function getrandom() {
    return Math.round(50 + Math.random() * 150);
  }
  //var color = '#' + Math.floor(Math.random() * 16777215).toString(16)
  var color = `rgb(${getrandom()},${getrandom()},${getrandom()})`;
  return color;
}

export const format = {
  date: "DD/MM/YYYY",
  dateTime: "DD/MM/YYYY HH:mm",
  dateTimes: "DD/MM/YYYY HH:mm:ss",
  time: "HH:mm",
  times: "HH:mm:ss",
  year: "YYYY",
  month: "MM/YYYY",
  quarter: "qQ/YYYY",
}
