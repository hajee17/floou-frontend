// src/stores/auth.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import apiClient from "@/service/api";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const token = ref(localStorage.getItem("authToken") || null);
  const error = ref(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  async function login(credentials) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post("/login", credentials);
      const { access_token, user: userData } = response.data;

      localStorage.setItem("authToken", access_token);
      localStorage.setItem("user", JSON.stringify(userData));

      token.value = access_token;
      user.value = userData;

      // Redirect berdasarkan role
      if (userData.role === "admin") {
        router.push({ name: "admin-dashboard" });
      } else {
        router.push({ name: "home" });
      }
    } catch (e) {
      error.value = e.response?.data?.message || "Login failed.";
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function register(userData) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post("/register", userData);
      const { access_token, user: newUserData } = response.data;

      localStorage.setItem("authToken", access_token);
      localStorage.setItem("user", JSON.stringify(newUserData));

      token.value = access_token;
      user.value = newUserData;

      router.push({ name: "home" });
    } catch (e) {
      if (e.response && e.response.status === 422) {
        error.value = e.response.data.errors; // Objek error validasi
      } else {
        error.value = e.response?.data?.message || "Registration failed.";
      }
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    try {
      await apiClient.post("/logout");
    } catch (e) {
      console.error("Error during API logout, but proceeding with client-side logout.", e);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      token.value = null;
      user.value = null;
      isLoading.value = false;
      router.push({ name: "login" });
    }
  }

  return { user, token, isAuthenticated, isAdmin, login, register, logout, error, isLoading };
});
