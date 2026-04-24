import { checkUsernameApi, signInApi } from "../api/authApi";

export async function checkUsername(request) {
  return checkUsernameApi(request);
}

export async function signIn(request) {
  return signInApi(request);
}
