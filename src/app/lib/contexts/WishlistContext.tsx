'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { toggleFavorite as toggleFavoriteAction, getUserWishlistIds } from '@/src/actions/wishlist';
import { useSession } from 'next-auth/react';

interface WishlistContextType {
    wishlistIds: Set<string>;
    isLoading: boolean;
    toggleFavorite: (productId: string) => Promise<boolean>;
    isInWishlist: (productId: string) => boolean;
    refreshWishlist: () => Promise<void>;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  // useRef para siempre tener el valor más reciente sin stale closures
  const wishlistIdsRef = useRef<Set<string>>(wishlistIds);
  wishlistIdsRef.current = wishlistIds;

  // Flag para evitar toggles simultáneos en el mismo producto
  const togglingRef = useRef<Set<string>>(new Set());

  // Cargar wishlist inicial cuando el usuario esté autenticado
  const loadWishlist = useCallback(async () => {
    if (status === 'loading') return;

    if (!session?.user?.id) {
      setWishlistIds(new Set());
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await getUserWishlistIds();

      if (result.success) {
        setWishlistIds(new Set(result.productIds));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, status]);

  // Cargar wishlist cuando cambie el estado de autenticación
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Toggle favorite con optimistic update — usa ref para evitar stale closure
  const toggleFavorite = useCallback(async (productId: string): Promise<boolean> => {
    // Evitar doble-click en el mismo producto
    if (togglingRef.current.has(productId)) {
      return wishlistIdsRef.current.has(productId);
    }
    togglingRef.current.add(productId);

    // Leer siempre el estado más actual desde el ref
    const currentIds = wishlistIdsRef.current;
    const previousWishlistIds = new Set(currentIds);
    const wasInWishlist = currentIds.has(productId);
        
    // Optimistic update
    const newWishlistIds = new Set(currentIds);
    if (wasInWishlist) {
      newWishlistIds.delete(productId);
    } else {
      newWishlistIds.add(productId);
    }
    setWishlistIds(newWishlistIds);

    try {
      // Llamar a la server action
      const result = await toggleFavoriteAction(productId);

      if (!result.success) {
        // Revertir al estado anterior si falló
        setWishlistIds(previousWishlistIds);
        console.error('Error toggling favorite:', result.message);
        return wasInWishlist;
      }

      return result.isInWishlist;
    } catch (error) {
      // Revertir al estado anterior si hubo error
      setWishlistIds(previousWishlistIds);
      console.error('Error toggling favorite:', error);
      return wasInWishlist;
    } finally {
      togglingRef.current.delete(productId);
    }
  }, []); // Sin dependencia de wishlistIds — usa el ref

  // Verificar si un producto está en wishlist
  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlistIds.has(productId);
  }, [wishlistIds]);

  // Refrescar wishlist (útil después de eliminar desde la página de favoritos)
  const refreshWishlist = useCallback(async () => {
    await loadWishlist();
  }, [loadWishlist]);

  // Contador de items en wishlist
  const wishlistCount = wishlistIds.size;

  const value: WishlistContextType = {
    wishlistIds,
    isLoading,
    toggleFavorite,
    isInWishlist,
    refreshWishlist,
    wishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }

  return context;
}