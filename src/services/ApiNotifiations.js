import axios from "axios";

const apiurl = "http://localhost:3003/notification"; 

export const getUserNotifications = () => {
  return axios.get(`${apiurl}/getUserNotifications`, {
    withCredentials: true,
    headers: {
      "Cache-Control": "no-cache",
    },
  });
};


  export const markAsRead = () => {
    return axios.put(`${apiurl}/markAsRead`, {}, {
      withCredentials: true
    });
  };
  