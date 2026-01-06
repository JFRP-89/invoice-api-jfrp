import crypto from 'crypto';
import { Invoice, IInvoiceRepository } from '../types';

export interface CreateInvoiceInput {
  clientCif?: string;
  clientName?: string;
  clientAddress?: string;
  baseAmount?: number;
  vatAmount?: number;
}

export type CreateInvoiceResult = {
  success: true;
  invoice: Invoice;
} | {
  success: false;
  error: string;
};

export async function CreateInvoiceUseCase(
  repository: IInvoiceRepository,
  input: CreateInvoiceInput
): Promise<CreateInvoiceResult> {
  const requiredFields = ['clientCif', 'clientName', 'clientAddress', 'baseAmount', 'vatAmount'] as const;

  for (const field of requiredFields) {
    if (input[field] === undefined || input[field] === null) {
      return {
        success: false,
        error: `El campo '${field}' es obligatorio`,
      };
    }
  }

  const invoice: Invoice = {
    id: crypto.randomUUID(),
    clientCif: input.clientCif!,
    clientName: input.clientName!,
    clientAddress: input.clientAddress!,
    baseAmount: input.baseAmount!,
    vatAmount: input.vatAmount!,
    totalAmount: input.baseAmount! + input.vatAmount!,
    invoiceNumber: null,
    status: 'draft',
    createdAt: new Date().toISOString(),
    finalizedAt: null,
  };

  await repository.save(invoice);

  return {
    success: true,
    invoice,
  };
}
