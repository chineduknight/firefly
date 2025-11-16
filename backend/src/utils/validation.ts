import { HttpError } from "./httpError";

export const parsePositiveInt = (value: unknown, fieldName: string): number => {
  const num = Number(value);

  if (!Number.isInteger(num) || num <= 0) {
    throw new HttpError(400, `${fieldName} must be a positive integer`);
  }

  return num;
};
