import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Role } from '../../types';
import { Shield, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('citizen');
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    email: '',
    district: '',
    cityVillage: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (profile.name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    const age = Number(profile.age);
    if (!profile.age || age < 1 || age > 120) {
      setError('Please enter a valid age between 1 and 120.');
      return;
    }
    if (!profile.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!profile.district.trim() || !profile.cityVillage.trim()) {
      setError('Please enter your district and village or locality.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept terms and privacy policy.');
      return;
    }
    // Navigate to OTP verification with state
    navigate('/verify-otp', {
      state: {
        phone: `+91 ${phoneNumber}`,
        role: selectedRole,
        profile: {
          name: profile.name.trim(),
          age,
          email: profile.email.trim(),
          district: profile.district.trim(),
          cityVillage: profile.cityVillage.trim()
        }
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-[#EEF2F6]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center text-white shadow-md">
            <Shield className="w-7 h-7 text-saffron-400" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-navy-800">
          Register for JanSetu
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Create your profile and verify your mobile number to continue
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-2xl sm:px-8 border border-slate-200">
          <form className="space-y-5" onSubmit={handleSendOtp}>
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { role: 'citizen', label: 'Citizen', desc: 'Report & Track' },
                  { role: 'university', label: 'University', desc: 'R&D / Teams' },
                  { role: 'government', label: 'Government', desc: 'Validate / Route' },
                  { role: 'industry', label: 'Industry', desc: 'CSR / Scale' }
                ].map(item => (
                  <button
                    type="button"
                    key={item.role}
                    onClick={() => setSelectedRole(item.role as Role)}
                    className={`py-2 px-2.5 rounded-lg border text-center transition-all ${
                      selectedRole === item.role
                        ? 'border-navy-700 bg-navy-50 text-navy-900 ring-1 ring-navy-700 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-500">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Registration Details */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Your Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={e => {
                    setProfile({ ...profile, name: e.target.value });
                    setError('');
                  }}
                  placeholder="Full name"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600"
                />
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={profile.age}
                  onChange={e => {
                    setProfile({ ...profile, age: e.target.value });
                    setError('');
                  }}
                  placeholder="Age"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600"
                />
              </div>
              <input
                type="email"
                required
                value={profile.email}
                onChange={e => {
                  setProfile({ ...profile, email: e.target.value });
                  setError('');
                }}
                placeholder="Email address"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={profile.district}
                  onChange={e => {
                    setProfile({ ...profile, district: e.target.value });
                    setError('');
                  }}
                  placeholder="District"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600"
                />
                <input
                  type="text"
                  required
                  value={profile.cityVillage}
                  onChange={e => {
                    setProfile({ ...profile, cityVillage: e.target.value });
                    setError('');
                  }}
                  placeholder="Village / Locality"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600"
                />
              </div>
            </div>

            {/* Mobile Number Input */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number
              </label>
              <div className="flex rounded-lg shadow-sm border border-slate-300 focus-within:border-navy-600 focus-within:ring-1 focus-within:ring-navy-600">
                <span className="inline-flex items-center px-3 rounded-l-lg border-r border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                  🇮🇳 +91
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength={10}
                  required
                  value={phoneNumber}
                  onChange={e => {
                    setPhoneNumber(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  className="flex-1 min-w-0 block w-full px-3 py-2 text-sm rounded-none rounded-r-lg focus:outline-none text-slate-900"
                  placeholder="98765 43210"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 mt-0.5 text-navy-700 focus:ring-navy-600 border-slate-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-xs text-slate-600">
                I agree to the{' '}
                <span className="text-navy-700 underline cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-navy-700 underline cursor-pointer">Privacy Policy</span>.
              </label>
            </div>

            {error && <div className="text-xs text-red-600 font-medium">{error}</div>}

            {/* Send OTP Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-semibold text-white bg-navy-700 hover:bg-navy-800 transition-colors"
            >
              <span>Send OTP Verification Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
