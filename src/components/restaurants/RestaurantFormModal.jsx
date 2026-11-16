import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Modal } from '../common/Modal';
import { useRestaurants } from '../../context/RestaurantContext';
import { PlusCircle, UtensilsCrossed, MapPin, Bike, Clock, Star, Image } from 'lucide-react';

export const RestaurantFormModal = ({ isOpen, onClose }) => {
  const { addRestaurant } = useRestaurants();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      cuisine: 'Italian',
      address: '',
      deliveryTime: '20-30 min',
      deliveryFee: '0',
      rating: '4.8',
      image: '',
      description: '',
      isOpen: true
    }
  });

  const onSubmit = async (data) => {
    try {
      const newRestaurant = addRestaurant({
        name: data.name,
        cuisine: data.cuisine,
        address: data.address,
        deliveryTime: data.deliveryTime,
        deliveryFee: parseFloat(data.deliveryFee) || 0,
        rating: parseFloat(data.rating) || 4.8,
        image: data.image || '',
        description: data.description || `Freshly onboarded ${data.cuisine} dining partner serving delicious local specialties.`,
        isOpen: Boolean(data.isOpen)
      });

      toast.success(`Restaurant "${newRestaurant.name}" added successfully!`);
      reset();
      onClose();
    } catch {
      toast.error('Unable to add restaurant. Please check the details entered.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Restaurant"
      subtitle="Onboard a new dining destination to the CraveFlow catalog"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Restaurant Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Restaurant Name *
          </label>
          <div className="relative">
            <UtensilsCrossed className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
            <input
              type="text"
              placeholder="e.g. Bella Roma Kitchen"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                errors.name
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-neutral-800 focus:border-orange-500'
              }`}
              {...register('name', {
                required: 'Restaurant name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters'
                }
              })}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Cuisine & Rating */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Cuisine Type *
            </label>
            <select
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              {...register('cuisine', { required: true })}
            >
              <option value="Italian">Italian</option>
              <option value="Asian">Asian / Japanese</option>
              <option value="American">American / Burgers</option>
              <option value="Mexican">Mexican / Tacos</option>
              <option value="Indian">Indian / Mughlai</option>
              <option value="Mediterranean">Mediterranean / Greek</option>
              <option value="Healthy">Healthy & Salads</option>
              <option value="Desserts">Bakery & Desserts</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Initial Rating (1 - 5)
            </label>
            <div className="relative">
              <Star className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 fill-amber-400" />
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                placeholder="4.8"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-orange-500"
                {...register('rating')}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Physical Address / Area *
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
            <input
              type="text"
              placeholder="e.g. 142 Ocean Avenue, Downtown District"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                errors.address
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-neutral-800 focus:border-orange-500'
              }`}
              {...register('address', {
                required: 'Address is required'
              })}
            />
          </div>
          {errors.address && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{errors.address.message}</p>
          )}
        </div>

        {/* Delivery Time & Delivery Fee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Delivery Time
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
              <input
                type="text"
                placeholder="20-30 min"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-orange-500"
                {...register('deliveryTime')}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Delivery Fee ($) (0 = Free)
            </label>
            <div className="relative">
              <Bike className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="number"
                step="0.5"
                min="0"
                placeholder="0 for Free Delivery"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-orange-500"
                {...register('deliveryFee')}
              />
            </div>
          </div>
        </div>

        {/* Image URL (Optional) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Image URL (Optional)
          </label>
          <div className="relative">
            <Image className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="url"
              placeholder="https://images.unsplash.com/... (auto-assigned if left blank)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              {...register('image')}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Restaurant Description
          </label>
          <textarea
            rows="2"
            placeholder="Specialty dishes, chef philosophy, culinary roots..."
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 resize-none"
            {...register('description')}
          />
        </div>

        {/* Open Status Checkbox */}
        <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded bg-neutral-900 border-neutral-700 text-orange-500 focus:ring-orange-500 cursor-pointer"
              {...register('isOpen')}
            />
            <span>Open for delivery orders immediately</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl btn-gradient-glow text-white text-xs font-black shadow-[0_0_15px_rgba(249,115,22,0.35)] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Adding...' : 'Save Restaurant'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
