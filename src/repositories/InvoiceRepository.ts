import { Invoice } from '../types';

let invoices: Invoice[] = [];
let nextInvoiceNumber = 1;

export const InvoiceRepository = {
  async connect(): Promise<void> {
    // No-op for in-memory repository
  },

  async save(invoice: Invoice): Promise<Invoice> {
    invoices.push(invoice);
    return invoice;
  },

  async findAll(): Promise<Invoice[]> {
    return [...invoices];
  },

  async findById(id: string): Promise<Invoice | undefined> {
    return invoices.find((invoice) => invoice.id === id);
  },

  async update(invoice: Invoice): Promise<Invoice> {
    const index = invoices.findIndex((inv) => inv.id === invoice.id);
    if (index !== -1) {
      invoices[index] = invoice;
    }
    return invoice;
  },

  async getNextInvoiceNumber(): Promise<string> {
    const current = nextInvoiceNumber;
    nextInvoiceNumber++;
    return `BT${current.toString().padStart(3, '0')}`;
  },

  async delete(id: string): Promise<boolean> {
    const index = invoices.findIndex((inv) => inv.id === id);
    if (index !== -1) {
      invoices.splice(index, 1);
      return true;
    }
    return false;
  },

  async reset(): Promise<void> {
    invoices = [];
    nextInvoiceNumber = 1;
  },
};
