import { Invoice, IInvoiceRepository } from '../types';

export class InMemoryInvoiceRepository implements IInvoiceRepository {
  private invoices: Invoice[] = [];
  private nextInvoiceNumber = 1;

  async connect(): Promise<void> {
    // In-memory repository always connects successfully
  }

  async save(invoice: Invoice): Promise<Invoice> {
    this.invoices.push(invoice);
    return invoice;
  }

  async findAll(): Promise<Invoice[]> {
    return [...this.invoices];
  }

  async findById(id: string): Promise<Invoice | undefined> {
    return this.invoices.find((invoice) => invoice.id === id);
  }

  async update(invoice: Invoice): Promise<Invoice> {
    const index = this.invoices.findIndex((inv) => inv.id === invoice.id);
    if (index !== -1) {
      this.invoices[index] = invoice;
    }
    return invoice;
  }

  async getNextInvoiceNumber(): Promise<string> {
    const current = this.nextInvoiceNumber;
    this.nextInvoiceNumber++;
    return `BT${current.toString().padStart(3, '0')}`;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.invoices.findIndex((inv) => inv.id === id);
    if (index !== -1) {
      this.invoices.splice(index, 1);
      return true;
    }
    return false;
  }

  async reset(): Promise<void> {
    this.invoices = [];
    this.nextInvoiceNumber = 1;
  }
}
