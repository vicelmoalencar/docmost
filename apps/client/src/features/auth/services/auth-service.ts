import api from "@/lib/api-client";
import {
  IChangePassword,
  IForgotPassword,
  ILogin,
  IPasswordReset,
  IRegister,
  ISetupWorkspace,
  ITokenResponse,
  IVerifyUserToken,
} from "@/features/auth/types/auth.types";

export async function login(data: ILogin): Promise<ITokenResponse> {
  const req = await api.post<ITokenResponse>("/auth/login", data);
  return req.data;
}

/*
export async function register(data: IRegister): Promise<ITokenResponse> {
  const req = await api.post<ITokenResponse>("/auth/register", data);
  return req.data;
}*/

export async function changePassword(
  data: IChangePassword
): Promise<IChangePassword> {
  const req = await api.post<IChangePassword>("/auth/change-password", data);
  return req.data;
}

export async function setupWorkspace(
  data: ISetupWorkspace
): Promise<ITokenResponse> {
  const req = await api.post<ITokenResponse>("/auth/setup", data);
  return req.data;
}

export async function forgotPassword(data: IForgotPassword): Promise<void> {
  await api.post<any>("/auth/forgot-password", data);
}

export async function passwordReset(
  data: IPasswordReset
): Promise<ITokenResponse> {
  const req = await api.post<any>("/auth/password-reset", data);
  return req.data;
}

export async function verifyUserToken(data: IVerifyUserToken): Promise<any> {
  return api.post<any>("/auth/verify-token", data);
}
