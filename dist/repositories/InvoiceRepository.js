"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceRepository = void 0;
let invoices = [];
let nextInvoiceNumber = 1;
exports.InvoiceRepository = {
    async connect() {
        // No-op for in-memory repository
    },
    async save(invoice) {
        invoices.push(invoice);
        return invoice;
    },
    async findAll() {
        return [...invoices];
    },
    async findById(id) {
        return invoices.find((invoice) => invoice.id === id);
    },
    async update(invoice) {
        const index = invoices.findIndex((inv) => inv.id === invoice.id);
        if (index !== -1) {
            invoices[index] = invoice;
        }
        return invoice;
    },
    async getNextInvoiceNumber() {
        const current = nextInvoiceNumber;
        nextInvoiceNumber++;
        return `BT${current.toString().padStart(3, '0')}`;
    },
    async delete(id) {
        const index = invoices.findIndex((inv) => inv.id === id);
        if (index !== -1) {
            invoices.splice(index, 1);
            return true;
        }
        return false;
    },
    async reset() {
        invoices = [];
        nextInvoiceNumber = 1;
    },
};
