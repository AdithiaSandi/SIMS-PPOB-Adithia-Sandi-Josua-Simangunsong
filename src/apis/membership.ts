import { getMethod, postMethod, putMethod, type TApiResponse } from ".";

export interface User {
  email?: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

export type TPayloadRegister = Omit<User, "email" | "profile_image"> & {
  email: string;
  password: string;
};

export const register = async (payload: TPayloadRegister) => {
  return postMethod<TPayloadRegister, TApiResponse>("/registration", payload);
};

export interface TPayloadLogin {
  email: string;
  password: string;
}

export const login = async (payload: TPayloadLogin) => {
  return postMethod<TPayloadLogin, TApiResponse<{ token: string }>>(
    "/login",
    payload
  );
};

const baseUrlProfile = "/profile";
export const getProfile = async () => {
  return getMethod<TApiResponse<User>>(baseUrlProfile);
};

export const updateProfile = async (
  payload: Omit<User, "email" | "profile_image">
) => {
  return putMethod<Partial<User>, TApiResponse<User>>(
    `${baseUrlProfile}/update`,
    payload
  );
};

export const updateProfileImage = async (
  file: File // jpeg , png
) => {
  const data = new FormData();
  data.append("file", file);
  return putMethod<FormData, TApiResponse<User>>(
    `${baseUrlProfile}/image`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
