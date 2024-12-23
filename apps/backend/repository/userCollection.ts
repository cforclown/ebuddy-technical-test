import { HttpStatusCode, RestApiException } from "cexpress-utils/lib";
import { User } from "entities";
import { db } from "../config/firebaseConfig";

const USERS_COLLECTION = "users";

export class UsersCollection {
  async insert({ id, email }: { id: string, email: string }): Promise<void> {
    await db.collection(USERS_COLLECTION).doc(id).set({
      email,
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<void> {
    try {
      await db.collection(USERS_COLLECTION).doc(id).update(data);
    } catch (error: any) {
      if(error.code === 5) {
        throw new RestApiException('User not found', HttpStatusCode.NotFound);
      }
      
      // unknown error, log it
      console.log(error);
    }
  }

  async fetchUser(id: string): Promise<User | null> {
    const doc = await db.collection(USERS_COLLECTION).doc(id).get();
    return doc.exists ? (doc.data() as User) : null;
  }
}
