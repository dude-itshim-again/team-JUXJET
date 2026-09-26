import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Role } from '../../types';
import {
  Shield,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Building2,
  Building,
  UserCheck
} from 'lucide-react';

const DEMO_PRESETS: Record<
  Role,
  {
    roleName: string;
    badge: string;
    desc: string;
    name: string;
    age?: string;
    email: string;
    district: string;
    cityVillage?: string;
    institutionName?: string;
    departmentName?: string;
    organizationName?: string;
    designation?: string;
    phone: string;
  }
> = {
  citizen: {
    roleName: 'Citizen Portal',
    badge: 'Report & Track',
    desc: 'Report civic issues in your locality, track resolution status, and verify ground milestones.',
    name: 'Ramesh Verma',
    age: '34',
    email: 'ramesh.verma@example.com',
    district: 'Ranchi',
    cityVillage: 'Kanke Village',
    phone: '9876543210'
  },
  university: {
    roleName: 'University & Research Portal',
    badge: 'R&D Labs & Teams',
    desc: 'Deploy multidisciplinary faculty and student teams to solve validated societal challenges.',
    name: 'Prof. Sunita Rao',
    email: 's.rao@bitmesra.ac.in',
    institutionName: 'Birla Institute of Technology (BIT) Mesra',
    departmentName: 'Dept. of Environmental Engineering & Water Tech',
    designation: 'Professor & Dean of R&D',
    district: 'Ranchi',
    cityVillage: 'Mesra Campus',
    phone: '9412345678'
  },
  government: {
    roleName: 'Government Administration Portal',
    badge: 'Validate & Route',
    desc: 'Review submitted societal problems, validate feasibility, route to universities and approve funding.',
    name: 'Rajesh Kumar, IAS',
    email: 'rajesh.kumar@nic.in',
    departmentName: 'Department of Drinking Water & Sanitation (Jal Jeevan Mission)',
    designation: 'Joint Secretary & Mission Director',
    district: 'Ranchi',
    cityVillage: 'State Secretariat',
    phone: '9811122334'
  },
  industry: {
    roleName: 'Industry & CSR Partner Portal',
    badge: 'CSR & Scale',
    desc: 'Co-fund high-impact student innovations, scale deployed pilots, and track ESG/CSR returns.',
    name: 'Ananya Sen',
    email: 'ananya.sen@tatatrusts.org',
    organizationName: 'Tata Community Initiatives Trust (CSR)',
    departmentName: 'Sustainable Water & Rural Development Vertical',
    designation: 'Head of Sustainable Initiatives & CSR',
    district: 'Jamshedpur',
    cityVillage: 'Jamshedpur Division',
    phone: '9988776655'
  }
};

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role>('citizen');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [profile, setProfile] = useState({
    name: 'Ramesh Verma',
    age: '34',
    email: 'ramesh.verma@example.com',
    district: 'Ranchi',
    cityVillage: 'Kanke Village',
    institutionName: '',
    departmentName: '',
    organizationName: '',
    designation: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setError('');
    const preset = DEMO_PRESETS[role];
    setPhoneNumber(preset.phone);
    setProfile({
      name: preset.name,
      age: preset.age || '',
      email: preset.email,
      district: preset.district,
      cityVillage: preset.cityVillage || '',
      institutionName: preset.institutionName || '',
      departmentName: preset.departmentName || '',
      organizationName: preset.organizationName || '',
      designation: preset.designation || ''
    });
  };

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
    if (!profile.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (selectedRole === 'citizen') {
      const age = Number(profile.age);
      if (!profile.age || age < 1 || age > 120) {
        setError('Please enter a valid age between 1 and 120.');
        return;
      }
      if (!profile.district.trim() || !profile.cityVillage.trim()) {
        setError('Please enter your district and village or locality.');
        return;
      }
    } else if (selectedRole === 'university') {
      if (!profile.institutionName.trim()) {
        setError('Please enter your university or institution name.');
        return;
      }
      if (!profile.designation.trim()) {
        setError('Please enter your academic designation or title.');
        return;
      }
      if (!profile.district.trim()) {
        setError('Please enter your institution district.');
        return;
      }
    } else if (selectedRole === 'government') {
      if (!profile.departmentName.trim()) {
        setError('Please enter your government department or ministry.');
        return;
      }
      if (!profile.designation.trim()) {
        setError('Please enter your official designation.');
        return;
      }
      if (!profile.district.trim()) {
        setError('Please enter your administrative district.');
        return;
      }
    } else if (selectedRole === 'industry') {
      if (!profile.organizationName.trim()) {
        setError('Please enter your company or foundation name.');
        return;
      }
      if (!profile.designation.trim()) {
        setError('Please enter your corporate designation.');
        return;
      }
      if (!profile.district.trim()) {
        setError('Please enter your operating district.');
        return;
      }
    }

    if (!agreeTerms) {
      setError('Please accept terms and privacy policy.');
      return;
    }

    // Navigate to OTP verification with role-adapted state
    navigate('/verify-otp', {
      state: {
        phone: `+91 ${phoneNumber}`,
        role: selectedRole,
        profile: {
          name: profile.name.trim(),
          age: selectedRole === 'citizen' ? Number(profile.age) : undefined,
          email: profile.email.trim(),
          district: profile.district.trim(),
          cityVillage: profile.cityVillage.trim(),
          institutionName: profile.institutionName.trim(),
          departmentName: profile.departmentName.trim(),
          organizationName: profile.organizationName.trim(),
          designation: profile.designation.trim()
        }
      }
    });
  };

  const currentPreset = DEMO_PRESETS[selectedRole];

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-[#EEF2F6]">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center text-white shadow-md">
            <Shield className="w-7 h-7 text-saffron-400" />
          </div>
        </div>
        <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-navy-800">
          Sign In to JanSetu
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Unified Innovation Bridge Connecting Citizens, Universities, Government & CSR
        </p>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-7 px-4 shadow-card sm:rounded-2xl sm:px-8 border border-slate-200">
          <form className="space-y-5" onSubmit={handleSendOtp}>
            {/* Role Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Select Your Role
                </label>
                <span className="text-[11px] font-medium text-slate-500">
                  Role determines dashboard context
                </span>
              </div>
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
                    onClick={() => handleRoleChange(item.role as Role)}
                    className={`py-2 px-2.5 rounded-lg border text-center transition-all ${
                      selectedRole === item.role
                        ? 'border-navy-700 bg-navy-50 text-navy-900 ring-2 ring-navy-700/20 font-bold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{item.desc}</div>
                  </button>
                ))}
              </div>

              {/* Role Context Pill */}
              <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-bold text-slate-800 mr-1.5">{currentPreset.roleName}:</span>
                  <span className="text-slate-600 text-[11px]">{currentPreset.desc}</span>
                </div>
              </div>
            </div>

            {/* Contextual Form Inputs Based on Role */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {selectedRole === 'citizen' && 'Your Details'}
                  {selectedRole === 'university' && 'Faculty & Academic Details'}
                  {selectedRole === 'government' && 'Officer & Ministry Details'}
                  {selectedRole === 'industry' && 'CSR & Corporate Details'}
                </label>
                <button
                  type="button"
                  onClick={() => handleRoleChange(selectedRole)}
                  className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Auto-fill Demo Profile</span>
                </button>
              </div>

              {/* Citizen Fields */}
              {selectedRole === 'citizen' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profile.name}
                        onChange={e => {
                          setProfile({ ...profile, name: e.target.value });
                          setError('');
                        }}
                        placeholder="Full name (e.g. Ramesh Verma)"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Age</label>
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
                        placeholder="Age (e.g. 34)"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={profile.email}
                      onChange={e => {
                        setProfile({ ...profile, email: e.target.value });
                        setError('');
                      }}
                      placeholder="Email address (e.g. ramesh.verma@example.com)"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">District</label>
                      <input
                        type="text"
                        required
                        value={profile.district}
                        onChange={e => {
                          setProfile({ ...profile, district: e.target.value });
                          setError('');
                        }}
                        placeholder="District (e.g. Ranchi)"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Village / Locality</label>
                      <input
                        type="text"
                        required
                        value={profile.cityVillage}
                        onChange={e => {
                          setProfile({ ...profile, cityVillage: e.target.value });
                          setError('');
                        }}
                        placeholder="Village / Locality (e.g. Kanke Village)"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* University Fields */}
              {selectedRole === 'university' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Faculty / Researcher Name</label>
                      <input
                        type="text"
                        required
                        value={profile.name}
                        onChange={e => {
                          setProfile({ ...profile, name: e.target.value });
                          setError('');
                        }}
                        placeholder="e.g. Prof. Sunita Rao"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Academic Designation</label>
                      <input
                        type="text"
                        required
                        value={profile.designation}
                        onChange={e => {
                          setProfile({ ...profile, designation: e.target.value });
                          setError('');
                        }}
                        placeholder="e.g. Dean R&D / Professor"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">University / Institute Name</label>
                    <input
                      type="text"
                      required
                      value={profile.institutionName}
                      onChange={e => {
                        setProfile({ ...profile, institutionName: e.target.value });
                        setError('');
                      }}
                      placeholder="e.g. Birla Institute of Technology (BIT) Mesra"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Department / Research Lab</label>
                    <input
                      type="text"
                      required
                      value={profile.departmentName}
                      onChange={e => {
                        setProfile({ ...profile, departmentName: e.target.value });
                        setError('');
                      }}
                      placeholder="e.g. Dept. of Environmental Engineering & Water Tech"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Institutional Email</label>
                      <input
                        type="email"
                        required
                        value={profile.email}
                        onChange={e => {
                          setProfile({ ...profile, email: e.target.value });
                          setError('');
                        }}
                        placeholder="e.g. s.rao@bitmesra.ac.in"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Campus District</label>
                      <input
                        type="text"
                        required
                        value={profile.district}
                        onChange={e => {
                          setProfile({ ...profile, district: e.target.value });
                          setError('');
                        }}
                        placeholder="e.g. Ranchi"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Government Fields */}
              {selectedRole === 'government' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Officer Name</label>
                      <input
                        type="text"
                        required
                        value={profile.name}
                        onChange={e => {
                          setProfile({ ...profile, name: e.target.value });
                          setError('');
                        }}
                        placeholder="e.g. Rajesh Kumar, IAS"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Official Designation</label>
                      <input
                        type="text"
                        required
                        value={profile.designation}
                        onChange={e => {
                          setProfile({ ...profile, designation: e.target.value });
                          setError('');
                        }}
                        placeholder="e.g. Joint Secretary & Mission Director"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Department / Ministry</label>
                    <input
                      type="text"
                      required
                      value={profile.departmentName}
                      onChange={e => {
                        setProfile({ ...profile, departmentName: e.target.value });
                        setError('');
                      }}
                      placeholder="e.g. Department of Drinking Water & Sanitation (Jal Jeevan Mission)"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Official Govt Email</label>
                      <input
                        type="email"
                        required
                        value={profile.email}
                        onChange={e => {
                          setProfile({ ...profile, email: e.target.value });
                          setError('');
                        }}
                        placeholder="e.g. rajesh.kumar@nic.in"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Administrative District</label>
                      <input
                        type="text"
                        required
                        value={profile.district}
                        onChange={e => {
                          setProfile({ ...profile, district: e.target.value });
                          setError('');
                        }}
                        placeholder="e.g. Ranchi"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Jurisdiction / Secretariat Office</label>
                    <input
                      type="text"
                      value={profile.cityVillage}
                      onChange={e => {
                        setProfile({ ...profile, cityVillage: e.target.value });
                        setError('');
                      }}
                      placeholder="e.g. State Secretariat, Project Bhawan, Dhurwa"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </>
              )}

              {/* Industry Fields */}
              {selectedRole === 'industry' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">CSR Representative Name</label>
                      <input
                        type="text"
                        required
                        value={profile.name}
                        onChange={e => {
                          setProfile({ ...profile, name: e.target.value });
                          setError('');
                        }}
                        placeholder="e.g. Ananya Sen"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Corporate Designation</label>
                      <input
                        type="text"
                        required
                        value={profile.designation}
                        onChange={e => {
                          setProfile({ ...profile, designation: e.target.value });
                          setError('');
                        }}
                        placeholder="e.g. Head of Sustainable Initiatives & CSR"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Enterprise / Foundation Name</label>
                    <input
                      type="text"
                      required
                      value={profile.organizationName}
                      onChange={e => {
                        setProfile({ ...profile, organizationName: e.target.value });
                        setError('');
                      }}
                      placeholder="e.g. Tata Community Initiatives Trust (CSR)"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">CSR Vertical / Focus Sector</label>
                    <input
                      type="text"
                      required
                      value={profile.departmentName}
                      onChange={e => {
                        setProfile({ ...profile, departmentName: e.target.value });
                        setError('');
                      }}
                      placeholder="e.g. Sustainable Water, Sanitation & ESG Initiatives"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Corporate CSR Email</label>
                      <input
                        type="email"
                        required
                        value={profile.email}
                        onChange={e => {
                          setProfile({ ...profile, email: e.target.value });
                          setError('');
                        }}
                        placeholder="e.g. ananya.sen@tatatrusts.org"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">Operating District</label>
                      <input
                        type="text"
                        required
                        value={profile.district}
                        onChange={e => {
                          setProfile({ ...profile, district: e.target.value });
                          setError('');
                        }}
                        placeholder="e.g. Jamshedpur"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Number Input */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">
                {selectedRole === 'citizen' && 'Mobile Number'}
                {selectedRole === 'university' && 'Official Academic Mobile / Contact'}
                {selectedRole === 'government' && 'Official Govt Mobile / Contact'}
                {selectedRole === 'industry' && 'Corporate Contact Number'}
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
                  className="flex-1 min-w-0 block w-full px-3 py-2 text-sm rounded-none rounded-r-lg focus:outline-none text-slate-900 font-mono"
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

            {error && <div className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">{error}</div>}

            {/* Send OTP Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-bold text-white bg-navy-700 hover:bg-navy-800 transition-colors"
            >
              <span>Continue to Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Links for Public Visitors */}
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/explore" className="text-teal-700 hover:text-teal-800 font-medium hover:underline inline-flex items-center gap-1">
              <span>← Browse Public Challenges</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/about" className="text-slate-500 hover:text-slate-700 hover:underline">
                About
              </Link>
              <span>•</span>
              <Link to="/impact" className="text-slate-500 hover:text-slate-700 hover:underline">
                Impact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
