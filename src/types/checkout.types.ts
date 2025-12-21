export type DeliveryMethod = 'pickup' | 'delivery';
export type StoreLocation = 'centro' | 'selva-alegre';
export type DeliveryTimeSlot = 'morning' | 'afternoon' | 'evening';

export interface CheckoutData {
  deliveryMethod: DeliveryMethod;
  // Pickup data
  storeLocation?: StoreLocation;
  // Delivery data
  customerName?: string;
  phoneNumber?: string;
  address?: string;
  reference?: string;
  timeSlot?: DeliveryTimeSlot;
}

export const STORE_LOCATIONS = {
  centro: {
    name: 'Centro de Arequipa',
    address: 'Calle Mercaderes 123, Cercado',
    icon: '🏛️'
  },
  'selva-alegre': {
    name: 'Selva Alegre',
    address: 'Av. Ejército 456, Selva Alegre',
    icon: '🌳'
  }
} as const;

export const TIME_SLOTS = {
  morning: {
    label: 'Mañana',
    time: '9:00 AM - 1:00 PM',
    icon: '🌅'
  },
  afternoon: {
    label: 'Tarde',
    time: '2:00 PM - 6:00 PM',
    icon: '☀️'
  },
  evening: {
    label: 'Noche',
    time: '6:00 PM - 9:00 PM',
    icon: '🌙'
  }
} as const;
