import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAnsync = promisify(scrypt);

export class Password {
  static async hash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scryptAnsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword: string, password: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = (await scryptAnsync(password, salt, 64)) as Buffer;
    return buf.toString("hex") === hashedPassword;
  }
}
