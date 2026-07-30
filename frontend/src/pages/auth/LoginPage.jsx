import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineMail, HiOutlineEye, HiOutlineEyeOff, HiOutlineShieldCheck, HiOutlineSparkles } from 'react-icons/hi';
import { HiLockClosed } from 'react-icons/hi2';

const LoginPage = () => {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (authLoading) return <div className="grid min-h-screen place-items-center bg-slate-950"><div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" /></div>;
  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setSubmitting(false); }
  };

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-slate-950 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:p-0">
      <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <section className="relative z-10 hidden flex-col justify-between border-r border-white/10 bg-white/[0.025] p-12 lg:flex xl:p-16">
        <div className="flex items-center gap-3 text-white"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg shadow-blue-950/50"><HiOutlineSparkles className="h-5 w-5" /></span><span className="text-xl font-bold tracking-tight">HEXACARB<span className="text-blue-400">.</span></span></div>
        <div className="max-w-md"><p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Admin workspace</p><h1 className="text-5xl font-bold leading-tight tracking-tight text-white">Everything you need, <span className="text-blue-400">in clear view.</span></h1><p className="mt-6 text-lg leading-8 text-slate-400">Manage your products, people, customers, and business activity from one secure place.</p></div>
        <div className="flex items-center gap-3 text-sm text-slate-400"><HiOutlineShieldCheck className="h-5 w-5 text-emerald-400" /> Protected administrative access</div>
      </section>

      <section className="relative z-10 flex items-center justify-center lg:bg-white/[0.02]">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-xl shadow-blue-950/50 lg:hidden"><HiOutlineSparkles className="h-6 w-6" /></div>
            <p className="mb-2 text-sm font-medium text-blue-300">Welcome back</p>
            <h2 className="text-3xl font-bold tracking-tight text-white">Sign in to your account</h2>
            <p className="mt-2 text-sm text-slate-400">Use your administrator credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7" noValidate>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">Email address</label>
                <div className="relative"><HiOutlineMail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input id="email" type="email" autoComplete="email" {...register('email', { required: 'Email is required' })} aria-invalid={!!errors.email} className={`w-full rounded-xl border bg-slate-950/40 py-3 pl-11 pr-3 text-sm text-white placeholder:text-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400/15 ${errors.email ? 'border-rose-400' : 'border-white/10 hover:border-white/20'}`} placeholder="admin@hexacarb.com" /></div>
                {errors.email && <p className="mt-1.5 text-xs text-rose-300">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                <div className="relative"><HiLockClosed className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" {...register('password', { required: 'Password is required' })} aria-invalid={!!errors.password} className={`w-full rounded-xl border bg-slate-950/40 py-3 pl-11 pr-12 text-sm text-white placeholder:text-slate-500 transition focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400/15 ${errors.password ? 'border-rose-400' : 'border-white/10 hover:border-white/20'}`} placeholder="Enter your password" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white">{showPassword ? <HiOutlineEyeOff className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}</button></div>
                {errors.password && <p className="mt-1.5 text-xs text-rose-300">{errors.password.message}</p>}
              </div>
              <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30 disabled:cursor-not-allowed disabled:opacity-60">{submitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}{submitting ? 'Signing in…' : 'Sign in securely'}</button>
            </div>
          </form>
          <p className="mt-6 text-center text-xs text-slate-500">Authorized personnel only · HEXACARB administration</p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
