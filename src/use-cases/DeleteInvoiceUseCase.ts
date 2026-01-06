import { IInvoiceRepository } from '../types';

export interface DeleteInvoiceInput {
  id: string;
}

export type DeleteInvoiceResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
      code: 400 | 404;
    };

export async function DeleteInvoiceUseCase(
  repository: IInvoiceRepository,
  input: DeleteInvoiceInput
): Promise<DeleteInvoiceResult> {
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
      error: 'No se puede eliminar una factura en estado final',
      code: 400,
    };
  }

  await repository.delete(input.id);

  return {
    success: true,
  };
}
