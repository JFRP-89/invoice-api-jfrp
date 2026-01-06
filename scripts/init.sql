CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY,
  client_cif VARCHAR(20) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_address VARCHAR(500) NOT NULL,
  base_amount DECIMAL(10, 2) NOT NULL,
  vat_amount DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  invoice_number VARCHAR(20) UNIQUE,
  status VARCHAR(10) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  finalized_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoice_counter (
  id INTEGER PRIMARY KEY DEFAULT 1,
  next_number INTEGER NOT NULL DEFAULT 1
);

INSERT INTO invoice_counter (id, next_number)
VALUES (1, 1)
ON CONFLICT (id) DO NOTHING;
