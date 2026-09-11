import { ERPFullState, loadERPState } from "./erpStorage";
import { ERPRepository } from "./repository";

export class PostgresRepository implements ERPRepository {
  async loadState(): Promise<ERPFullState> {
    const localState = loadERPState();
    try {
      const response = await fetch('/api/erp/state');
      if (!response.ok) {
        return localState; // Fallback to local state silently if API is not active or unconfigured
      }
      const data = await response.json();
      if (!data || typeof data !== 'object') {
        return localState;
      }

      // Merge local with remote to guarantee that no local inventory items or essential collections are lost
      const merged: ERPFullState = {
        ...localState,
        ...data,
      };

      // Guarantee inventoryItems is a rich array if either local or server had items
      const itemMap = new Map<string, any>();
      (localState.inventoryItems || []).forEach((item) => {
        if (item && item.id) itemMap.set(item.id, item);
      });
      (data.inventoryItems || []).forEach((item: any) => {
        if (item && item.id) itemMap.set(item.id, item);
      });
      merged.inventoryItems = Array.from(itemMap.values());

      // Merge customers similarly
      if (Array.isArray(localState.customers) || Array.isArray(data.customers)) {
        const custMap = new Map<string, any>();
        (localState.customers || []).forEach((c) => {
          if (c && c.id) custMap.set(c.id, c);
        });
        (data.customers || []).forEach((c: any) => {
          if (c && c.id) custMap.set(c.id, c);
        });
        merged.customers = Array.from(custMap.values());
      }

      return merged;
    } catch (error) {
      // Fallback silently to local state for offline-first resilience
      return localState;
    }
  }

  async saveState(state: Partial<ERPFullState>): Promise<void> {
    try {
      await fetch('/api/erp/state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state)
      });
    } catch (error) {
      // Silent catch for offline capability
    }
  }
}
