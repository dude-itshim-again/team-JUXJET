import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Phone, MapPin, Mail, ShieldCheck, Save } from 'lucide-react';

export const CitizenProfilePage: React.FC = () => {
  const { currentUser } = useApp();
  const [name, setName] = useState(currentUser?.name || 'Ramesh Verma');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(currentUser?.email || 'ramesh.verma@example.com');
  const [village, setVillage] = useState(currentUser?.location.cityVillage || 'Kanke');
  const [district, setDistrict] = useState(currentUser?.location.district || 'Ranchi');
  const [state, setState] = useState(currentUser?.location.state || 'Jharkhand');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
          Citizen Profile & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your verified citizen credentials, primary residential address, and notification preferences.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
            {name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{name}</h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Citizen Account
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Account ID: {currentUser?.id}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (Phone OTP Linked)</label>
              <input
                type="text"
                disabled
                value={phone}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Village / Town</label>
              <input
                type="text"
                value={village}
                onChange={e => setVillage(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={e => setState(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            {saved && (
              <span className="text-xs font-semibold text-emerald-700">✓ Profile preferences updated</span>
            )}
            <button
              type="submit"
              className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 bg-navy-700 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
