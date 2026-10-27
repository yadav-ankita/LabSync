import axios from "axios";
import { BASE_URL } from "../config";

const API_URL = `${BASE_URL}/api/v1/student`;

export const getStudentProfile = (token) =>
  axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });