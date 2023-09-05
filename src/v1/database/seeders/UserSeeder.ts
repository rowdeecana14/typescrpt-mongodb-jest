import data from "./data/users.data.json";
import User from "../../models/User";
import Seeder from "../../core/Seeder";

export default class UserSeeder {
  public async up(): Promise<void> {
    await Seeder.insertMany(User, data);
  }

  public async down(): Promise<void> {
    await Seeder.dropData(User);
  }
}
