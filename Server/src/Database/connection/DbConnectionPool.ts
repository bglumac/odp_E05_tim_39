import { AsyncDatabase } from 'promised-sqlite3';

let init_query = `
CREATE TABLE IF NOT EXISTS Users
(
  uuid CHAR NOT NULL,
  username CHAR NOT NULL,
  password CHAR NOT NULL,
  permission INT NOT NULL DEFAULT 0,
  PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS Notes
(
  id CHAR NOT NULL,
  header CHAR NOT NULL,
  content CHAR,
  owner INT NOT NULL,
  FOREIGN KEY (owner) REFERENCES User(uuid)
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