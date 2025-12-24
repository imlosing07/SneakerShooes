'use client';

import { useState, useEffect } from 'react';
import { Store, Truck, MapPin, Phone, User, Home, Clock, MessageCircle } from 'lucide-react';
import { CheckoutData, DeliveryMethod, StoreLocation, DeliveryTimeSlot, STORE_LOCATIONS, TIME_SLOTS } from '@/src/types/checkout.types';

interface CheckoutFormProps {
    onCheckoutDataChange: (data: CheckoutData, isValid: boolean) => void;
}

export default function CheckoutForm({ onCheckoutDataChange }: CheckoutFormProps) {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [storeLocation, setStoreLocation] = useState<StoreLocation>('centro');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [timeSlot, setTimeSlot] = useState<DeliveryTimeSlot>('afternoon');

  // Validación
  const isFormValid = (): boolean => {
    if (deliveryMethod === 'pickup') {
      return !!storeLocation;
    } else {
      return !!(
        customerName.trim() &&
                phoneNumber.trim() &&
                phoneNumber.length >= 9 &&
                address.trim() &&
                timeSlot
      );
    }
  };

  // Notificar cambios al padre
  useEffect(() => {
    const checkoutData: CheckoutData = {
      deliveryMethod,
      ...(deliveryMethod === 'pickup'
        ? { storeLocation }
        : { customerName, phoneNumber, address, reference, timeSlot }
      )
    };
    onCheckoutDataChange(checkoutData, isFormValid());
  }, [deliveryMethod, storeLocation, customerName, phoneNumber, address, reference, timeSlot]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5" />
                Información de Entrega
      </h2>

      {/* Selector de Método */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">¿Cómo deseas recibir tu pedido?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Pickup */}
          <button
            type="button"
            onClick={() => setDeliveryMethod('pickup')}
            className={`relative p-4 rounded-lg border-2 transition-all ${deliveryMethod === 'pickup'
              ? 'border-black bg-gray-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryMethod === 'pickup' ? 'border-black' : 'border-gray-300'
              }`}>
                {deliveryMethod === 'pickup' && (
                  <div className="w-3 h-3 rounded-full bg-black"></div>
                )}
              </div>
              <Store className="w-5 h-5 text-gray-700" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Recoger en tienda</p>
                <p className="text-xs text-gray-500">Sin costo de envío</p>
              </div>
            </div>
          </button>

          {/* Delivery */}
          <button
            type="button"
            onClick={() => setDeliveryMethod('delivery')}
            className={`relative p-4 rounded-lg border-2 transition-all ${deliveryMethod === 'delivery'
              ? 'border-black bg-gray-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryMethod === 'delivery' ? 'border-black' : 'border-gray-300'
              }`}>
                {deliveryMethod === 'delivery' && (
                  <div className="w-3 h-3 rounded-full bg-black"></div>
                )}
              </div>
              <Truck className="w-5 h-5 text-gray-700" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Delivery</p>
                <p className="text-xs text-gray-500">Entrega a domicilio</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Contenido Condicional */}
      <div className="space-y-4">
        {deliveryMethod === 'pickup' ? (
        // PICKUP - Selector de tienda
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
                            Selecciona la tienda
            </label>
            <div className="space-y-2">
              {(Object.keys(STORE_LOCATIONS) as StoreLocation[]).map((key) => {
                const store = STORE_LOCATIONS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStoreLocation(key)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${storeLocation === key
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${storeLocation === key ? 'border-black' : 'border-gray-300'
                      }`}>
                        {storeLocation === key && (
                          <div className="w-3 h-3 rounded-full bg-black"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                          <span className="text-lg">{store.icon}</span>
                          {store.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{store.address}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-800">
                <span className="font-medium">📅 Horario de atención:</span> Lun-Sáb 10:00 AM - 8:00 PM | Dom 11:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        ) : (
        // DELIVERY - Formulario completo
          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                                Nombre completo *
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                                Teléfono *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="959619405"
                maxLength={9}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                required
              />
              {phoneNumber && phoneNumber.length < 9 && (
                <p className="text-xs text-red-600 mt-1">Ingresa un número válido (9 dígitos)</p>
              )}
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Home className="w-4 h-4" />
                                Dirección completa *
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej: Av. Ejército 123, Cercado"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                required
              />
            </div>

            {/* Referencia */}
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                                Referencia (opcional)
              </label>
              <input
                type="text"
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ej: Edificio azul, casa verde, 2do piso"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
              />
            </div>

            {/* Horario */}
            <div>
              <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                                Horario preferido de entrega *
              </label>
              <select
                id="timeSlot"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value as DeliveryTimeSlot)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition bg-white"
                required
              >
                {(Object.keys(TIME_SLOTS) as DeliveryTimeSlot[]).map((key) => {
                  const slot = TIME_SLOTS[key];
                  return (
                    <option key={key} value={key}>
                      {slot.icon} {slot.label} ({slot.time})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-green-800">
                <span className="font-medium">🚚 Delivery:</span> Nos comunicaremos por WhatsApp para coordinar la entrega
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
