import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, Sparkles, Utensils, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const LoginForm = () => {
  const { login, demoUsers } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [formError, setFormError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const defaultDemoUser = demoUsers[0] || {
    email: 'alex@fooddelivery.com',
    password: 'password123',
    name: 'Alex Morgan'
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: defaultDemoUser.email,
      password: defaultDemoUser.password,
      rememberMe: true
    }
  });

  const onSubmit = async (data) => {
    setFormError('');
    try {
      const loggedInUser = login(data.email, data.password);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Login failed. Please check your email and password.');
      toast.error(err.message || 'Incorrect email or password');
    }
  };

  const fillDemoCredentials = () => {
    setValue('email', defaultDemoUser.email);
    setValue('password', defaultDemoUser.password);
    toast.info(`Filled demo credentials for: ${defaultDemoUser.name}`);
  };

  return (
    <div className="w-full space-y-5">
      {/* 1-Click Quick Demo Details Helper */}
      <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-orange-400 font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Quick Demo Access:</span>
        </div>
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="px-3 py-1.5 rounded-xl font-bold text-[11px] bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)] hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>1-Click Fill Details</span>
        </button>
      </div>

      {/* Global Form Error Banner */}
      {formError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
          <p>{formError}</p>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
            <input
              type="email"
              placeholder="e.g. alex@fooddelivery.com"
              className={`w-full pl-11 pr-4 py-2.5 rounded-xl bg-neutral-900 border text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                errors.email
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30'
              }`}
              {...register('email', {
                required: 'Email is required',
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

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me & Terms */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded bg-neutral-900 border-neutral-700 text-orange-500 focus:ring-orange-500 cursor-pointer"
              {...register('rememberMe')}
            />
            <span>Remember my session</span>
          </label>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Secure Session
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl btn-gradient-glow text-white font-black text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-[0.98] cursor-pointer"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In to Portal'}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center pt-2 text-xs text-slate-400">
        <span>Don't have an account yet? </span>
        <Link
          to="/register"
          className="font-bold text-orange-400 hover:text-orange-300 underline decoration-orange-500/40 hover:decoration-orange-300 transition-colors"
        >
          Create New Account
        </Link>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};
