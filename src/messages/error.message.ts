class ErrorMessage {
  InternalServerError: () => string = () => "Internal Server Error.";

  NotFound: (key: string) => string = (key) => `${key} not found.`;
}

export default new ErrorMessage();
