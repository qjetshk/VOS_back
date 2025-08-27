export type User = {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  createdAt: Date;
};

export type CreateUserInput = {
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RefreshTokenPayload = {
  id: string;
  email: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
