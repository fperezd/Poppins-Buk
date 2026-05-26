/**
 * Hooks para consumir /api/buk/v1/*.
 *
 * Patrón: cada hook devuelve { data, loading, error, refetch }.
 * Para mutations: { mutate, loading, error, data }.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch, apiPost, apiPut, apiPatch, apiDelete, ApiError, type ApiResponse } from '@/lib/api/client';

// ── Hook genérico de lectura ──

export interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  pagination: ApiResponse<T>['pagination'] | undefined;
  refetch: () => Promise<void>;
}

export function useQuery<T>(
  path: string | null,
  query?: Record<string, string | number | boolean | undefined | null>
): QueryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [pagination, setPagination] = useState<ApiResponse<T>['pagination']>();

  const fetch = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<T>(path, { query });
      setData(res.data);
      setPagination(res.pagination);
    } catch (e) {
      if (e instanceof ApiError) setError(e);
      else setError(new ApiError('UNKNOWN', String(e), 0));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, JSON.stringify(query)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, pagination, refetch: fetch };
}

// ── Hook genérico de mutation ──

export interface MutationState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export function useMutation<TBody, TResp = unknown>(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
): MutationState<TResp> & { mutate: (body?: TBody) => Promise<TResp | null> } {
  const [data, setData] = useState<TResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(async (body?: TBody): Promise<TResp | null> => {
    setLoading(true);
    setError(null);
    try {
      let res;
      switch (method) {
        case 'POST': res = await apiPost<TResp>(path, body); break;
        case 'PUT': res = await apiPut<TResp>(path, body); break;
        case 'PATCH': res = await apiPatch<TResp>(path, body); break;
        case 'DELETE': res = await apiDelete<TResp>(path); break;
      }
      setData(res.data);
      return res.data;
    } catch (e) {
      const apiErr = e instanceof ApiError ? e : new ApiError('UNKNOWN', String(e), 0);
      setError(apiErr);
      return null;
    } finally {
      setLoading(false);
    }
  }, [path, method]);

  return { data, loading, error, mutate };
}

// ── Hooks específicos ──

// Tipos mínimos para shapes Buk passthrough (snake_case)
export interface Empleado {
  id: number;
  person_id?: number;
  picture_url?: string | null;
  first_name?: string;
  surname?: string;
  full_name?: string;
  rut?: string;
  email?: string;
  phone_number?: string;
  current_job?: {
    id?: number;
    area_id?: number;
    role?: { id: number; name: string };
    start_date?: string;
  };
  active?: boolean;
  [k: string]: unknown;
}

export interface Hogar {
  id: number;
  name: string;
  address?: string | null;
  city?: string | null;
  status?: string;
  parent_area?: { id: number; name: string };
  children_area?: Hogar[];
  [k: string]: unknown;
}

export interface MeResponse {
  user_id: string;
  email: string | null;
  rol: 'admin' | 'empleador' | 'colaboradora';
  buk_employee_id: number | null;
  buk_area_id: number | null;
  buk_employee: Empleado | null;
  buk_area: Hogar | null;
}

export function useMe() {
  return useQuery<MeResponse>('/me');
}

export function useColaboradoras(filters?: { hogar_id?: number; status?: string; search?: string }) {
  return useQuery<Empleado[]>('/colaboradoras', filters);
}

export function useColaboradora(id: number | null) {
  return useQuery<Empleado>(id ? `/colaboradoras/${id}` : null);
}

export function useEmpleadores() {
  return useQuery<Empleado[]>('/empleadores');
}

export function useEmpleador(id: number | null) {
  return useQuery<Empleado>(id ? `/empleadores/${id}` : null);
}

export function useHogares() {
  return useQuery<Hogar[]>('/hogares');
}

export function useHogar(id: number | null) {
  return useQuery<Hogar>(id ? `/hogares/${id}` : null);
}

export function useHogarEmpleados(id: number | null) {
  return useQuery<{ hogar_id: number; empleador: Empleado | null; colaboradoras: Empleado[]; total: number }>(
    id ? `/hogares/${id}/empleados` : null
  );
}

export function useVacaciones(colaboradora_id?: number) {
  return useQuery<unknown[]>('/vacaciones', colaboradora_id ? { colaboradora_id } : undefined);
}

export function useSaldoVacaciones(colaboradora_id: number | null) {
  return useQuery<{ vacations?: { name: string; stock: number }[] }>(
    colaboradora_id ? `/colaboradoras/${colaboradora_id}/vacaciones/saldo` : null
  );
}

export function useLiquidaciones(colaboradora_id: number | null) {
  return useQuery<unknown[]>(
    colaboradora_id ? `/colaboradoras/${colaboradora_id}/liquidaciones` : null
  );
}

export function useCatalogoCargos() {
  return useQuery<Array<{ id: number; name: string }>>('/catalogos/cargos');
}

export function useTareas(filters?: { hogar_id?: number; colaboradora_id?: number; estado?: string }) {
  return useQuery<unknown[]>('/tareas', filters);
}

export function useHealth() {
  return useQuery<{ buk: { ok: boolean; latency_ms: number; tenant: string } }>('/health');
}
