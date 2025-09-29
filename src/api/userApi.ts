import axios, { AxiosInstance } from "axios";
import type { User, UserResponse } from "../types/user";

const API_URL = process.env.REACT_APP_API_URL || "https://reqres.in/api/";
const API_KEY = process.env.REACT_APP_API_KEY || "reqres-free-v1";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  },
});

const handleError = (error: any) => {
  const message =
    error?.response?.data?.error || error.message || "API request failed";
  throw new Error(message);
};

// In-memory caches
let allUsersCache: User[] | null = null;
const userCache = new Map<number, User>();

// Fetch all users (up to 100) with caching
export const getAllUsersApi = async (): Promise<User[]> => {
  if (allUsersCache) return allUsersCache;

  try {
    const res = await apiClient.get<UserResponse>("users", {
      params: { per_page: 100 },
    });
    allUsersCache = res.data.data;
    allUsersCache.forEach((user) => userCache.set(user.id, user));
    return allUsersCache;
  } catch (error) {
    handleError(error);
  }
  return [];
};

// Fetch paginated users
export const fetchUsersApi = async (
  page = 1,
  perPage = 10
): Promise<UserResponse> => {
  try {
    const res = await apiClient.get<UserResponse>("users", {
      params: { page, per_page: perPage },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
  return { data: [], page: 1, per_page: perPage, total: 0, total_pages: 0 };
};

// Fetch single user with caching
export const getUserByIdApi = async (id: number): Promise<User> => {
  if (userCache.has(id)) return userCache.get(id)!;

  try {
    const res = await apiClient.get<{ data: User }>(`users/${id}`);
    const user = res.data.data;
    userCache.set(id, user);
    return user;
  } catch (error) {
    handleError(error);
  }
  return {} as User;
};

// Create user (fully immutable)
export const createUserApi = async (userData: Partial<User>): Promise<User> => {
  // Check for duplicate email
  const emailExists = Array.from(userCache.values()).some(
    (u) => u.email === userData.email
  );
  if (emailExists) {
    throw new Error("Email address already exists");
  }

  try {
    const res = await apiClient.post("users", userData);
    const newUser = { ...userData, id: res.data.id || Date.now() } as User;

    // Immutable cache updates
    allUsersCache = allUsersCache ? [...allUsersCache, newUser] : [newUser];
    userCache.set(newUser.id, newUser);

    return newUser;
  } catch (error) {
    handleError(error);
  }
  return {} as User;
};

// Update user (fully immutable)
export const updateUserApi = async (userData: User): Promise<User> => {
  try {
    // ✅ Prevent duplicate emails on update
    const emailExists = Array.from(userCache.values()).some(
      (u) => u.email === userData.email && u.id !== userData.id
    );
    if (emailExists) {
      throw new Error("Email address already exists");
    }

    await apiClient.put(`users/${userData.id}`, userData);

    // Immutable update for allUsersCache
    if (allUsersCache) {
      allUsersCache = allUsersCache.map((u) =>
        u.id === userData.id ? { ...u, ...userData } : u
      );
    }

    // Update userCache
    userCache.set(userData.id, { ...userData });

    return userData;
  } catch (error) {
    handleError(error);
  }
  return {} as User;
};

// Delete user (fully immutable)
export const deleteUserApi = async (id: number): Promise<number> => {
  try {
    await apiClient.delete(`users/${id}`);

    // Immutable removal from allUsersCache
    allUsersCache = allUsersCache?.filter((u) => u.id !== id) || null;

    // Remove from userCache
    userCache.delete(id);

    return id;
  } catch (error) {
    handleError(error);
  }
  return -1;
};
