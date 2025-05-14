import axiosInstance from './axiosConfig';

const apiurl = "/notification";

export const getUserNotifications = () => {
  return axiosInstance.get(`${apiurl}/getUserNotifications`, {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
};

export const markAsRead = () => {
  return axiosInstance.put(`${apiurl}/markAsRead`);
};
  