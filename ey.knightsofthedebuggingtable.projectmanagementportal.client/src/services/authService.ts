import type { Login } from "../models/Login";
import type { Register } from "../models/Register";
import { HEADERS } from "../util/constants";

export const login = (email: string, password: string): Promise<void> => {
  const requestBody: Login = { email, password };

  return fetch(`/auth/login?useSessionCookies=true`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(requestBody),
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Login failed: \n${
          Object.values(error.errors).join(", ") || response.statusText
        }`
      );
    }
  });
};

export const logout = (): Promise<void> => {
  return fetch(`/auth/logout`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({}),
    credentials: "include",
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Logout failed: ${response.statusText}`);
    }
  });
};

export const register = (email: string, password: string): Promise<void> => {
  const requestBody: Register = { email, password };

  return fetch(`/auth/register`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(requestBody),
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Register failed: \n${
          Object.values(error.errors).join(", ") || response.statusText
        }`
      );
    }
  });
};

export const isUserLoggedIn = (): Promise<boolean> => {
  return fetch("/auth/status", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Check Status failed: ${response.statusText}`);
      }

      return response.json();
    })
    .then((data) => {
      return data.isAuthenticated;
    });
};
