import { create } from 'zustand';
import { ImageSourcePropType } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, equipmentAPI, requirementAPI, matchAPI, inquiryAPI } from '../api';

interface AuthState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
  hasOnboarded: boolean;
  preferredRole: 'buyer' | 'supplier' | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  googleLogin: (idToken: string, userType?: 'buyer' | 'supplier') => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  completeOnboarding: (role?: 'buyer' | 'supplier' | null) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  requireAuth: () => boolean;
  refreshUser: () => Promise<any | null>;
  updateProfile: (data: any) => Promise<any>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isGuest: false,
  hasOnboarded: false,
  preferredRole: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // Call backend; demo credentials are handled server-side via .env.
      let user: any;
      let token: string;
      try {
        const res = await authAPI.login({ email, password });
        const d: any = res.data || {};
        user = d.user ?? d;
        token = d.token ?? d.accessToken ?? 'mock-token';
      } catch (apiErr: any) {
        // Offline fallback is removed — let the server return the error.
        throw apiErr;
      }

      await AsyncStorage.multiSet([
        ['@urbanav_user', JSON.stringify(user)],
        ['@urbanav_token', token],
        ['@urbanav_authenticated', 'true'],
        ['@urbanav_onboarded', 'true'],
      ]);

      set({ user, token, isAuthenticated: true, isGuest: false, hasOnboarded: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data: any) => {
    set({ isLoading: true });
    // Force buyer role for this app (urbanav-mobile is buyer-only).
    const payload = { ...data, role: 'buyer', userType: 'buyer' };
    try {
      let user: any;
      let token: string;
      try {
        const res = await authAPI.register(payload);
        const d: any = res.data || {};
        user = d.user ?? d;
        token = d.token ?? d.accessToken ?? 'mock-token';
      } catch (apiErr: any) {
        // Offline fallback so UI works without backend
        user = {
          id: `local_${Date.now()}`,
          name: payload.name,
          email: payload.email,
          role: 'buyer',
          userType: 'buyer',
        };
        token = 'mock-token';
      }

      await AsyncStorage.multiSet([
        ['@urbanav_user', JSON.stringify(user)],
        ['@urbanav_token', token],
        ['@urbanav_authenticated', 'true'],
        ['@urbanav_onboarded', 'true'],
      ]);

      set({ user, token, isAuthenticated: true, isGuest: false, hasOnboarded: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  googleLogin: async (idToken: string, userType: 'buyer' | 'supplier' = 'buyer') => {
    set({ isLoading: true });
    try {
      const res = await authAPI.google({ idToken, userType });
      const d: any = res.data || {};
      const user = d.user ?? d;
      const token = d.token ?? d.accessToken ?? 'mock-token';

      await AsyncStorage.multiSet([
        ['@urbanav_user', JSON.stringify(user)],
        ['@urbanav_token', token],
        ['@urbanav_authenticated', 'true'],
        ['@urbanav_onboarded', 'true'],
      ]);

      set({ user, token, isAuthenticated: true, isGuest: false, hasOnboarded: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    // Clear auth but KEEP onboarding flag so returning users don't re-see it.
    await AsyncStorage.multiRemove([
      '@urbanav_user',
      '@urbanav_token',
      '@urbanav_authenticated',
    ]);
    
    set({ user: null, token: null, isAuthenticated: false, isGuest: false });
  },
  
  checkAuth: async () => {
    try {
      const [userStr, token, authenticated, onboarded, guest, role] = await AsyncStorage.multiGet([
        '@urbanav_user',
        '@urbanav_token',
        '@urbanav_authenticated',
        '@urbanav_onboarded',
        '@urbanav_guest',
        '@urbanav_preferred_role',
      ]);

      const hasOnboarded = onboarded[1] === 'true';
      const isGuest = guest[1] === 'true';
      const preferredRole = (role[1] as 'buyer' | 'supplier' | null) || null;

      if (authenticated[1] === 'true' && token[1] && userStr[1]) {
        const user = JSON.parse(userStr[1]);
        set({
          user,
          token: token[1],
          isAuthenticated: true,
          isGuest: false,
          hasOnboarded: true,
          preferredRole,
          isLoading: false,
        });
      } else {
        set({ isLoading: false, hasOnboarded, isGuest, preferredRole });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({ isLoading: false });
    }
  },

  completeOnboarding: async (role: 'buyer' | 'supplier' | null = null) => {
    await AsyncStorage.multiSet([
      ['@urbanav_onboarded', 'true'],
      ...(role ? ([['@urbanav_preferred_role', role]] as [string, string][]) : []),
    ]);
    set({ hasOnboarded: true, preferredRole: role ?? get().preferredRole });
  },

  continueAsGuest: async () => {
    await AsyncStorage.multiSet([
      ['@urbanav_onboarded', 'true'],
      ['@urbanav_guest', 'true'],
    ]);
    set({ isGuest: true, hasOnboarded: true, isAuthenticated: false, user: null, token: null });
  },

  // Helper used by guarded actions (post requirement, book, chat, review).
  // Returns true if the action should proceed; false if guest and caller should redirect to Login.
  requireAuth: () => {
    const { isAuthenticated, isGuest } = get();
    return isAuthenticated && !isGuest;
  },

  // Re-fetch the authenticated user from the server and rehydrate the store.
  // Safe to call unconditionally: no-ops for guests / unauthenticated / offline.
  refreshUser: async () => {
    const { isAuthenticated, isGuest, user: prev } = get();
    if (!isAuthenticated || isGuest) return null;
    try {
      const res = await authAPI.getMe();
      const d: any = res.data || {};
      const fresh = d.user ?? d;
      if (!fresh || typeof fresh !== 'object') return prev;
      const merged = { ...(prev || {}), ...fresh };
      await AsyncStorage.setItem('@urbanav_user', JSON.stringify(merged));
      set({ user: merged });
      return merged;
    } catch {
      return prev; // offline / 401 — keep cached user
    }
  },

  updateProfile: async (data: any) => {
    const { user: prev } = get();
    let updated = { ...(prev || {}), ...data };
    try {
      const res = await authAPI.updateProfile(data);
      const d: any = res.data || {};
      const fresh = d.user ?? d;
      if (fresh && typeof fresh === 'object') updated = { ...updated, ...fresh };
    } catch {
      // Offline: persist locally so the UI reflects the edit.
    }
    await AsyncStorage.setItem('@urbanav_user', JSON.stringify(updated));
    set({ user: updated });
    return updated;
  },
}));

// ============================================================
// Equipment store — real backend with local fallback
// ============================================================
import { fullEquipmentDatabase } from '../data/equipment-database';
import { categoryFallbackImages, getEquipmentImage } from '../data/equipment-images';
import { resolveMediaUrl } from '../api';

/**
 * Resolve an equipment image for a record coming from the backend.
 *
 * The seed writes placeholder URLs (via.placeholder.com) that are often
 * DNS-blocked on end-user networks, so we PREFER a locally bundled image
 * (keyed by legacy catalog id like `proj-001`, else by category) and only
 * fall back to the remote URI when we have no local match.
 */
function pickEquipmentImage(e: any): any {
  // 1. Legacy string id ('proj-001' etc.) → exact bundled asset
  const legacyId = typeof e.id === 'string' ? e.id : undefined;
  if (legacyId && getEquipmentImage) {
    const local = getEquipmentImage(legacyId, e.category);
    if (local) return local;
  }
  // 2. Category fallback (guaranteed to exist for any seeded category)
  const catImg = categoryFallbackImages[e.category];
  if (catImg) return catImg;
  // 3. Last resort: resolve the backend URI if it looks usable
  const raw = Array.isArray(e.images) ? e.images[0] : e.image;
  if (typeof raw === 'string' && raw && !raw.includes('via.placeholder.com')) {
    const resolved = resolveMediaUrl(raw);
    if (resolved) return { uri: resolved };
  }
  return undefined;
}

export type EquipmentItem = {
  id: string;
  name: string;
  category: string;
  image: any;
  price?: string | number;
  popular?: boolean;
  vendor?: string;
  description?: string;
};

interface EquipmentState {
  items: EquipmentItem[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
  fetchAll: (force?: boolean) => Promise<EquipmentItem[]>;
}

export const useEquipmentStore = create<EquipmentState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  loaded: false,

  fetchAll: async (force = false) => {
    if (get().loaded && !force) return get().items;
    set({ loading: true, error: null });
    try {
      const res = await equipmentAPI.getAll();
      const list: EquipmentItem[] = (res.data?.equipment ?? res.data ?? []).map(
        (e: any) => ({
          id: e.id ?? e._id,
          name: e.name,
          category: e.category,
          image: pickEquipmentImage(e),
          price: e.price ?? '#ContactForPrice',
          popular: !!e.popular,
          vendor: e.vendor?.businessName || e.vendor?.name || 'UrbanAV Partner',
          description: e.description,
        })
      );
      if (list.length) {
        set({ items: list, loading: false, loaded: true });
        return list;
      }
      throw new Error('empty');
    } catch (err: any) {
      // Offline/empty — use local catalog so the UI still works.
      // Normalize the local shape (basePrice / image string) into the mobile EquipmentItem
      // the UI expects (price, vendor, image as require() or {uri}).
      const raw: any[] = fullEquipmentDatabase as any[];
      const list: EquipmentItem[] = raw.map((e: any) => ({
        id: e.id,
        name: e.name,
        category: e.category,
        image: e.image, // already a require() ref from getEquipmentImage()
        price: '#ContactForPrice', // price is always masked per product rule
        popular: !!e.popular,
        vendor: e.vendor || 'UrbanAV Partner',
        description: e.description,
      }));
      set({
        items: list,
        loading: false,
        loaded: true,
        error: null,
      });
      return list;
    }
  },
}));

interface CartItem {
  id: string;
  name: string;
  image: ImageSourcePropType;
  price: string | number;
  quantity: number;
  rentalDays: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  hydrate: () => Promise<void>;
}

const CART_STORAGE_KEY = 'urbanav_cart_v1';

const persistCart = (items: CartItem[]) => {
  try {
    // Strip non-serializable image sources; keep ids so we can rehydrate visuals
    const slim = items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      rentalDays: i.rentalDays,
    }));
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(slim)).catch(() => {});
  } catch {
    // ignore
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (item: CartItem) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      const next = existing
        ? {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }
        : { items: [...state.items, item] };
      persistCart(next.items);
      return next;
    });
  },

  removeFromCart: (id: string) => {
    set((state) => {
      const items = state.items.filter((item) => item.id !== id);
      persistCart(items);
      return { items };
    });
  },

  updateQuantity: (id: string, quantity: number) => {
    set((state) => {
      const items = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      persistCart(items);
      return { items };
    });
  },

  clearCart: () => {
    AsyncStorage.removeItem(CART_STORAGE_KEY).catch(() => {});
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      return total + price * item.quantity * item.rentalDays;
    }, 0);
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const slim = JSON.parse(raw) as Array<Omit<CartItem, 'image'>>;
      // image source will be resolved by consumers via pickEquipmentImage() if needed
      const items = slim.map((s) => ({ ...s, image: undefined as any }));
      set({ items });
    } catch {
      // ignore
    }
  },
}));

// ============================================================
// Requirement + Matchmaking store
// ============================================================
export type Requirement = {
  id: string;
  address: string;
  city?: string;
  eventType: string;
  date: string;
  startTime?: string;
  endTime?: string;
  items: string[];
  budget?: string | null;
  notes?: string;
  createdAt: string;
};

export type VendorMatch = {
  id: string;
  name: string;
  businessName: string;
  rating: number;
  totalOrders: number;
  distanceKm: number;
  responseTimeMins: number;
  estimatedPrice: number;
  score: number;
  mocked?: boolean;
  tags?: string[];
};

interface RequirementState {
  current: Requirement | null;
  history: Requirement[];
  matches: VendorMatch[];
  submit: (input: Omit<Requirement, 'id' | 'createdAt'>) => Promise<Requirement>;
  fetchMatches: (requirementId: string) => Promise<VendorMatch[]>;
}

const MOCK_VENDORS: VendorMatch[] = [
  { id: 'v1', name: 'Rahul Kumar', businessName: 'SoundWave AV Rentals', rating: 4.8, totalOrders: 142, distanceKm: 3.2, responseTimeMins: 8, estimatedPrice: 28500, score: 0.92, tags: ['Top Rated', 'Fast Reply'] },
  { id: 'v2', name: 'Priya Shah', businessName: 'EventPro Solutions', rating: 4.6, totalOrders: 98, distanceKm: 5.7, responseTimeMins: 14, estimatedPrice: 34200, score: 0.86, tags: ['Verified'] },
  { id: 'v3', name: 'Amit Patel', businessName: 'LuxLight Productions', rating: 4.9, totalOrders: 211, distanceKm: 8.1, responseTimeMins: 6, estimatedPrice: 62000, score: 0.84, tags: ['Premium'] },
  { id: 'v4', name: 'Neha Gupta', businessName: 'MicDrop Rentals', rating: 4.4, totalOrders: 67, distanceKm: 2.4, responseTimeMins: 22, estimatedPrice: 18500, score: 0.78 },
  { id: 'v5', name: 'Sanjay Singh', businessName: 'BrightStage Events', rating: 4.2, totalOrders: 54, distanceKm: 12.5, responseTimeMins: 18, estimatedPrice: 22000, score: 0.68 },
];

export const useRequirementStore = create<RequirementState>((set, get) => ({
  current: null,
  history: [],
  matches: [],

  submit: async (input) => {
    let saved: Requirement;
    try {
      const res = await requirementAPI.create(input);
      saved = res.data?.requirement ?? res.data;
      if (!saved?.id && (res.data as any)?._id) saved = { ...(res.data as any), id: (res.data as any)._id };
    } catch {
      // Fallback to local mock so the UI still works without backend.
      saved = {
        ...input,
        id: `req_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
    }
    set((s) => ({ current: saved, history: [saved, ...s.history] }));
    return saved;
  },

  fetchMatches: async (requirementId) => {
    try {
      const res = await matchAPI.forRequirement(requirementId);
      const list: VendorMatch[] = res.data?.matches ?? [];
      if (list.length) {
        set({ matches: list });
        return list;
      }
    } catch {}
    // Offline fallback so buyer still sees matches.
    const mocked = MOCK_VENDORS.map((v) => ({ ...v, mocked: true }));
    set({ matches: mocked });
    return mocked;
  },
}));

// ============================================================
// Inquiry / Negotiation store
// ============================================================
export type QuoteMessage = {
  id: string;
  from: 'buyer' | 'vendor';
  kind: 'message' | 'quote' | 'counter' | 'accept';
  text?: string;
  price?: number;
  at: string;
};

export type Inquiry = {
  id: string;
  requirementId: string;
  vendorId: string;
  vendorName?: string;
  status: 'pending' | 'responded' | 'accepted' | 'rejected';
  quotedPrice?: number;
  counterHistory: QuoteMessage[];
};

interface InquiryState {
  list: Inquiry[];
  send: (vendorId: string, requirementId: string, vendorName?: string, initialPrice?: number) => Promise<Inquiry>;
  addMessage: (inquiryId: string, msg: Omit<QuoteMessage, 'id' | 'at'>) => void;
  accept: (inquiryId: string) => void;
}

export const useInquiryStore = create<InquiryState>((set) => ({
  list: [],

  send: async (vendorId, requirementId, vendorName, initialPrice) => {
    let created: Inquiry;
    try {
      const res = await inquiryAPI.create({ vendorId, requirementId, initialPrice });
      const d = res.data?.inquiry ?? res.data;
      created = { ...d, id: d.id ?? d._id, counterHistory: d.counterHistory ?? [] };
    } catch {
      created = {
        id: `inq_${Date.now()}`,
        requirementId,
        vendorId,
        vendorName,
        status: 'pending',
        quotedPrice: initialPrice,
        counterHistory: [],
      };
    }
    set((s) => ({ list: [created, ...s.list] }));
    return created;
  },

  addMessage: (inquiryId, msg) =>
    set((s) => ({
      list: s.list.map((i) =>
        i.id === inquiryId
          ? {
              ...i,
              counterHistory: [
                ...i.counterHistory,
                { ...msg, id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString() },
              ],
              status: msg.kind === 'accept' ? 'accepted' : 'responded',
              quotedPrice: msg.price ?? i.quotedPrice,
            }
          : i
      ),
    })),

  accept: (inquiryId) => {
    // Fire-and-forget backend call; UI already reflects acceptance locally
    inquiryAPI.accept(inquiryId).catch(() => {});
    set((s) => ({ list: s.list.map((i) => (i.id === inquiryId ? { ...i, status: 'accepted' } : i)) }));
  },
}));
