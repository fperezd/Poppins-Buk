/**
 * Modulo Documents — Documentos del empleado
 *
 * Paths alineados con Swagger oficial (validados contra tenant prod 2026-05-09):
 *   GET   /employees/{id}/docs                 → listar docs de un empleado
 *   POST  /employees/{id}/docs                 → subir doc
 *   GET   /employees/{id}/docs/{file_id}       → metadata de un doc
 *   GET   /docs/{id}                           → especificaciones del doc
 *   POST  /docs/{id}/signatures/process        → procesar firma
 *
 *   ⚠️ ELIMINADO: /documents (sin prefijo /employees) no existe en Buk.
 */

import { BukHttpClient } from '../client';

export interface BukEmployeeFile {
  file_id: number;
  path?: string;
  filename?: string;
  visible?: boolean;
  signable_by_employee?: boolean;
  signable_by_legal_agent?: boolean;
  signatures?: unknown[];
  reviewer_id?: number;
  created_at?: string;
  [k: string]: unknown;
}

export interface BukEmployeeDocsResponse {
  employee_files: BukEmployeeFile[];
}

export class DocumentsModule {
  constructor(private readonly client: BukHttpClient) {}

  /**
   * Listar documentos de un empleado.
   * Respuesta no paginada: { employee_files: [...] }
   */
  async listEmployeeDocs(employeeId: number): Promise<BukEmployeeFile[]> {
    const response = await this.client.request<BukEmployeeDocsResponse>(
      `/employees/${employeeId}/docs`
    );
    return response.employee_files || [];
  }

  /**
   * Metadata de un documento especifico.
   */
  async getEmployeeDoc(employeeId: number, fileId: number): Promise<BukEmployeeFile> {
    return this.client.request<BukEmployeeFile>(
      `/employees/${employeeId}/docs/${fileId}`
    );
  }

  /**
   * Subir documento. El body debe incluir el archivo en formato base64 o multipart
   * segun la implementacion de Buk.
   */
  async uploadEmployeeDoc(employeeId: number, data: Record<string, unknown>): Promise<BukEmployeeFile> {
    return this.client.post<BukEmployeeFile>(
      `/employees/${employeeId}/docs`,
      data
    );
  }

  /**
   * Especificaciones del documento por su id global.
   */
  async getDocSpec(docId: number): Promise<unknown> {
    return this.client.request<unknown>(`/docs/${docId}`);
  }

  /**
   * Procesar firma de un documento.
   */
  async processSignature(docId: number, data: Record<string, unknown>): Promise<unknown> {
    return this.client.post<unknown>(`/docs/${docId}/signatures/process`, data);
  }
}
