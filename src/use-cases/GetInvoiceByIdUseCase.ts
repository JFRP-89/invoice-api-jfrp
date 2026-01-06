import { Invoice, IInvoiceRepository } from '../types';

export interface GetInvoiceByIdInput {
  id: string;
}

export type GetInvoiceByIdResult =
  | {
      success: true;
      invoice: Invoice;
    }
  | {
      success: false;
      error: string;
      code: 404;
    };

export async function GetInvoiceByIdUseCase(
  repository: IInvoiceRepository,
  input: GetInvoiceByIdInput
): Promise<GetInvoiceByIdResult> {
  const invoice = await repository.findById(input.id);

  if (!invoice) {
    return {
      success: false,
      error: 'Factura no encontrada',
      code: 404,
    };
  }

  return {
    success: true,
    invoice,
  };
}
