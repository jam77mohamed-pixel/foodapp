import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterForm = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'Restaurant Manager',
      password: '',
      confirmPassword: '',
      terms: true
    }
  });

  const onSubmit = async (data) => {
    setFormError('');
    try {
      const createdUser = registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password
      });

      toast.success(`Account created successfully! Welcome, ${createdUser.name}.`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please check your information.');
      toast.error(err.message || 'Registration error');
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Global Form Error Banner */}
      {formError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
          <p>{formError}</p>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
            <input
              type="text"
              placeholder="e.g. Jordan Miller"
              className={`w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-900 border text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                errors.name
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30'
              }`}
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
            <input
              type="email"
              placeholder="e.g. jordan@fooddelivery.com"
              className={`w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-900 border text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                errors.email
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30'
              }`}
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-all"
                {...register('phone')}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Portal Role
            </label>
            <select
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
              {...register('role')}
            >
              <option value="Restaurant Manager">Restaurant Manager</option>
              <option value="Food Delivery Partner">Delivery Partner</option>
              <option value="Foodie Customer">Customer</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              className={`w-full pl-11 pr-11 py-2.5 rounded-xl bg-neutral-900 border text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                errors.password
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30'
              }`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              className={`w-full pl-11 pr-11 py-2.5 rounded-xl bg-neutral-900 border text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                errors.confirmPassword
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30'
              }`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === getValues('password') || 'Passwords do not match'
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <div className="pt-1">
          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400 select-none">
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded bg-neutral-900 border-neutral-700 text-orange-500 focus:ring-orange-500 cursor-pointer"
              {...register('terms', {
                required: 'You must agree to continue'
              })}
            />
            <span>I agree to the Food Delivery Portal service terms and policies.</span>
          </label>
          {errors.terms && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{errors.terms.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl btn-gradient-glow text-white font-black text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{isSubmitting ? 'Creating Account...' : 'Complete Registration'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center pt-2 text-xs text-slate-400">
        <span>Already have an account? </span>
        <Link
          to="/login"
          className="font-bold text-orange-400 hover:text-orange-300 underline decoration-orange-500/40 hover:decoration-orange-300 transition-colors"
        >
          Sign In Here
        </Link>
      </div>
    </div>
  );
};
