import services from './api_services'
import {
  PATH
} from '../constants';

export const commonServices = {
  getDistricts,
  getWards,
  uploadAttachment,
  uploadAttachments,
  uploadImage,
  uploadImages,
  changePassword
};

function getDistricts(data) {
  return services.post(PATH.COMMON.DISTRICTS, data);
}

function getWards(data) {
  return services.post(PATH.COMMON.WARDS, data);
}

function uploadAttachment(data) {
  return services.post(PATH.COMMON.UPLOAD.ATTACHMENT, data, "file");
}

function uploadAttachments(data) {
  return services.post(PATH.COMMON.UPLOAD.ATTACHMENTS, data, "file");
}

function uploadImage(data) {
  return services.post(PATH.COMMON.UPLOAD.IMAGE, data, "file");
}

function uploadImages(data) {
  return services.post(PATH.COMMON.UPLOAD.IMAGES, data, "file");
}

function changePassword(data) {
  return services.post(PATH.AUTH.CHANGE_PASSWORD, data);
}