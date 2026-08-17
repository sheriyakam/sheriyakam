import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext(null);

const PROMO_CODES = {
    'KERALA20': { discount: 20, type: 'percent', minOrder: 300, desc: '20% off for Kerala launch' },
    'FIRSTFIX': { discount: 100, type: 'flat', minOrder: 400, desc: '₹100 off on your first service' },
    'VIP50': { discount: 50, type: 'percent', minOrder: 800, desc: '50% off for VIP members' },
    'SHERIYAKAM10': { discount: 10, type: 'percent', minOrder: 200, desc: '10% off festival discount' },
};

const DEFAULT_ADDRESSES = [
    {
        id: 'addr_1',
        title: 'Home',
        line1: 'Near Civil Station, Wayanad Road',
        taluk: 'Kozhikode',
        district: 'Kozhikode',
        pincode: '673020',
        landmark: 'Opposite Jaffer Khan Colony',
        isDefault: true,
    },
    {
        id: 'addr_2',
        title: 'Office / Shop',
        line1: 'SM Street Commercial Complex, 2nd Floor',
        taluk: 'Kozhikode',
        district: 'Kozhikode',
        pincode: '673001',
        landmark: 'Near Halwa Bazaar',
        isDefault: false,
    }
];

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [promoCode, setPromoCode] = useState('');
    const [promoData, setPromoData] = useState(null);
    const [addresses, setAddresses] = useState(DEFAULT_ADDRESSES);
    const [selectedAddressId, setSelectedAddressId] = useState('addr_1');
    const [bookingSchedule, setBookingSchedule] = useState({
        date: new Date().toISOString().split('T')[0],
        slot: 'Morning (9:00 AM - 1:00 PM)',
        isEmergency: false,
        emergencyMultiplier: 1.25,
    });

    // Load persisted cart on mount
    useEffect(() => {
        const loadCart = async () => {
            try {
                const saved = await AsyncStorage.getItem('sheriyakam_cart');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setItems(parsed.items || []);
                    if (parsed.promoCode && PROMO_CODES[parsed.promoCode]) {
                        setPromoCode(parsed.promoCode);
                        setPromoData(PROMO_CODES[parsed.promoCode]);
                    }
                }
            } catch (e) {
                console.warn('Failed to load cart state:', e);
            }
        };
        loadCart();
    }, []);

    // Save cart state on change
    useEffect(() => {
        const saveCart = async () => {
            try {
                await AsyncStorage.setItem('sheriyakam_cart', JSON.stringify({ items, promoCode }));
            } catch (e) {}
        };
        saveCart();
    }, [items, promoCode]);

    const addItem = useCallback((service, quantity = 1, addons = [], notes = '') => {
        setItems((prev) => {
            const existingIndex = prev.findIndex((i) => i.id === service.id);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity,
                    addons: addons.length > 0 ? addons : updated[existingIndex].addons,
                    notes: notes || updated[existingIndex].notes,
                };
                return updated;
            } else {
                return [...prev, {
                    id: service.id,
                    title: service.title,
                    price: service.price || 299,
                    originalPrice: service.originalPrice || Math.round((service.price || 299) * 1.3),
                    category: service.category || 'Electrical Repair',
                    image: service.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
                    duration: service.duration || '45-60 mins',
                    quantity,
                    addons,
                    notes,
                }];
            }
        });
    }, []);

    const removeItem = useCallback((serviceId) => {
        setItems((prev) => prev.filter((i) => i.id !== serviceId));
    }, []);

    const updateQuantity = useCallback((serviceId, quantity) => {
        if (quantity <= 0) {
            removeItem(serviceId);
            return;
        }
        setItems((prev) => prev.map((i) => i.id === serviceId ? { ...i, quantity } : i));
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
        setPromoCode('');
        setPromoData(null);
    }, []);

    const applyPromoCode = useCallback((code) => {
        const cleanCode = (code || '').trim().toUpperCase();
        if (!PROMO_CODES[cleanCode]) {
            return { success: false, message: 'Invalid promo code. Try KERALA20 or FIRSTFIX' };
        }

        const promo = PROMO_CODES[cleanCode];
        const currentSubtotal = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

        if (currentSubtotal < promo.minOrder) {
            return { 
                success: false, 
                message: `Minimum order amount of ₹${promo.minOrder} required for ${cleanCode}` 
            };
        }

        setPromoCode(cleanCode);
        setPromoData(promo);
        return { success: true, message: `Promo code ${cleanCode} applied successfully!` };
    }, [items]);

    const removePromoCode = useCallback(() => {
        setPromoCode('');
        setPromoData(null);
    }, []);

    // Price Calculations
    const subtotal = useMemo(() => {
        return items.reduce((acc, item) => {
            const itemBase = item.price * item.quantity;
            const addonTotal = (item.addons || []).reduce((sum, a) => sum + (a.price || 0), 0) * item.quantity;
            return acc + itemBase + addonTotal;
        }, 0);
    }, [items]);

    const promoDiscount = useMemo(() => {
        if (!promoData || subtotal === 0) return 0;
        if (promoData.type === 'percent') {
            return Math.round((subtotal * promoData.discount) / 100);
        }
        return Math.min(promoData.discount, subtotal);
    }, [subtotal, promoData]);

    const emergencyFee = useMemo(() => {
        if (!bookingSchedule.isEmergency) return 0;
        return Math.round(subtotal * (bookingSchedule.emergencyMultiplier - 1));
    }, [subtotal, bookingSchedule]);

    const gst = useMemo(() => {
        // 18% GST standard on electrical contractor service charges
        const taxable = Math.max(0, subtotal - promoDiscount + emergencyFee);
        return Math.round(taxable * 0.18);
    }, [subtotal, promoDiscount, emergencyFee]);

    const platformFee = useMemo(() => {
        return subtotal > 0 ? 29 : 0;
    }, [subtotal]);

    const total = useMemo(() => {
        if (subtotal === 0) return 0;
        return Math.max(0, subtotal - promoDiscount + emergencyFee + gst + platformFee);
    }, [subtotal, promoDiscount, emergencyFee, gst, platformFee]);

    const itemCount = useMemo(() => {
        return items.reduce((acc, curr) => acc + curr.quantity, 0);
    }, [items]);

    const selectedAddress = useMemo(() => {
        return addresses.find((a) => a.id === selectedAddressId) || addresses[0];
    }, [addresses, selectedAddressId]);

    const addAddress = useCallback((newAddr) => {
        const id = 'addr_' + Date.now();
        const created = { id, ...newAddr };
        setAddresses((prev) => [created, ...prev]);
        setSelectedAddressId(id);
        return id;
    }, []);

    return (
        <CartContext.Provider value={{
            items,
            itemCount,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            promoCode,
            promoData,
            promoDiscount,
            applyPromoCode,
            removePromoCode,
            availablePromoCodes: PROMO_CODES,
            subtotal,
            emergencyFee,
            gst,
            platformFee,
            total,
            addresses,
            selectedAddress,
            selectedAddressId,
            setSelectedAddressId,
            addAddress,
            bookingSchedule,
            setBookingSchedule,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
