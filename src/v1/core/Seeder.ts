import Database from "./Database";
import { config as DB_CONFIG } from "./../config/DatabaseConfig";

class Seeder {
  private static instance: Seeder;
  private seeders: any[] = [];
  private database: any = null;

  public static getInstance(): Seeder {
    if (!Seeder.instance) {
      Seeder.instance = new Seeder();
    }
    return Seeder.instance;
  }

  public async run(): Promise<void> {
    if (process.env.NODE_ENV !== "development") {
      console.log(`========= Database seeder run only in DEVELOPMENT ENVIRONMENT =========`);
      return;
    }

    console.log(`========= START DATABASE SEEDER =========`);

    this.database = await Database.connect(DB_CONFIG.url);

    const seeder_promise = this.seeders.map(async (row) => {
      const { seeder, action } = row;
      const seederClass = new seeder();

      if (action === "up") {
        if (seederClass.up && typeof seederClass.up === "function") {
          await seederClass.up();
        }
      } else {
        if (seederClass.down && typeof seederClass.down === "function") {
          await seederClass.down();
        }
      }
    });

    await Promise.all(seeder_promise);
    console.log(`========= END DATABASE SEEDER =========`);

    this.database.close();
  }

  public async call(SeederClass: any, action: "up" | "down" = "up"): Promise<void> {
    this.seeders.push({
      seeder: SeederClass,
      action: action,
    });
  }

  public async insertMany(Model: any, data: any[]): Promise<void> {
    try {
      console.log(`====> inserting data ${Model.modelName}`);
      await Model.insertMany(data);
      console.log(`====> inserted data ${Model.modelName}`);
    } catch (error: any) {
      console.log(`Failed to insert data ${Model.modelName}.`);
    }
  }

  public async dropData(Model: any): Promise<void> {
    try {
      console.log(`====> dropping data ${Model.modelName}`);
      await Model.deleteMany({});
      console.log(`====> dropped data ${Model.modelName}`);
    } catch (error: any) {
      console.log(`Failed to drop data  ${Model.modelName}.`);
    }
  }
}
export default Seeder.getInstance();
