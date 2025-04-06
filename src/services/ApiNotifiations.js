import axios from "axios";

const apiurl = "http://localhost:3000/notification"; 

export const getUserNotifications = () => {
    return axios.get(`${apiurl}/getUserNotifications`,{
      withCredentials: true,
    });
  };

  export const markAsRead = () => {
    return axios.put(`${apiurl}/markAsRead`, {}, {
      withCredentials: true
    });
  };
  