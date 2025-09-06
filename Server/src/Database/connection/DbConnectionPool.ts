import { AsyncDatabase } from 'promised-sqlite3';

let init_query = `
CREATE TABLE IF NOT EXISTS Users
(
  uuid INT NOT NULL,
  username CHAR NOT NULL,
  password CHAR NOT NULL,
  permission INT NOT NULL DEFAULT 0,
  PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS Notes
(
  note_id INT NOT NULL,
  text INT NOT NULL,
  uuid INT NOT NULL,
  FOREIGN KEY (uuid) REFERENCES User(uuid)
);`;

export class DatabaseConnection {
  static connection: AsyncDatabase;

  static async Connect() {
    console.log("Connecting to database...")
    this.connection = await AsyncDatabase.open('./data.db');
    await this.connection.run(init_query);
    console.log("Database connected!");
  }

  static Get(): AsyncDatabase {
    return this.connection;
  }
}