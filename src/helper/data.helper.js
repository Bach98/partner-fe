import React from 'react';
import { Translate } from 'react-localize-redux';
import {
  PERMISSION_CODE,
  ALL_PERMISSIONS
} from '../constants'
import _ from 'lodash';
const PERMISSION_KEY = {
  ASSIGN: "enableReassign"
}
class DataFormatHelper {
  formatDataForPermission(source) {
    let des = []
    const arrayPermission = [
      PERMISSION_CODE.VIEW,
      PERMISSION_CODE.EXPORT,
      PERMISSION_CODE.REFUND,
      PERMISSION_CODE.VOID,
      PERMISSION_CODE.SUBMIT,
      PERMISSION_CODE.REJECT,
      PERMISSION_CODE.APPROVE,
      PERMISSION_CODE.REVISION,
      PERMISSION_CODE.UNPUBLISH,
      PERMISSION_CODE.PUBLISH,
      PERMISSION_CODE.CANCEL_CAMPAIGN,
      PERMISSION_CODE.APPROVAL_1ST,
      PERMISSION_CODE.APPROVAL_2ND
    ]
    source.map((item) => {
      const arrayCheck = item.split('.')
      var itemIndex = des.findIndex(i => i.name === arrayCheck[0]);
      if (itemIndex < 0) {
        let item = {
          name: arrayCheck[0],
          items: []
        }
        if (arrayCheck[1] === PERMISSION_KEY.ASSIGN) {
          item.enableReassign = true
        } else {
          item.enableReassign = false
          var childIndex = arrayPermission.findIndex(j => j === arrayCheck[1]);
          const child = childIndex >= 0 ? {
            name: null,
            rightCodes: [arrayCheck[1]]
          } : {
              name: arrayCheck[1],
              rightCodes: [arrayCheck[2]]
            }
          item.items = [
            child
          ]
        }
        des.push(item)
      } else {
        let {
          items: arrayChild
        } = des[itemIndex]
        if (arrayCheck[1] === PERMISSION_KEY.ASSIGN) {
          des[itemIndex].enableReassign = true
        } else {
          const childIndex = arrayChild.findIndex(j => j.name === arrayCheck[1]);
          if (childIndex >= 0) {
            arrayChild[childIndex].rightCodes.push(arrayCheck[2])
          } else {
            if (arrayCheck[2]) {
              let child = {
                name: arrayCheck[1],
                rightCodes: [arrayCheck[2]]
              }
              des[itemIndex].items.push(child)
            } else {
              des[itemIndex].items[0] ?
                des[itemIndex].items[0].rightCodes.push(arrayCheck[1]) :
                des[itemIndex].items = [{
                  name: null,
                  rightCodes: [arrayCheck[1]]
                }]
            }
          }

        }
      }
      return des
    })
    return des

  }
  getCurrentTreePermission(permissions, allNodes) {
    let result = []
    let root = allNodes[0]
    permissions.map(item => {
      if (item.enableReassign) {
        const {
          children
        } = root;

        const node = children.find((element) => _.isEqual(element.value, item.name));
        if (node) {
          result.push(node);
        }
      }
      return item;
    });
    root.children = result
    return root.children.length === 0 ? [] : [root]
  }
  formatDataBindingPermission(permissions, isCompare = false) {
    let arrayPermissions = [];
    let viewLogPermission = ["VIEW_LOG_ADMIN", "VIEW_ALL_LOG_ADMIN"];
    permissions.map(item => {
      if (isCompare) {
        if (item.items.some(node => node.rightCodes.some(code => code === "VIEW"))) {
          arrayPermissions.push(`${item.name}.VIEW`)
        }
        if (item.items.some(node => node.rightCodes.some(code => viewLogPermission.includes(code)))) {
          arrayPermissions.push(`${item.name}.VIEW`)
        }
        if (item.enableReassign && arrayPermissions.indexOf('permission.VIEW') < 0) {
          arrayPermissions.push('permission.VIEW')
        }
      }
      //
      if (item.enableReassign) {
        arrayPermissions.push(`${item.name}.enableReassign`)
      }
      if (item.items) {
        item.items.map(child => {
          if (child.name) {
            child.rightCodes.map(code => {
              arrayPermissions.push(`${item.name}.${child.name}.${code}`)
              return code
            })
          } else {
            child.rightCodes.map(code => {
              arrayPermissions.push(`${item.name}.${code}`)
              return code
            })

          }
          return child
        })
      }
      return arrayPermissions;
    })

    return arrayPermissions;
  }
  formatPermissionTree(tree) {
    let fullPermissionTree = [{
      value: ALL_PERMISSIONS.ADMIN,
      label: (<Translate id="PERMISSION_LABEL.ALL" />),
      children: []
    }]
    fullPermissionTree[0].children = parseArrayNode(tree);
    function parseArrayNode(array) {
      return array.map(k => {
        let keyArray = k.key.split('.');
        let key = keyArray[keyArray.length - 1];
        let node = {
          value: k.key,
          label: (<Translate
            id={`PERMISSION_LABEL.${key.toUpperCase()}`}
            options={{
              onMissingTranslation: ({ translationId }) => translationId.split('.').pop()
            }}
          />)
        }
        if (k.children) {
          node.children = parseArrayNode(k.children);
        }
        return node;
      })
    }
    return fullPermissionTree;
  }
}
const dataHelper = new DataFormatHelper();
export default dataHelper;