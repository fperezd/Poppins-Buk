/**
 * Modulo Organization — estructura organizacional
 *
 * Paths alineados con Swagger oficial (validados contra tenant prod 2026-05-09):
 *   GET   /companies                       → empresas (typicamente 1 por tenant Buk)
 *   GET   /areas                           → areas organizacionales (CRUD)
 *   GET   /areas/{id}
 *   GET   /organization/areas/             → variante extendida
 *   GET   /organization/areas/{id}
 *   POST  /organization/areas/             → crear area
 *   PATCH /organization/areas/{id}         → actualizar
 *   GET   /centro_costo_definitions        → centros de costo
 *   GET   /centro_costo_definitions/{id}
 *   POST  /centro_costo_definitions        → crear
 *   PATCH /centro_costo_definitions/{id}
 *   GET   /locations                       → sucursales/oficinas
 *   GET   /locations/{id}
 *   GET   /roles                           → cargos disponibles
 *   GET   /role_families                   → familias de cargos
 *
 *   ⚠️ ELIMINADOS (no existen en API publica Buk):
 *     - /afps          → AFPs vienen embebidas en el empleado (campo pension_fund)
 *     - /health_plans  → planes de salud idem (campo health_company)
 */

import { BukHttpClient, type BukListResponse } from '../client';
import type {
  BukCompany,
  BukLocation,
  BukRole,
} from '../types/supplementary';

type Filters = Record<string, string | number | boolean | undefined>;

export interface BukArea {
  id: number;
  name: string;
  address: string | null;
  status: 'active' | 'inactive' | string;
  city: string | null;
  parent_area?: { id: number; name: string; city: string | null; commune: string | null; address: string | null } | null;
  children_area?: BukArea[];
  cost_center?: { id: number; name: string } | null;
  department?: { id: number; name: string; division?: { id: number; name: string } } | null;
}

export interface CreateAreaRequest {
  name: string;
  parent_area_id?: number;
  address?: string;
  city?: string;
  cost_center_id?: number;
  department_id?: number;
}

export interface BukCostCenter {
  id: number;
  name: string;
  code?: string;
  active?: boolean;
}

export class OrganizationModule {
  constructor(private readonly client: BukHttpClient) {}

  // ── Companies ──

  async listCompanies(): Promise<BukListResponse<BukCompany>> {
    return this.client.list<BukCompany>('/companies');
  }

  async listAllCompanies(): Promise<BukCompany[]> {
    return this.client.listAll<BukCompany>('/companies');
  }

  // ── Areas (lo que la app llama "empleadores funcionales" en modelo D) ──

  async listAreas(page = 1, pageSize?: number): Promise<BukListResponse<BukArea>> {
    return this.client.list<BukArea>('/areas', undefined, page, pageSize);
  }

  async listAllAreas(): Promise<BukArea[]> {
    return this.client.listAll<BukArea>('/areas');
  }

  async getArea(id: number): Promise<BukArea> {
    const response = await this.client.get<BukArea>(`/areas/${id}`);
    return response.data;
  }

  /**
   * Crear area organizacional.
   * Endpoint: POST /organization/areas/
   * (No usar /areas — el POST esta solo en /organization/areas/)
   */
  async createArea(data: CreateAreaRequest): Promise<BukArea> {
    return this.client.post<BukArea>('/organization/areas/', data as unknown as Record<string, unknown>);
  }

  async updateArea(id: number, data: Partial<CreateAreaRequest>): Promise<BukArea> {
    return this.client.request<BukArea>(`/organization/areas/${id}`, {
      method: 'POST', // PATCH no esta en BukRequestOptions; el endpoint acepta PATCH pero implementaremos como POST con override
      body: data as unknown as Record<string, unknown>,
    });
  }

  // ── Centros de costo ──

  async listCostCenters(page = 1, pageSize?: number): Promise<BukListResponse<BukCostCenter>> {
    return this.client.list<BukCostCenter>('/centro_costo_definitions', undefined, page, pageSize);
  }

  async listAllCostCenters(): Promise<BukCostCenter[]> {
    return this.client.listAll<BukCostCenter>('/centro_costo_definitions');
  }

  async getCostCenter(id: number): Promise<BukCostCenter> {
    const response = await this.client.get<BukCostCenter>(`/centro_costo_definitions/${id}`);
    return response.data;
  }

  // ── Locations / Sucursales ──

  async listLocations(filters?: Filters, page = 1, pageSize?: number): Promise<BukListResponse<BukLocation>> {
    return this.client.list<BukLocation>('/locations', filters, page, pageSize);
  }

  async listAllLocations(filters?: Filters): Promise<BukLocation[]> {
    return this.client.listAll<BukLocation>('/locations', filters);
  }

  async getLocation(id: number): Promise<BukLocation> {
    const response = await this.client.get<BukLocation>(`/locations/${id}`);
    return response.data;
  }

  // ── Roles / Cargos ──

  async listRoles(page = 1, pageSize?: number): Promise<BukListResponse<BukRole>> {
    return this.client.list<BukRole>('/roles', undefined, page, pageSize);
  }

  async listAllRoles(): Promise<BukRole[]> {
    return this.client.listAll<BukRole>('/roles');
  }

  async getRole(id: number): Promise<BukRole> {
    const response = await this.client.get<BukRole>(`/roles/${id}`);
    return response.data;
  }

  /**
   * Familias de cargos (agrupacion de roles).
   */
  async listRoleFamilies(): Promise<BukListResponse<{ id: number; name: string }>> {
    return this.client.list<{ id: number; name: string }>('/role_families');
  }

  // ── Catalogos NO disponibles via API publica de Buk ──

  /**
   * ❌ NO usar — el endpoint /afps no existe en Buk publica.
   * La AFP del empleado viene en el campo `pension_fund` de /employees/{id}.
   * Catalogo de AFPs Chile (fijo): capital, cuprum, habitat, modelo, planvital, provida, uno.
   */
  async listAfps(): Promise<never> {
    throw new Error(
      'organization.listAfps() no disponible. La API publica Buk no expone /afps. ' +
      'Usa el campo pension_fund de /employees/{id} o hardcodea el catalogo (capital, cuprum, habitat, modelo, planvital, provida, uno).'
    );
  }

  /**
   * ❌ NO usar — el endpoint /health_plans no existe en Buk publica.
   * El plan de salud del empleado viene en el campo `health_company` de /employees/{id}.
   * Catalogo de Isapres + Fonasa Chile (fijo): fonasa, banmedica, colmena, consalud, cruzblanca, vidatres, masvida.
   */
  async listHealthPlans(): Promise<never> {
    throw new Error(
      'organization.listHealthPlans() no disponible. La API publica Buk no expone /health_plans. ' +
      'Usa el campo health_company de /employees/{id} o hardcodea el catalogo (fonasa, banmedica, colmena, consalud, cruzblanca, vidatres, masvida).'
    );
  }

  // Aliases para compatibilidad con el service layer antiguo (que llamaba listDepartments)
  /** @deprecated Renombrado a listAreas() */
  listDepartments = this.listAreas;
  /** @deprecated Renombrado a listAllAreas() */
  listAllDepartments = this.listAllAreas;
}
