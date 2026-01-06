"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetInvoicesUseCase = GetInvoicesUseCase;
async function GetInvoicesUseCase(repository, input) {
    const invoices = await repository.findAll();
    if (input.status) {
        return invoices.filter((invoice) => invoice.status === input.status);
    }
    return invoices;
}
