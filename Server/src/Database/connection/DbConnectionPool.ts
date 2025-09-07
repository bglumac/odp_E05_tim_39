import { AsyncDatabase } from 'promised-sqlite3';

let init_user_table = `
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
  published INT NOT NULL,
  owner INT NOT NULL,
  FOREIGN KEY (owner) REFERENCES User(uuid)
);`;

let init_notes_table = `
CREATE TABLE IF NOT EXISTS Notes
(
  id CHAR NOT NULL,
  header CHAR NOT NULL,
  content CHAR,
  published INT NOT NULL,
  pinned INT NOT NULL,
  owner INT NOT NULL,
  FOREIGN KEY (owner) REFERENCES User(uuid)
);`;

export class DatabaseConnection {
  static connection: AsyncDatabase;

  static async Connect() {
    console.log("Connecting to database...")
    this.connection = await AsyncDatabase.open('./data.db');
    await this.connection.run(init_user_table);
    await this.connection.run(init_notes_table);
    console.log("Database connected!");
  }

  static Get(): AsyncDatabase {
    return this.connection;
  }
}