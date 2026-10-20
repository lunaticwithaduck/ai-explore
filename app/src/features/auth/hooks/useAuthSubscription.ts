import { useEffect } from 'react';
import { useAppDispatch } from '@/api/hooks';
import { authStateChanged } from '../state/authSlice';
import { subscribeToAuth } from '../utils/authActions';

export function useAuthSubscription() {
  const dispatch = useAppDispatch();
  useEffect(() => subscribeToAuth((user) => dispatch(authStateChanged(user))), [dispatch]);
}
