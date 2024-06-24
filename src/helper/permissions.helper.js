class PermissionsHelper {
  constructor(permissionsList) {
    this.permissionsList = permissionsList;
  }
  isHavePermission(permission) {
    return this.permissionsList.indexOf(permission) >= 0
  }
}
export default PermissionsHelper;