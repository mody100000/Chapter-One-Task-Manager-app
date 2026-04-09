import { ZodError } from "zod";

export const parseZodError = (error: unknown): Record<string, unknown> => {
  if (error instanceof ZodError) {
    return {
      name: "ValidationError",
      messages: error.issues,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  return {
    name: "UnknownError",
    message: "An unexpected error occurred",
  };
};
