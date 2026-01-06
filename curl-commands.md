# Comandos CURL para probar la API de Facturas

## Configuración
- Base URL: `http://localhost:3000`
- Content-Type: `application/json`

## Endpoints Disponibles

### 1. Obtener todas las facturas
```bash
curl -X GET http://localhost:3000/invoices
```

### 2. Obtener facturas por estado
```bash
# Facturas en borrador
curl -X GET "http://localhost:3000/invoices?status=draft"

# Facturas finalizadas
curl -X GET "http://localhost:3000/invoices?status=final"
```

### 3. Crear una nueva factura
```bash
curl -X POST http://localhost:3000/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "clientCif": "B12345678",
    "clientName": "Empresa S.A.",
    "clientAddress": "Calle Principal 123, Madrid",
    "baseAmount": 1000,
    "vatAmount": 210
  }'
```

### 4. Obtener factura por ID
```bash
curl -X GET http://localhost:3000/invoices/{id}
```

### 5. Finalizar una factura
```bash
curl -X PATCH http://localhost:3000/invoices/{id}/finalize
```

### 6. Eliminar una factura
```bash
curl -X DELETE http://localhost:3000/invoices/{id}
```

### 7. Acceder a endpoint protegido
```bash
curl -X GET http://localhost:3000/protected \
  -H "Authorization: Bearer {token}"
```

## Ejemplo completo de flujo de trabajo

### 1. Iniciar el servidor
```bash
npm run dev
```

### 2. Crear una factura
```bash
curl -X POST http://localhost:3000/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "clientCif": "A87654321",
    "clientName": "Cliente Ejemplo SL",
    "clientAddress": "Avenida de la Constitución 45, Barcelona",
    "baseAmount": 500,
    "vatAmount": 105
  }'
```

### 3. Guardar el ID de la factura creada (supongamos que es: `abc-123-def`)

### 4. Verificar la factura creada
```bash
curl -X GET http://localhost:3000/invoices/abc-123-def
```

### 5. Finalizar la factura
```bash
curl -X PATCH http://localhost:3000/invoices/abc-123-def/finalize
```

### 6. Verificar que ahora está finalizada
```bash
curl -X GET http://localhost:3000/invoices/abc-123-def
```

### 7. Listar todas las facturas
```bash
curl -X GET http://localhost:3000/invoices
```

### 8. Eliminar la factura
```bash
curl -X DELETE http://localhost:3000/invoices/abc-123-def
```

## Casos de error para testing

### Crear factura con campos obligatorios faltantes
```bash
# Sin clientCif
curl -X POST http://localhost:3000/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Empresa S.A.",
    "clientAddress": "Calle Principal 123, Madrid",
    "baseAmount": 1000,
    "vatAmount": 210
  }'

# Sin baseAmount
curl -X POST http://localhost:3000/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "clientCif": "B12345678",
    "clientName": "Empresa S.A.",
    "clientAddress": "Calle Principal 123, Madrid",
    "vatAmount": 210
  }'
```

### Acceder a factura que no existe
```bash
curl -X GET http://localhost:3000/invoices/non-existent-id
```

### Finalizar factura que no existe
```bash
curl -X PATCH http://localhost:3000/invoices/non-existent-id/finalize
```

### Eliminar factura que no existe
```bash
curl -X DELETE http://localhost:3000/invoices/non-existent-id
```

## Tips adicionales

### Formatear respuesta JSON
```bash
curl -X GET http://localhost:3000/invoices | jq
```

### Ver headers de respuesta
```bash
curl -v -X GET http://localhost:3000/invoices
```

### Guardar respuesta en archivo
```bash
curl -X GET http://localhost:3000/invoices -o response.json
```
