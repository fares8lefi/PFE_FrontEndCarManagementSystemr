import axiosInstance from './axiosConfig';

const apiurl = "/notification";

export const getUserNotifications = () => {
  return axiosInstance.get(`${apiurl}/getUserNotifications`, {
    headers: {
      "Cache-Control": "no-cache",
    },
  });
};

export const markAsRead = (notificationId) => {
  return axiosInstance.put('/notification/markAsRead', 
    { notificationId: notificationId },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

export const broadcastNotification = (message) => {
  return axiosInstance.post(`${apiurl}/broadcast`, 
    { content: message },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};