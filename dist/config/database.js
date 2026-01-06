"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'invoices_db',
    user: process.env.DB_USER || 'invoices_user',
    password: process.env.DB_PASSWORD || 'adminAa1999aA;L*',
});
