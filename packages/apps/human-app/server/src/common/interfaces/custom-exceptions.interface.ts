export class EnvironmentVariableMissingError extends Error {
  constructor(variable: string) {
    super(`Environment variable ${variable} is not defined.`);
    // This line is needed for correct inheritance when targeting ES5
    Object.setPrototypeOf(this, EnvironmentVariableMissingError.prototype);
  }
}