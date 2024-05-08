import { compareSync, genSaltSync, hashSync } from 'bcrypt';

const SALT_ROUNDS = 13;

/**
 * @function encryptPassword
 * @description this function encrypts a user password
 * @param password
 * @returns string of the hashed password
 */
export const encryptPassword = (password: string): string => {
  const salt = genSaltSync(SALT_ROUNDS);
  return hashSync(password, salt);
};

/**
 * @function comparePassword
 * @description this function compares the user's password
 * @param plainPassword
 * @param hashedPassword
 * @returns a boolen
 */

export const comparePassword = (
  plainPassword: string,
  hashedPassword: string,
): boolean => {
  return compareSync(plainPassword, hashedPassword);
};
