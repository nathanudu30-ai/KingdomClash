import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  InventoryItem,
  ItemType,
  ITEM_CONFIGS,
  isItemExpired,
} from '@/types/inventory';

export function useInventory() {
  // Local inventory state (would be synced with Supabase in production)
  const [items, setItems] = useState<InventoryItem[]>([
    // Demo items
    {
      id: 'shield-1',
      type: 'shield',
      quantity: 3,
      obtainedAt: new Date().toISOString(),
    },
    {
      id: 'chest-small-1',
      type: 'chest_small',
      quantity: 2,
      obtainedAt: new Date().toISOString(),
    },
  ]);

  const [isUsing, setIsUsing] = useState(false);

  // Get item count by type
  const getItemCount = useCallback(
    (type: ItemType): number => {
      const item = items.find((i) => i.type === type && !isItemExpired(i));
      return item?.quantity ?? 0;
    },
    [items]
  );

  // Check if player has item
  const hasItem = useCallback(
    (type: ItemType, quantity: number = 1): boolean => {
      return getItemCount(type) >= quantity;
    },
    [getItemCount]
  );

  // Add item to inventory
  const addItem = useCallback(
    async (type: ItemType, quantity: number = 1) => {
      const config = ITEM_CONFIGS[type];

      setItems((prev) => {
        const existing = prev.find((i) => i.type === type && !isItemExpired(i));

        if (existing && config.stackable) {
          // Stack with existing
          const newQuantity = Math.min(existing.quantity + quantity, config.maxStack);
          return prev.map((i) =>
            i.id === existing.id ? { ...i, quantity: newQuantity } : i
          );
        } else {
          // Add new item
          const newItem: InventoryItem = {
            id: `${type}-${Date.now()}`,
            type,
            quantity: Math.min(quantity, config.maxStack),
            obtainedAt: new Date().toISOString(),
          };
          return [...prev, newItem];
        }
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    []
  );

  // Use an item
  const useItem = useCallback(
    async (type: ItemType, quantity: number = 1): Promise<boolean> => {
      if (!hasItem(type, quantity)) {
        Alert.alert('Item manquant', `Vous n'avez pas assez de ${ITEM_CONFIGS[type].name}.`);
        return false;
      }

      const config = ITEM_CONFIGS[type];
      if (!config.usable) {
        return false;
      }

      setIsUsing(true);

      try {
        // Haptic feedback
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        setItems((prev) => {
          const item = prev.find((i) => i.type === type && !isItemExpired(i));
          if (!item) return prev;

          const newQuantity = item.quantity - quantity;

          if (newQuantity <= 0) {
            return prev.filter((i) => i.id !== item.id);
          }

          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: newQuantity } : i
          );
        });

        // In production: Apply item effect via Supabase
        // await supabase.rpc('use_item', { item_type: type });

        return true;
      } catch (error) {
        console.error('Error using item:', error);
        Alert.alert('Erreur', 'Impossible d\'utiliser cet item.');
        return false;
      } finally {
        setIsUsing(false);
      }
    },
    [hasItem]
  );

  // Remove expired items
  const cleanupExpiredItems = useCallback(() => {
    setItems((prev) => prev.filter((item) => !isItemExpired(item)));
  }, []);

  // Get all non-expired items
  const validItems = items.filter((item) => !isItemExpired(item));

  return {
    items: validItems,
    isUsing,
    getItemCount,
    hasItem,
    addItem,
    useItem,
    cleanupExpiredItems,
  };
}
