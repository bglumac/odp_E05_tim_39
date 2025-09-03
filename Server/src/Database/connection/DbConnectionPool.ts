import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./data.db');

let init_query = `
CREATE TABLE IF NOT EXISTS User
(
  uuid INT NOT NULL,
  username CHAR NOT NULL,
  password CHAR NOT NULL,
  permission INT NOT NULL,
  PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS Notes
(
  note_id INT NOT NULL,
  text INT NOT NULL,
  uuid INT NOT NULL,
  FOREIGN KEY (uuid) REFERENCES User(uuid)
);
`

db.run(init_query, (err) => {
  if (err) {
    console.log("Error while initializing database!");
    return;
  }
  console.log("Database initialized!")
})

export default db;