import axios from "axios";
import { BACKEND_URL } from "../constants";

export const SignInUser = (body: any) => {
  return axios.post(`${BACKEND_URL}/login`, body);
};

export const SignUpUser = async (body: any) => {
  return await axios.post(`${BACKEND_URL}/register`, body);
};

export const CheckAuthStatus = (token: any) => {
  return axios.get(`${BACKEND_URL}/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const GetDirectory = async (token: any) => {
  const res = await axios.get(`${BACKEND_URL}/contacts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const AddVolunteerPhone = async (body: any, token: any) => {
  return await axios.post(`${BACKEND_URL}/volunteer`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const AddCommunityDetails = async (body: any, token: any) => {
  return await axios.post(`${BACKEND_URL}/community`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const GetCommunityDetails = async (token: any) => {
  const res = await axios.get(`${BACKEND_URL}/communities`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const GetOnlineVolunteer = async (token: any) => {
  const res = await axios.get(`${BACKEND_URL}/volunteer`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
