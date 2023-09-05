import mongoose, { Connection } from "mongoose";

type TConnection = Connection | null;

class Database {
  private static instance: Database;
  private connection: TConnection = null;

  public static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(uri: string): Promise<Connection | undefined> {
    try {
      console.log("Connecting to mongodb.");
      await mongoose.connect(uri);
      this.connection = mongoose.connection;
      console.log("Connected to mongodb.");

      this.connection.on("close", () => {
        console.log("MongoDB connection closed.");
      });

      return this.connection;
    } catch (error) {
      console.error("Error connecting to mongodb:", error);
    }
  }
}

export default Database.getInstance();
