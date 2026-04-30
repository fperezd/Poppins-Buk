import { NextRequest, NextResponse } from 'next/server';

const useMock = process.env.USE_MOCK_DATA?.trim() === 'true';

interface DocumentItem {
  id: number;
  empleadoId: number;
  empleadoNombre: string;
  tipo: string;
  nombre: string;
  fechaCreacion: string;
  estado: string;
  url?: string;
}

const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 1, empleadoId: 1, empleadoNombre: 'María Martínez García',
    tipo: 'contrato', nombre: 'Contrato de Trabajo - María Martínez',
    fechaCreacion: '2022-03-01', estado: 'firmado',
  },
  {
    id: 2, empleadoId: 1, empleadoNombre: 'María Martínez García',
    tipo: 'anexo', nombre: 'Anexo Reajuste Sueldo 2025',
    fechaCreacion: '2025-01-15', estado: 'firmado',
  },
  {
    id: 3, empleadoId: 2, empleadoNombre: 'Ana Lucía López Silva',
    tipo: 'contrato', nombre: 'Contrato de Trabajo - Ana Lucía López',
    fechaCreacion: '2023-06-15', estado: 'firmado',
  },
  {
    id: 4, empleadoId: 3, empleadoNombre: 'Carmen González Rojas',
    tipo: 'contrato', nombre: 'Contrato de Trabajo - Carmen González',
    fechaCreacion: '2021-01-01', estado: 'firmado',
  },
  {
    id: 5, empleadoId: 3, empleadoNombre: 'Carmen González Rojas',
    tipo: 'certificado', nombre: 'Certificado de Antigüedad',
    fechaCreacion: '2026-03-10', estado: 'emitido',
  },
  {
    id: 6, empleadoId: 4, empleadoNombre: 'Julia Rodríguez Pérez',
    tipo: 'contrato', nombre: 'Contrato de Trabajo - Julia Rodríguez',
    fechaCreacion: '2022-09-10', estado: 'firmado',
  },
  {
    id: 7, empleadoId: 4, empleadoNombre: 'Julia Rodríguez Pérez',
    tipo: 'anexo', nombre: 'Anexo Cambio de Funciones',
    fechaCreacion: '2025-06-01', estado: 'pendiente_firma',
  },
  {
    id: 8, empleadoId: 5, empleadoNombre: 'Rosa Soto Fuentes',
    tipo: 'contrato', nombre: 'Contrato Plazo Fijo - Rosa Soto',
    fechaCreacion: '2023-11-01', estado: 'firmado',
  },
  {
    id: 9, empleadoId: 5, empleadoNombre: 'Rosa Soto Fuentes',
    tipo: 'finiquito', nombre: 'Renovación Contrato Plazo Fijo',
    fechaCreacion: '2025-11-01', estado: 'firmado',
  },
  {
    id: 10, empleadoId: 1, empleadoNombre: 'María Martínez García',
    tipo: 'certificado', nombre: 'Certificado de Cotizaciones AFP',
    fechaCreacion: '2026-04-01', estado: 'emitido',
  },
];

export async function GET(request: NextRequest) {
  try {
    if (useMock) {
      const { searchParams } = new URL(request.url);
      const employeeId = searchParams.get('employeeId');
      const tipo = searchParams.get('tipo');

      let docs = MOCK_DOCUMENTS;
      if (employeeId) docs = docs.filter(d => d.empleadoId === Number(employeeId));
      if (tipo) docs = docs.filter(d => d.tipo === tipo);

      return NextResponse.json({ data: docs });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    const { getBukSDK } = await import('@/lib/buk-sdk');
    const sdk = getBukSDK();

    let docs;
    if (employeeId) {
      docs = await sdk.documents.listAllByEmployee(Number(employeeId));
    } else {
      const response = await sdk.documents.list(undefined, 1, 100);
      docs = response.data;
    }

    const mapped = docs.map((d) => ({
      id: d.id,
      empleadoId: d.employee_id,
      tipo: d.document_type || 'otro',
      nombre: d.name || d.file_name || 'Documento',
      fechaCreacion: d.created_at || '',
      estado: 'disponible',
      url: d.file_url || null,
    }));

    return NextResponse.json({ data: mapped });
  } catch (error) {
    console.error('[BUK] Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Error al obtener documentos' },
      { status: 500 }
    );
  }
}
