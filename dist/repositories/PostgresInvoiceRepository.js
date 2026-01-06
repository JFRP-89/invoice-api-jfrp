"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresInvoiceRepository = void 0;
class PostgresInvoiceRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async connect() {
        const client = await this.pool.connect();
        client.release();
    }
    async save(invoice) {
        await this.pool.query(`INSERT INTO invoices (id, client_cif, client_name, client_address, base_amount, vat_amount, total_amount, invoice_number, status, created_at, finalized_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [
            invoice.id,
            invoice.clientCif,
            invoice.clientName,
            invoice.clientAddress,
            invoice.baseAmount,
            invoice.vatAmount,
            invoice.totalAmount,
            invoice.invoiceNumber,
            invoice.status,
            invoice.createdAt,
            invoice.finalizedAt,
        ]);
        return invoice;
    }
    async findAll() {
        const result = await this.pool.query('SELECT * FROM invoices ORDER BY created_at DESC');
        return result.rows.map(this.mapRowToInvoice);
    }
    async findById(id) {
        const result = await this.pool.query('SELECT * FROM invoices WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return undefined;
        }
        return this.mapRowToInvoice(result.rows[0]);
    }
    async update(invoice) {
        await this.pool.query(`UPDATE invoices
       SET client_cif = $2, client_name = $3, client_address = $4, base_amount = $5, vat_amount = $6, total_amount = $7, invoice_number = $8, status = $9, created_at = $10, finalized_at = $11
       WHERE id = $1`, [
            invoice.id,
            invoice.clientCif,
            invoice.clientName,
            invoice.clientAddress,
            invoice.baseAmount,
            invoice.vatAmount,
            invoice.totalAmount,
            invoice.invoiceNumber,
            invoice.status,
            invoice.createdAt,
            invoice.finalizedAt,
        ]);
        return invoice;
    }
    async getNextInvoiceNumber() {
        const result = await this.pool.query(`UPDATE invoice_counter
       SET next_number = next_number + 1
       WHERE id = 1
       RETURNING next_number - 1 as current_number`);
        const current = result.rows[0].current_number;
        return `BT${current.toString().padStart(3, '0')}`;
    }
    async delete(id) {
        const result = await this.pool.query('DELETE FROM invoices WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }
    async reset() {
        await this.pool.query('DELETE FROM invoices');
        await this.pool.query('UPDATE invoice_counter SET next_number = 1 WHERE id = 1');
    }
    mapRowToInvoice(row) {
        return {
            id: row.id,
            clientCif: row.client_cif,
            clientName: row.client_name,
            clientAddress: row.client_address,
            baseAmount: parseFloat(row.base_amount),
            vatAmount: parseFloat(row.vat_amount),
            totalAmount: parseFloat(row.total_amount),
            invoiceNumber: row.invoice_number,
            status: row.status,
            createdAt: row.created_at.toISOString(),
            finalizedAt: row.finalized_at ? row.finalized_at.toISOString() : null,
        };
    }
}
exports.PostgresInvoiceRepository = PostgresInvoiceRepository;
