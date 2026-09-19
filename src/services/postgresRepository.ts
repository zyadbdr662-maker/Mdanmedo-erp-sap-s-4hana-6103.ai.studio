import { ERPFullState, loadERPState, saveERPState } from "./erpStorage";
import { ERPRepository } from "./repository";
import { TenantIsolationService } from "./tenantIsolationService";

export class PostgresRepository implements ERPRepository {
  async loadState(): Promise<ERPFullState> {
    const activeTenant = TenantIsolationService.resolveActiveTenant();
    const localState = loadERPState(activeTenant);
    try {
      const response = await fetch(`/api/erp/state?tenantId=${encodeURIComponent(activeTenant)}`, {
        headers: {
          'x-tenant-id': activeTenant,
        },
      });
      if (!response.ok) {
        return localState; // Fallback to local state silently if API is not active or unconfigured
      }
      const data = await response.json();
      if (!data || typeof data !== 'object') {
        return localState;
      }

      // Merge local with remote state, preserving tenant identity
      const merged: ERPFullState = {
        ...localState,
        ...data,
        systemSettings: {
          ...localState.systemSettings,
          ...(data.systemSettings || {}),
          companyNameAr: localState.systemSettings?.companyNameAr || data.systemSettings?.companyNameAr,
          companyNameEn: localState.systemSettings?.companyNameEn || data.systemSettings?.companyNameEn,
          commercialRegister: localState.systemSettings?.commercialRegister || data.systemSettings?.commercialRegister,
          taxNumber: localState.systemSettings?.taxNumber || data.systemSettings?.taxNumber,
          phone: localState.systemSettings?.phone || data.systemSettings?.phone,
          address: localState.systemSettings?.address || data.systemSettings?.address,
        }
      };

      if (Array.isArray(data.inventoryItems) && data.inventoryItems.length > 0) {
        merged.inventoryItems = data.inventoryItems;
      } else {
        merged.inventoryItems = localState.inventoryItems;
      }

      if (Array.isArray(data.customers) && data.customers.length > 0) {
        merged.customers = data.customers;
      } else {
        merged.customers = localState.customers;
      }

      if (Array.isArray(data.vendors) && data.vendors.length > 0) {
        merged.vendors = data.vendors;
      } else {
        merged.vendors = localState.vendors;
      }

      // Also ensure updated remote state is cached in isolated local storage
      saveERPState(merged, activeTenant);

      return merged;
    } catch (error) {
      // Fallback silently to local state for offline-first resilience
      return localState;
    }
  }

  async saveState(state: Partial<ERPFullState>): Promise<void> {
    const activeTenant = TenantIsolationService.resolveActiveTenant();
    // Save locally first
    saveERPState(state, activeTenant);
    try {
      await fetch(`/api/erp/state?tenantId=${encodeURIComponent(activeTenant)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': activeTenant,
        },
        body: JSON.stringify(state)
      });
    } catch (error) {
      // Silent catch for offline capability
    }
  }
}

