import { Invoice, IInvoiceRepository } from '../types';

export interface FinalizeInvoiceInput {
  id: string;
}

export type FinalizeInvoiceResult =
  | {
      success: true;
      invoice: Pick<Invoice, 'id' | 'invoiceNumber' | 'status' | 'finalizedAt'>;
    }
  | {
      success: false;
      error: string;
      code: 400 | 404;
    };

export async function FinalizeInvoiceUseCase(
  repository: IInvoiceRepository,
  input: FinalizeInvoiceInput
): Promise<FinalizeInvoiceResult> {
  const invoice = await repository.findById(input.id);

  if (!invoice) {
    return {
      success: false,
      error: 'Factura no encontrada',
      code: 404,
    };
  }

  if (invoice.status === 'final') {
    return {
      success: false,
      error: 'La factura ya está finalizada',
      code: 400,
    };
  }

  invoice.status = 'final';
  invoice.invoiceNumber = await repository.getNextInvoiceNumber();
  invoice.finalizedAt = new Date().toISOString();

  await repository.update(invoice);

  return {
    success: true,
    invoice: {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      finalizedAt: invoice.finalizedAt,
    },
  };
}
