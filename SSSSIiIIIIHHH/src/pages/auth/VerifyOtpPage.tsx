import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { ShieldCheck, ArrowRight, RefreshCw, Edit2, AlertCircle, Sparkles } from 'lucide-react';

export const VerifyOtpPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithPhone } = useApp();

  const statePhone = location.state?.phone || '+91 98765 43210';
  const role: Role = location.state?.role || 'citizen';
  const profile = location.state?.profile;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Masked phone
  const maskedPhone = statePhone.replace(/(\+91\s\d{2})\d{5}(\d{3})/, '$1*****$2');

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle single digit input
  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto advance focus
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  // Auto fill demo code
  const fillDemoOtp = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    setError('');
  };

  // Verify OTP
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifying(true);

    // Simulate server verification
    setTimeout(() => {
      // For demo, accept 123456 or any 6-digit except "000000" which tests error state
      if (enteredOtp === '000000') {
        setError('Invalid OTP entered. (Demo note: Test with 123456).');
        setIsVerifying(false);
        return;
      }

      loginWithPhone(statePhone, role, profile);

      // Redirect to appropriate dashboard
      if (role === 'citizen') navigate('/citizen/dashboard');
      else if (role === 'university') navigate('/university/dashboard');
      else if (role === 'government') navigate('/government/dashboard');
      else if (role === 'industry') navigate('/partners/dashboard');
      else navigate('/');
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-[#EEF2F6]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-navy-800">
          Verify Mobile Number
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Enter the 6-digit verification code sent to your registered mobile
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-2xl sm:px-8 border border-slate-200">
          {/* Role & Identity Context Card */}
          <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {role === 'university' && 'University R&D Portal'}
                  {role === 'government' && 'Government Administration Portal'}
                  {role === 'industry' && 'Industry & CSR Portal'}
                  {role === 'citizen' && 'Citizen Portal'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 truncate">
                {profile?.name || (role === 'university' ? 'Prof. Sunita Rao' : role === 'government' ? 'Rajesh Kumar, IAS' : role === 'industry' ? 'Ananya Sen' : 'Ramesh Verma')}
              </p>
              <p className="text-[11px] text-slate-600 truncate mt-0.5">
                {role === 'university' && (profile?.institutionName || 'BIT Mesra')}
                {role === 'government' && (profile?.departmentName || 'Drinking Water & Sanitation')}
                {role === 'industry' && (profile?.organizationName || 'Tata Community Initiatives Trust')}
                {role === 'citizen' && `${profile?.cityVillage || 'Kanke Village'}, ${profile?.district || 'Ranchi'}`}
              </p>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 border ${
              role === 'university'
                ? 'bg-purple-50 text-purple-800 border-purple-200'
                : role === 'government'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : role === 'industry'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {role}
            </span>
          </div>

          {/* Phone Display & Edit */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 mb-6">
            <div>
              <span className="text-[11px] text-slate-500 block">Verification mobile:</span>
              <span className="text-xs font-bold text-slate-800 tracking-wider font-mono">
                {maskedPhone}
              </span>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-xs text-navy-700 hover:underline font-medium"
            >
              <Edit2 className="w-3 h-3" />
              Edit
            </Link>
          </div>

          {/* Dev Simulation Notice Banner */}
          <div className="mb-6 p-3 bg-saffron-50 border border-saffron-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-saffron-600 mt-0.5 shrink-0" />
              <div className="flex-1 text-xs">
                <span className="font-bold text-saffron-900 block">Dev Simulation Mode:</span>
                <p className="text-saffron-800 mt-0.5">
                  Demo OTP code is <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-saffron-300">123456</span>
                </p>
                <button
                  type="button"
                  onClick={fillDemoOtp}
                  className="mt-2 inline-flex items-center text-[11px] font-semibold text-navy-800 hover:text-navy-950 underline"
                >
                  ⚡ Click here to auto-fill demo OTP
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            {/* 6 OTP Inputs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 text-center mb-3">
                Enter 6-Digit OTP Code
              </label>
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="\d{1}"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(idx, e.target.value)}
                    onKeyDown={e => handleKeyDown(idx, e)}
                    className="w-11 h-12 sm:w-12 sm:h-14 text-center font-mono text-xl font-bold rounded-lg border border-slate-300 focus:border-navy-600 focus:ring-2 focus:ring-navy-100 text-slate-900 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-semibold text-white bg-navy-700 hover:bg-navy-800 transition-colors disabled:opacity-50"
            >
              <span>{isVerifying ? 'Verifying OTP...' : 'Verify OTP & Enter Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {timer > 0 ? (
              <p>Resend code in <span className="font-semibold text-slate-700">{timer}s</span></p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTimer(30);
                  setOtp(['', '', '', '', '', '']);
                  alert('Demo OTP resent: 123456');
                }}
                className="inline-flex items-center gap-1 font-semibold text-navy-700 hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
