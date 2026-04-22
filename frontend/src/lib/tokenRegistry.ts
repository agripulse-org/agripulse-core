type AuthTokenGetter = () => Promise<string | null>;

let authTokenGetter: AuthTokenGetter | null = null;

export const setAuthTokenGetter = (getter: AuthTokenGetter | null) => {
  authTokenGetter = getter;
};

export const getAuthToken = async () => {
  if (!authTokenGetter) {
    return null;
  }

  return await authTokenGetter();
};
