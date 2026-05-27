import { NextRequest, NextResponse } from 'next/server';

const useMock = process.env.USE_MOCK_DATA?.trim() === 'true';

interface FamilyMember {
  id: number;
  empleadoId: number;
  nombre: string;
  apellido: string;
  parentesco: string;
  rut: string;
  fechaNacimiento: string;
  edad: number;
  esCargaFamiliar: boolean;
  genero: string;
}

const MOCK_FAMILY: FamilyMember[] = [
  {
    id: 1, empleadoId: 1, nombre: 'Carlos', apellido: 'Martínez',
    parentesco: 'Hijo', rut: '21.456.789-0', fechaNacimiento: '2015-06-12',
    edad: 10, esCargaFamiliar: true, genero: 'M',
  },
  {
    id: 2, empleadoId: 1, nombre: 'Sofía', apellido: 'Martínez',
    parentesco: 'Hija', rut: '22.567.890-1', fechaNacimiento: '2018-11-03',
    edad: 7, esCargaFamiliar: true, genero: 'F',
  },
  {
    id: 3, empleadoId: 2, nombre: 'Lucía', apellido: 'López',
    parentesco: 'Hija', rut: '23.678.901-2', fechaNacimiento: '2012-03-22',
    edad: 14, esCargaFamiliar: true, genero: 'F',
  },
  {
    id: 4, empleadoId: 3, nombre: 'Pedro', apellido: 'González',
    parentesco: 'Cónyuge', rut: '10.111.222-3', fechaNacimiento: '1980-08-15',
    edad: 45, esCargaFamiliar: false, genero: 'M',
  },
  {
    id: 5, empleadoId: 3, nombre: 'Valentina', apellido: 'González',
    parentesco: 'Hija', rut: '24.789.012-3', fechaNacimiento: '2020-01-10',
    edad: 6, esCargaFamiliar: true, genero: 'F',
  },
  {
    id: 6, empleadoId: 4, nombre: 'Martín', apellido: 'Rodríguez',
    parentesco: 'Hijo', rut: '25.890.123-4', fechaNacimiento: '2016-07-28',
    edad: 9, esCargaFamiliar: true, genero: 'M',
  },
  {
    id: 7, empleadoId: 5, nombre: 'Diego', apellido: 'Soto',
    parentesco: 'Cónyuge', rut: '11.333.444-5', fechaNacimiento: '1985-04-02',
    edad: 41, esCargaFamiliar: false, genero: 'M',
  },
  {
    id: 8, empleadoId: 5, nombre: 'Emilia', apellido: 'Soto',
    parentesco: 'Hija', rut: '26.901.234-5', fechaNacimiento: '2019-09-18',
    edad: 6, esCargaFamiliar: true, genero: 'F',
  },
];

export async function GET(request: NextRequest) {
  try {
    if (useMock) {
      const { searchParams } = new URL(request.url);
      const employeeId = searchParams.get('employeeId');

      if (employeeId) {
        const members = MOCK_FAMILY.filter(m => m.empleadoId === Number(employeeId));
        return NextResponse.json({ data: members });
      }

      return NextResponse.json({ data: MOCK_FAMILY });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    if (!employeeId) {
      return NextResponse.json({ error: 'employeeId required' }, { status: 400 });
    }

    const { getBukSDK } = await import('@/lib/buk-sdk');
    const sdk = getBukSDK();

    const response = await sdk.raw().listAll<Record<string, unknown>>(
      `/employees/${employeeId}/family_members`
    );

    const members = response.map((m, i) => ({
      id: (m.id as number) || i + 1,
      empleadoId: Number(employeeId),
      nombre: (m.first_name as string) || '',
      apellido: (m.last_name as string) || '',
      parentesco: (m.relationship as string) || '',
      rut: (m.rut as string) || '',
      fechaNacimiento: (m.birth_date as string) || '',
      edad: (m.age as number) || 0,
      esCargaFamiliar: (m.is_dependent as boolean) || false,
      genero: (m.gender as string) || '',
    }));

    return NextResponse.json({ data: members });
  } catch (error) {
    console.error('[BUK] Error fetching family members:', error);
    return NextResponse.json(
      { error: 'Error al obtener grupo familiar' },
      { status: 500 }
    );
  }
}
