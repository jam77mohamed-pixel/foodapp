import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Image, DollarSign, Utensils, AlertCircle } from 'lucide-react';
import { CATEGORY_PRESETS, CATEGORY_SAMPLE_IMAGES } from '../../api/menuApi';

export const MenuItemFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null
}) => {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      category: 'Burgers',
      price: '',
      isVeg: false,
      isAvailable: true,
      restaurantName: '',
      image: '',
      description: '',
      prepTime: '15-20 mins',
      calories: '450 kcal',
      ingredients: ''
    }
  });

  const watchedImage = watch('image');
  const watchedCategory = watch('category');
  const [imagePreviewError, setImagePreviewError] = useState(false);

  // Sync form when initialData or modal open status changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          category: initialData.category || 'Burgers',
          price: initialData.price || '',
          isVeg: Boolean(initialData.isVeg),
          isAvailable: initialData.isAvailable !== undefined ? Boolean(initialData.isAvailable) : true,
          restaurantName: initialData.restaurantName || '',
          image: initialData.image || '',
          description: initialData.description || '',
          prepTime: initialData.prepTime || '15-20 mins',
          calories: initialData.calories || '450 kcal',
          ingredients: Array.isArray(initialData.ingredients)
            ? initialData.ingredients.join(', ')
            : (initialData.ingredients || '')
        });
      } else {
        reset({
          name: '',
          category: 'Burgers',
          price: '',
          isVeg: false,
          isAvailable: true,
          restaurantName: 'CraveFlow Kitchen',
          image: CATEGORY_SAMPLE_IMAGES.Burgers,
          description: '',
          prepTime: '15-20 mins',
          calories: '450 kcal',
          ingredients: 'Fresh herbs, Chef special sauce, Olive oil'
        });
      }
      setImagePreviewError(false);
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onFormSubmit = async (formData) => {
    await onSubmit(formData);
    onClose();
  };

  const categories = CATEGORY_PRESETS.filter(c => c !== 'All');

  const handlePickCategoryPresetImage = (cat) => {
    setValue('category', cat);
    if (!isEditing && CATEGORY_SAMPLE_IMAGES[cat]) {
      setValue('image', CATEGORY_SAMPLE_IMAGES[cat]);
      setImagePreviewError(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#18181b] border border-neutral-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(249,115,22,0.2)] text-white p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? 'Update dish specifications, availability, and pricing'
                  : 'Add an appetizing dish to your food catalog'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-neutral-900 border border-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-5">
          {/* Row 1: Dish Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Food Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Food Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                {...register('name', { required: 'Food name is required' })}
                placeholder="e.g. Artisanal Truffle Burger"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 outline-hidden"
              />
              {errors.name && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                {...register('category', { required: 'Please select a category' })}
                onChange={(e) => handlePickCategoryPresetImage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm text-white font-medium outline-hidden cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Price & Restaurant Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Price ($ USD) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400 pointer-events-none" />
                <input
                  type="number"
                  step="0.01"
                  min="0.5"
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0.5, message: 'Price must be at least $0.50' }
                  })}
                  placeholder="14.99"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 outline-hidden"
                />
              </div>
              {errors.price && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Restaurant Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Restaurant / Kitchen Name
              </label>
              <input
                type="text"
                {...register('restaurantName')}
                placeholder="e.g. Bella Napoli or The Rustic Bar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 outline-hidden"
              />
            </div>
          </div>

          {/* Row 3: Diet (Veg/Non-Veg) & Availability Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
            {/* Veg / Non-Veg Toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Dietary Preference
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="false"
                    {...register('isVeg')}
                    className="accent-orange-500"
                  />
                  <span className="text-xs text-rose-300 font-bold flex items-center gap-1">
                    🍗 Non-Veg
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="true"
                    {...register('isVeg')}
                    className="accent-emerald-500"
                  />
                  <span className="text-xs text-emerald-300 font-bold flex items-center gap-1">
                    🌱 Pure Veg
                  </span>
                </label>
              </div>
            </div>

            {/* Availability Status */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Availability Status
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isAvailable')}
                    className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-200 font-bold">
                    Mark as Available / In Stock
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Row 4: Image URL with live preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                Food Image URL
              </label>
              {CATEGORY_SAMPLE_IMAGES[watchedCategory] && (
                <button
                  type="button"
                  onClick={() => {
                    setValue('image', CATEGORY_SAMPLE_IMAGES[watchedCategory]);
                    setImagePreviewError(false);
                  }}
                  className="text-[11px] text-orange-400 hover:text-orange-300 font-bold cursor-pointer"
                >
                  Use sample {watchedCategory} photo
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400 pointer-events-none" />
                <input
                  type="url"
                  {...register('image')}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 outline-hidden"
                />
              </div>

              {/* Thumbnail Preview */}
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                {watchedImage && !imagePreviewError ? (
                  <img
                    src={watchedImage}
                    alt="Preview"
                    onError={() => setImagePreviewError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Utensils className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>
          </div>

          {/* Row 5: Prep Time & Calories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Preparation Time
              </label>
              <input
                type="text"
                {...register('prepTime')}
                placeholder="e.g. 15-20 mins"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Calories
              </label>
              <input
                type="text"
                {...register('calories')}
                placeholder="e.g. 480 kcal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 outline-hidden"
              />
            </div>
          </div>

          {/* Row 6: Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              {...register('description', { required: 'Description is required' })}
              placeholder="Describe the flavors, texture, specialty seasonings, and preparation style..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 outline-hidden resize-none"
            />
            {errors.description && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Row 7: Ingredients */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Ingredients (comma separated)
            </label>
            <input
              type="text"
              {...register('ingredients')}
              placeholder="e.g. Extra virgin olive oil, Fresh mozzarella, Basil leaves, Sea salt"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs sm:text-sm text-white placeholder-slate-400 outline-hidden"
            />
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl btn-gradient-glow text-white text-xs font-black shadow-[0_0_15px_rgba(249,115,22,0.35)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : isEditing
                ? 'Save Changes'
                : 'Add to Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
