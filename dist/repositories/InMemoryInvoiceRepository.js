"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryInvoiceRepository = void 0;
class InMemoryInvoiceRepository {
    invoices = [];
    nextInvoiceNumber = 1;
    async connect() {
        // In-memory repository always connects successfully
    }
    async save(invoice) {
        this.invoices.push(invoice);
        return invoice;
    }
    async findAll() {
        return [...this.invoices];
    }
    async findById(id) {
        return this.invoices.find((invoice) => invoice.id === id);
    }
    async update(invoice) {
        const index = this.invoices.findIndex((inv) => inv.id === invoice.id);
        if (index !== -1) {
            this.invoices[index] = invoice;
        }
        return invoice;
    }
    async getNextInvoiceNumber() {
        const current = this.nextInvoiceNumber;
        this.nextInvoiceNumber++;
        return `BT${current.toString().padStart(3, '0')}`;
    }
    async delete(id) {
        const index = this.invoices.findIndex((inv) => inv.id === id);
        if (index !== -1) {
            this.invoices.splice(index, 1);
            return true;
        }
        return false;
    }
    async reset() {
        this.invoices = [];
        this.nextInvoiceNumber = 1;
    }
}
exports.InMemoryInvoiceRepository = InMemoryInvoiceRepository;
