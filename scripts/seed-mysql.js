const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');
const { createMySQLConnection } = require('../app/lib/db-connection2.js')

async function seedUsers(connection) {
  try {
    // Crea la tabla "users" si no existe
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;
    await connection.execute(createTableSql);
    console.log(`Created "users" table`);

    // Inserta datos en la tabla "users"
    const insertUserSql = `
      INSERT INTO users (id, name, email, password)
      VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id;
    `;

    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return connection.execute(insertUserSql, [user.id, user.name, user.email, hashedPassword]);
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices(connection) {
  try {
    // Crea la tabla "invoices" si no existe
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS invoices (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id CHAR(36) NOT NULL,
        amount INT NOT NULL,
        status VARCHAR(255) NOT NULL,
        date DATE NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;
    await connection.execute(createTableSql);
    console.log(`Created "invoices" table`);

    // Inserta datos en la tabla "invoices"
    const insertInvoiceSql = `
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id;
    `;

    const insertedInvoices = await Promise.all(
      invoices.map(async (invoice) => 
        connection.execute(insertInvoiceSql, [invoice.customer_id, invoice.amount, invoice.status, invoice.date])
      ),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(connection) {
  try {
    // Crea la tabla "customers" si no existe
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS customers (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;
    await connection.execute(createTableSql);
    console.log(`Created "customers" table`);

    // Inserta datos en la tabla "customers"
    const insertCustomerSql = `
      INSERT INTO customers (id, name, email, image_url)
      VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id;
    `;

    const insertedCustomers = await Promise.all(
      customers.map(async (customer) => 
        connection.execute(insertCustomerSql, [customer.id, customer.name, customer.email, customer.image_url])
      ),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(connection) {
  try {
    // Crea la tabla "revenue" si no existe
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;
    await connection.execute(createTableSql);
    console.log(`Created "revenue" table`);

    // Inserta datos en la tabla "revenue"
    const insertRevenueSql = `
      INSERT INTO revenue (month, revenue)
      VALUES (?, ?);
    `;

    const insertedRevenue = await Promise.all(
      revenue.map(async (rev) => 
        connection.execute(insertRevenueSql, [rev.month, rev.revenue])
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  const connection = await createMySQLConnection();

  await seedUsers(connection);
  await seedInvoices(connection);
  await seedCustomers(connection);
  await seedRevenue(connection);

  await connection.end();
}

main().catch((err) => {
  console.error('An error occurred while attempting to seed the database:', err);
});