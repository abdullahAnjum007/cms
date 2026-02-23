import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiService from "./apiHelper";

const AuthService = {
  // 🔐 LOGIN
  login: async (email, password) => {
    try {
      const response = await ApiService.post("auth/login", {
        email,
        password,
      });

      if (response?.token) {
        await AsyncStorage.setItem("token", response.token);
      }

      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // 📝 SIGN UP
  signup: async ({ name, email, password, role }) => {
    try {
      const response = await ApiService.post("auth/signup", {
        name,
        email,
        password,
        role,
      });

      // Optional: store token if backend returns it
      if (response?.token) {
        await AsyncStorage.setItem("token", response.token);
      }

      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // 🚪 LOGOUT
  logout: async () => {
    await AsyncStorage.removeItem("token");
  },
};

export default AuthService;
