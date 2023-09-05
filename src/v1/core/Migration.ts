import mongoose, { Schema } from "mongoose";
import Database from "./Database";
import { config as DB_CONFIG } from "../config/DatabaseConfig";

class Migration {
  private static instance: Migration;
  private migrations: any[] = [];
  private database: any = null;

  public static getInstance(): Migration {
    if (!Migration.instance) {
      Migration.instance = new Migration();
    }
    return Migration.instance;
  }

  public async call(MigrationClass: any, action: "up" | "down" = "up"): Promise<void> {
    this.migrations.push({
      migration: MigrationClass,
      action: action,
    });
  }

  public async run(): Promise<void> {
    if (process.env.NODE_ENV !== "development") {
      console.log(`========= Database migration run only in DEVELOPMENT ENVIRONMENT =========`);
      return;
    }

    console.error(`========= START DATABASE MIGRATION =========`);
    this.database = await Database.connect(DB_CONFIG.url);

    const migration_promise = this.migrations.map(async (row) => {
      const { migration, action } = row;
      const migrationClass = new migration();

      if (action === "up") {
        if (migrationClass.up && typeof migrationClass.up === "function") {
          await migrationClass.up();
        }
      } else {
        if (migrationClass.down && typeof migrationClass.down === "function") {
          await migrationClass.down();
        }
      }
    });

    await Promise.all(migration_promise);
    this.database.close();

    console.error(`========= END DATABASE MIGRATION =========`);
  }

  public async createTable(Model: any): Promise<void> {
    try {
      console.log(`====> creating table ${Model.modelName}`);
      await this.database.db.createCollection(Model.modelName);
      console.log(`====> created table ${Model.modelName}`);
    } catch (error) {
      console.log(`Failed to create table ${Model.modelName}.`);
    }
  }

  public async dropTable(Model: any): Promise<void> {
    try {
      console.log(`====> dropping table ${Model.modelName}`);
      const hasCollection: boolean = await this.hasCollection(Model.modelName);

      if (hasCollection) {
        await this.database.db.dropCollection(Model.modelName);
        console.log(`====> dropped table ${Model.modelName}`);
      } else {
        console.log(`Table ${Model.modelName} not exist in mongodb.`);
      }
    } catch (error) {
      console.log(`Failed to drop table ${Model.modelName}.`);
    }
  }

  private async hasCollection(table: string): Promise<boolean> {
    const collections: [] = await this.database.db.listCollections().toArray();

    return collections.some((collection: any) => {
      return collection.name === table;
    });
  }
}
export default Migration.getInstance();
