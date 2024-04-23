export class EnvironmentVariableMissingError extends Error {
  constructor(variable: string) {
    super(`Environment variable ${variable} is not defined.`);
    Object.setPrototypeOf(this, EnvironmentVariableMissingError.prototype);
  }
}
