import { BUILDINGS } from '../data/mockData';
 
const STORAGE_KEY = 'zap_saved_locations';
 
const categoryToList = {
  Dining: 'Food',
  Study: 'Study',
  Academic: 'Academic',
  Recreation: 'Recreation',
  Outdoor: 'Outdoor',
  Services: 'Academic',
  Parking: 'Academic',
};
 
export function getSavedLocations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
 
export function setSavedLocations(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save locations:', e);
  }
}
 
export function toggleSavedLocation(buildingId) {
  const saved = getSavedLocations();
  const exists = saved.find(s => s.id === buildingId);
  let updated;
  if (exists) {
    updated = saved.filter(s => s.id !== buildingId);
  } else {
    const building = BUILDINGS.find(b => b.id === buildingId);
    updated = [
      ...saved,
      {
        id: buildingId,
        savedAt: new Date().toISOString(),
        list: categoryToList[building?.category] || 'Academic',
      },
    ];
  }
  setSavedLocations(updated);
  return updated;
}
 
export function isBuildingSaved(buildingId) {
  return getSavedLocations().some(s => s.id === buildingId);
}
 
export function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
}