export interface ISignupRequest {
  email: string;
  firstName: string;
  lastName?: string;
  password: string;
}

export interface IExistingUserResponse {
  message: string;
  user: null;
}

export interface IUserWithDeletedAccountResponse {
  message: string;
  user: {
    id: string;
  };
}

export interface INewUserResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    deletedAt: Date;
    updatedAt: Date;
  };
}

export interface ISigninRequest {
  email: string;
  password: string;
}

export interface ISigninSuccessResponse {
  message: string;
  token: string;
}
