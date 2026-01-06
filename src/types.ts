export interface Invoice {
  id: string;
  clientCif: string;
  clientName: string;
  clientAddress: string;
  baseAmount: number;
  vatAmount: number;
  totalAmount: number;
  invoiceNumber: string | null;
  status: 'draft' | 'final';
  createdAt: string;
  finalizedAt: string | null;
}

export interface IInvoiceRepository {
  connect(): Promise<void>;
  save(invoice: Invoice): Promise<Invoice>;
  findAll(): Promise<Invoice[]>;
  findById(id: string): Promise<Invoice | undefined>;
  update(invoice: Invoice): Promise<Invoice>;
  getNextInvoiceNumber(): Promise<string>;
  delete(id: string): Promise<boolean>;
  reset(): Promise<void>;
}
