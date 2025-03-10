import pool from './config/db.js';

const createTables = async () => {
    console.log('start tables create')
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id integer PRIMARY KEY generated always as identity,
            balance DECIMAL(6,2) NOT NULL,
            name VARCHAR (50) NOT NULL
        )
    `)

    await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
            id integer PRIMARY KEY generated always as identity,
            price DECIMAL(6,2) NOT NULL,
            name VARCHAR (50) NOT NULL
        )
    `)

    await pool.query(`
        CREATE TABLE IF NOT EXISTS purchase (
            id integer PRIMARY KEY generated always as identity,
            user_id integer REFERENCES users (id),
            product_id integer REFERENCES products (id),
            price DECIMAL(6,2) NOT NULL
        )
    `)

    await pool.query(`DELETE from purchase;`)

    await pool.query(`
        DELETE from users;
        INSERT INTO users(balance, name) VALUES(1000, 'user1')
    `);

    await pool.query(`
        DELETE from products;
        INSERT INTO products(price, name) VALUES(150, 'Стол');
        INSERT INTO products(price, name) VALUES(50, 'Стул');
        INSERT INTO products(price, name) VALUES(250, 'Шкаф');
    `);
    console.log('tables created')
    process.exit()
}

createTables()
