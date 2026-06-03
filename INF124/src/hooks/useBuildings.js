import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api/client';
import { getToken } from '../context/AuthContext';

// ============================================================
// useBuildings — fetch all buildings from the API
// ============================================================
export function useBuildings() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBuildings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/buildings');
      setBuildings(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBuildings(); }, [fetchBuildings]);

  return { buildings, loading, error, refetch: fetchBuildings };
}

// ============================================================
// useBuilding — fetch a single building by slug id
// ============================================================
export function useBuilding(id) {
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBuilding = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/buildings/${id}`);
      setBuilding(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchBuilding(); }, [fetchBuilding]);

  return { building, loading, error, refetch: fetchBuilding };
}

// ============================================================
// Admin building CRUD helpers
// ============================================================

export async function createBuilding(buildingData) {
  const token = getToken();
  return apiFetch('/buildings', {
    method: 'POST',
    body: buildingData,
    token,
  });
}

export async function updateBuilding(id, buildingData) {
  const token = getToken();
  return apiFetch(`/buildings/${id}`, {
    method: 'PUT',
    body: buildingData,
    token,
  });
}

export async function deleteBuilding(id) {
  const token = getToken();
  return apiFetch(`/buildings/${id}`, {
    method: 'DELETE',
    token,
  });
}