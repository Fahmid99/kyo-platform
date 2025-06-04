import axios from "axios";
import { User } from "../types/types";

const getUsers = async (): Promise<User[]> => {
  const response = await axios.get("/api/user", {});
  return response.data.users;
};

const createUser = async (email: string, name: string, roles: string[]) => {
  try {
    const body = {
      email: email,
      name: name,
      roles: roles,
    };

    const res = await axios.post("/api/user", body);
    console.log("User created", res.data);
    return res.data.user;
  } catch (error) {
    console.error("Invite failed:", error);
  }
};

const deleteUser = async (id: string) => {
  try {
    const res = await axios.delete(`/api/user/${id}`);
    console.log("User deleted:", res.data);
  } catch (error) {
    console.error(error);
  }
};

const updateUserById = async (userId: string, updateData: User) => {
  try {
    const response = await axios.put(`/api/users/${userId}`, updateData);
    return {
      success: true,
      user: response.data.user,
      message: response.data.message?.description,
    };
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

export default {
  getUsers: getUsers,
  createUser: createUser,
  deleteUser: deleteUser,
  updateUserById: updateUserById,
};
