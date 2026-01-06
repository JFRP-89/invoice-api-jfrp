import { Invoice, IInvoiceRepository } from '../types';

export interface GetInvoicesInput {
  status?: 'draft' | 'final';
}

export async function GetInvoicesUseCase(
  repository: IInvoiceRepository,
  input: GetInvoicesInput
): Promise<Invoice[]> {
  const invoices = await repository.findAll();

  if (input.status) {
    return invoices.filter((invoice) => invoice.status === input.status);
  }

  return invoices;
}
