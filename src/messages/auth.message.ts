class AuthMessage {
  ExistingUser: string = "User with this email already exists.";
  UserWithDeletedAccount: string =
    "Seems that you had an account that was deleted. Want to reactivate?";
  NewUser: string = "User created successfully";
}

export default new AuthMessage();
