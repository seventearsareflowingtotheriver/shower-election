"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    /* user: 'userresu',
    password: 'drowssap',
    host: 'localhost',
    port: 5432,
    database: 'shower-election', */
});
const createTables = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS candidates (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                proposes INTEGER DEFAULT 0,
                votes INTEGER DEFAULT 0
            )
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS proposed_candidates (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                reason TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('Tables created successfully');
    }
    catch (error) {
        console.error('Table creation failed:', error);
    }
    finally {
        client.release();
    }
};
createTables();
exports.default = pool;
