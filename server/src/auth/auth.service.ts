import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  /**
   * @description hash the password
   * @param password { string } - the user password
   * @returns A bcrypt hash promise
   */
  async hashPassword(password: string) {
    return bcrypt.hash(password, 8);
  }

  /**
   * @description verify if the user passowrd correct or not
   * @param password the palin text user password
   * @param hashPassword the hashed password in the database
   * @returns A bcrypt compare promise
   */
  async verifyPassword(password: string, hashPassword: string) {
    try {
      return await bcrypt.compare(password, hashPassword);
    } catch (error) {
      return false;
    }
  }
}
