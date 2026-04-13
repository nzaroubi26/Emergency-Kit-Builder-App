import { redirect } from 'react-router-dom';
import { useKitStore } from '../store/kitStore';
import { useMCQStore } from '../store/mcqStore';

export function subkitConfigGuard({ params }: { params: Record<string, string | undefined> }) {
  const { selectedSubkits } = useKitStore.getState();
  const subkitId = params.subkitId;
  const exists = selectedSubkits.some((s) => s.subkitId === subkitId);
  if (!exists) return redirect('/builder');
  return null;
}

export function customConfigGuard() {
  const { selectedSubkits } = useKitStore.getState();
  const hasCustom = selectedSubkits.some((s) => s.categoryId === 'custom');
  if (!hasCustom) return redirect('/builder');
  return null;
}

export function summaryGuard() {
  const { selectedSubkits } = useKitStore.getState();
  if (selectedSubkits.length < 3) return redirect('/builder');
  return null;
}

export function confirmationGuard() {
  const { selectedSubkits } = useKitStore.getState();
  return selectedSubkits.length > 0 ? null : redirect('/builder');
}

export function mcqHouseholdGuard() {
  const { emergencyTypes } = useMCQStore.getState();
  if (emergencyTypes.length === 0) return redirect('/build');
  return null;
}

export function forkGuard() {
  const { emergencyTypes, householdComposition } = useMCQStore.getState();
  if (emergencyTypes.length === 0 || householdComposition.length === 0) {
    return redirect('/build');
  }
  return null;
}
