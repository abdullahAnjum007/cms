import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const BASE_URL = "enter your backend url here";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  // headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const request = async (method, endpoint, data = {}, config = {}) => {
  try {
    const response = await api.request({
      method,
      url: endpoint,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`❌ API Error [${method.toUpperCase()} ${endpoint}]`, error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    throw new Error(message);
  }
};

const ApiService = {
  get: (endpoint, config) => request("get", endpoint, {}, config),
  post: (endpoint, data, config) => request("post", endpoint, data, config),
  put: (endpoint, data, config) => request("put", endpoint, data, config),
  patch: (endpoint, data, config) => request("patch", endpoint, data, config),
  delete: (endpoint, config) => request("delete", endpoint, {}, config),
};

export default ApiService;
