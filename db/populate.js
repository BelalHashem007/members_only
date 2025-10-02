const { Client } = require("pg");

const SQL = `
DROP TABLE IF EXISTS users,messages;
CREATE TABLE users(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    membership INTEGER DEFAULT 0,
    admin BOOLEAN DEFAULT false
);

CREATE TABLE messages(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER,    
    title VARCHAR(255),
    msg TEXT,
    date TEXT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

async function main() {
  console.log("Seeding...");
  const client = new Client({ connectionString: process.argv[2] });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done");
}
main();
