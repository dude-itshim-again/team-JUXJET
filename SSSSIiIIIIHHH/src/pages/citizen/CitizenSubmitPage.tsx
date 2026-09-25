import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Tag,
  MapPin,
  UploadCloud,
  HeartHandshake,
  Shield,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { CATEGORIES, STATES_AND_DISTRICTS } from '../../utils/constants';
import { LeafletMap } from '../../components/common/LeafletMap';
import { ChallengeCategory, Priority } from '../../types';
import { hackathonDemoLogin, submitComplaintToBackend } from '../../api';

type EvidenceDraft = {
  id: string;
  name: string;
  type: 'image' | 'document';
  url: string;
  caption: string;
};

export const CitizenSubmitPage: React.FC = () => {
  const navigate = useNavigate();
  const { addChallenge } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Problem
    title: '',
    description: '',
    whoIsAffected: '',
    durationExisted: '',
    frequency: 'Continuous' as 'Occasional' | 'Seasonal' | 'Continuous' | 'Worsening',
    existingAttempts: '',

    // Step 2: Category
    category: 'Water and Sanitation' as ChallengeCategory,
    subcategory: '',
    tags: 'Drinking Water, Rural Health',
    sdgGoals: [6, 3],

    // Step 3: Location
    state: 'Jharkhand',
    district: 'Ranchi',
    talukaBlock: 'Kanke',
    villageWard: 'Kalyanpur',
    locality: '',
    pincode: '834006',
    address: 'Near Panchayat Bhavan, Kanke, Ranchi, Jharkhand',
    lat: 23.4346,
    lng: 85.3206,

    // Step 4: Evidence
    evidenceFiles: [] as EvidenceDraft[],

    // Step 5: Impact
    affectedPeopleCount: 1500,
    affectedCommunity: 'School children and village elders',
    severity: 'Severe' as 'Low' | 'Moderate' | 'Severe' | 'Life-Threatening',
    urgency: 'High' as 'Low' | 'Medium' | 'High' | 'Immediate',
    suggestedSolution: 'Decentralized adsorption column filter or community solar ATM kiosk',

    // Step 6: Privacy
    visibility: 'Public' as 'Public' | 'Restricted',
    isAnonymous: false,
    contactPreference: 'Phone' as 'Phone' | 'Email' | 'Portal Only',
    shareConsent: true,
    accuracyDeclaration: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEvidenceFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const acceptedFiles: EvidenceDraft[] = [];
    const rejectedFiles: string[] = [];

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        rejectedFiles.push(`${file.name}: only images and PDF files are supported`);
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        rejectedFiles.push(`${file.name}: file must be 15 MB or smaller`);
        return;
      }

      acceptedFiles.push({
        id: `EVD-${Date.now()}-${acceptedFiles.length}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        url: URL.createObjectURL(file),
        caption: ''
      });
    });

    setFormData(prev => ({
      ...prev,
      evidenceFiles: [...prev.evidenceFiles, ...acceptedFiles]
    }));
    setErrors(prev => ({
      ...prev,
      evidence: rejectedFiles.length ? rejectedFiles.join(' | ') : ''
    }));
  };

  // Quick fill sample data button for effortless evaluator testing
  const handlePrefillSample = () => {
    setFormData({
      title: 'Contaminated Handpump Water & Chronic Joint Pain in Kalyanpur Hamlet',
      description: 'Over 80 families in Kalyanpur have experienced severe gastrointestinal infections and dental discoloration from rusted handpumps. Water comes out reddish brown for 10 minutes before turning cloudy.',
      whoIsAffected: '80 farming families, approximately 450 residents including 120 school children.',
      durationExisted: '6 months continuously; worsening during summer drawdown.',
      frequency: 'Continuous',
      existingAttempts: 'Reported to block water engineer, but no repair action taken.',
      category: 'Water and Sanitation',
      subcategory: 'Iron & Heavy Metal Removal',
      tags: 'Water Quality, Handpump, Health, Rural Sanitation',
      sdgGoals: [6, 3],
      state: 'Jharkhand',
      district: 'Ranchi',
      talukaBlock: 'Kanke',
      villageWard: 'Kalyanpur',
      locality: 'Ward 3, East Hamlet',
      pincode: '834006',
      address: 'Kalyanpur East Hamlet, Kanke Block, Ranchi, Jharkhand',
      lat: 23.4346,
      lng: 85.3206,
      evidenceFiles: [
        {
          id: 'EVD-DEMO-1',
          name: 'Kalyanpur_Handpump_Sediment.jpg',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
          caption: 'Iron precipitate on handpump mouth'
        }
      ],
      affectedPeopleCount: 450,
      affectedCommunity: 'Smallholder agricultural households in Kalyanpur',
      severity: 'Severe',
      urgency: 'High',
      suggestedSolution: 'Replace rusted riser pipes and attach low-cost terracotta-sand biofilter unit.',
      visibility: 'Public',
      isAnonymous: false,
      contactPreference: 'Phone',
      shareConsent: true,
      accuracyDeclaration: true
    });
  };

  const steps = [
    { num: 1, label: 'Problem Info', icon: FileText },
    { num: 2, label: 'Category & SDG', icon: Tag },
    { num: 3, label: 'Location & Map', icon: MapPin },
    { num: 4, label: 'Evidence', icon: UploadCloud },
    { num: 5, label: 'Impact', icon: HeartHandshake },
    { num: 6, label: 'Privacy & Consent', icon: Shield },
    { num: 7, label: 'Review & Submit', icon: CheckCircle2 }
  ];

  const validateCurrentStep = (): boolean => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.title.trim()) errs.title = 'Please enter a challenge title';
      if (!formData.description.trim()) errs.description = 'Please describe the challenge in detail';
      if (!formData.whoIsAffected.trim()) errs.whoIsAffected = 'Please specify who is affected';
    }
    if (currentStep === 6) {
      if (!formData.accuracyDeclaration) errs.accuracy = 'You must declare the accuracy of information.';
      if (!formData.shareConsent) errs.consent = 'Consent is required to share with research universities.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(7, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Step 2: Check if a token exists in localStorage. If not, await hackathonDemoLogin()
      let token = localStorage.getItem('token');
      if (!token) {
        console.log('ℹ️ [ComplaintSubmit] No JWT token found in localStorage. Executing hackathonDemoLogin()...');
        token = await hackathonDemoLogin();
      }

      // Prepare payload matching backend DTO keys
      const backendPayload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        categoryId: '123e4567-e89b-12d3-a456-426614174000', // Mock UUID for demo
        latitude: Number(formData.lat) || 23.4346,
        longitude: Number(formData.lng) || 85.3206,
        address: formData.address || `${formData.villageWard}, ${formData.talukaBlock}, ${formData.district}, ${formData.state} - ${formData.pincode}`,
        priority: (formData.severity === 'Severe' || formData.urgency === 'Immediate') ? 'HIGH' : 'MEDIUM'
      };

      console.log('🚀 [ComplaintSubmit] Submitting complaint to http://localhost:3000/complaints with payload:', backendPayload);

      // Send POST request with Bearer token
      const backendResponse = await submitComplaintToBackend(backendPayload);
      console.log('🎉 ✅ [ComplaintSubmit] Complaint successfully saved to database via backend!', backendResponse);

      // Keep local in-memory context updated as well
      const newChal = addChallenge({
        title: formData.title,
        description: formData.description,
        whoIsAffected: formData.whoIsAffected,
        durationExisted: formData.durationExisted,
        category: formData.category,
        subcategory: formData.subcategory,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        sdgGoals: formData.sdgGoals,
        priority: formData.severity === 'Severe' || formData.urgency === 'Immediate' ? 'High' : 'Medium',
        location: {
          state: formData.state,
          district: formData.district,
          talukaBlock: formData.talukaBlock,
          villageWard: formData.villageWard,
          locality: formData.locality,
          pincode: formData.pincode,
          address: formData.address,
          lat: formData.lat,
          lng: formData.lng
        },
        evidence: formData.evidenceFiles.map(f => ({
          id: f.id,
          type: f.type,
          url: f.url,
          name: f.name,
          caption: f.caption,
          uploadedAt: new Date().toISOString().split('T')[0]
        })),
        impact: {
          affectedPeopleCount: Number(formData.affectedPeopleCount) || 500,
          affectedCommunity: formData.affectedCommunity,
          severity: formData.severity,
          urgency: formData.urgency,
          frequency: formData.frequency,
          potentialBeneficiaries: `${formData.affectedPeopleCount * 2} citizens`,
          existingAttempts: formData.existingAttempts,
          suggestedSolution: formData.suggestedSolution
        },
        privacy: {
          visibility: formData.visibility,
          isAnonymous: formData.isAnonymous,
          contactPreference: formData.contactPreference,
          shareConsent: formData.shareConsent,
          accuracyDeclaration: formData.accuracyDeclaration
        }
      });

      const trackingNumber = backendResponse.complaintNumber || backendResponse.id || newChal.id;
      alert(`🎉 Complaint Submitted Successfully to Database!\nComplaint Number: ${trackingNumber}\nCheck browser console (F12) to see full backend response.`);
      navigate(`/citizen/challenges/${newChal.id}`);
    } catch (err: any) {
      console.error('❌ [ComplaintSubmit] Submission error caught:', err);
      // Step 3: Error Handling & Logging for 400 or 401
      if (err.response) {
        console.error('👉 Error response status:', err.response.status);
        console.error('👉 Error response data:', err.response.data);
      }
      setSubmitError(err.message || 'Failed to submit complaint to backend');
      alert(`Submission Error: ${err.message}\nPlease check browser console (F12) for detailed server response.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Title & Evaluator helper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
            Submit a Societal Challenge
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step problem submission wizard for citizens and local community representatives.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrefillSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-saffron-100 text-saffron-900 hover:bg-saffron-200 border border-saffron-300 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-saffron-700" />
          <span>Auto-fill Sample Problem</span>
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {steps.map(s => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                onClick={() => isCompleted && setCurrentStep(s.num)}
                className={`flex items-center gap-2 cursor-pointer shrink-0 ${
                  isCurrent
                    ? 'text-emerald-700 font-bold'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : s.num}
                </div>
                <span className="text-xs hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Problem Information */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 1: Problem Information</h3>
                <p className="text-xs text-slate-500">Provide a clear title and detailed overview of the ground reality.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Toxic Fluoride Groundwater Contamination in Kanke Hamlet"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
                {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what exactly is happening, symptoms observed, daily impact on families..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
                {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Who is Affected? *
                  </label>
                  <input
                    type="text"
                    value={formData.whoIsAffected}
                    onChange={e => setFormData({ ...formData, whoIsAffected: e.target.value })}
                    placeholder="e.g., 2,400 villagers, primary school children"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                  {errors.whoIsAffected && <p className="text-xs text-red-600 mt-1">{errors.whoIsAffected}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    How Long Has it Existed?
                  </label>
                  <input
                    type="text"
                    value={formData.durationExisted}
                    onChange={e => setFormData({ ...formData, durationExisted: e.target.value })}
                    placeholder="e.g., More than 2 years; acute in summers"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Existing Attempts to Solve it (if any)
                </label>
                <input
                  type="text"
                  value={formData.existingAttempts}
                  onChange={e => setFormData({ ...formData, existingAttempts: e.target.value })}
                  placeholder="e.g., Panchayat installed manual handpump but water has high fluoride"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Category & SDG Alignment */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 2: Category & SDG Alignment</h3>
                <p className="text-xs text-slate-500">Categorize the problem to aid automatic government department routing.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Primary Thematic Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                        formData.category === cat
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subcategory (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="e.g., Defluoridation, Solar Cold Storage"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Search Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Drinking Water, Health, Sanitation"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Geographic Location & Map Picker */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 3: Geographic Location</h3>
                <p className="text-xs text-slate-500">
                  Select your district and click anywhere on the map to set exact coordinates.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <select
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    {Object.keys(STATES_AND_DISTRICTS).map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                  <select
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    {(STATES_AND_DISTRICTS[formData.state] || ['Central']).map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Taluka / Block / Ward
                  </label>
                  <input
                    type="text"
                    value={formData.talukaBlock}
                    onChange={e => setFormData({ ...formData, talukaBlock: e.target.value })}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Village / Locality
                  </label>
                  <input
                    type="text"
                    value={formData.villageWard}
                    onChange={e => setFormData({ ...formData, villageWard: e.target.value })}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Street Address / Landmark
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Leaflet Picker Map */}
              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold">Interactive Map Coordinate Pin:</span>
                  <span className="font-mono text-emerald-700">
                    Lat: {formData.lat}, Lng: {formData.lng}
                  </span>
                </div>
                <LeafletMap
                  challenges={[]}
                  height="220px"
                  interactivePicker={true}
                  pickedLocation={{ lat: formData.lat, lng: formData.lng }}
                  onLocationPick={(lat, lng) => {
                    setFormData({ ...formData, lat, lng });
                  }}
                />
                <p className="text-[10px] text-slate-400">Click anywhere on the map to reposition the challenge location pin.</p>
              </div>
            </div>
          )}

          {/* STEP 4: Multimedia Evidence */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 4: Multimedia Evidence</h3>
                <p className="text-xs text-slate-500">
                  Attach photos of site conditions, water discoloration, or lab test reports.
                </p>
              </div>

              {/* Local evidence file picker */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors bg-slate-50">
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  Select ground evidence files from your device
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Supports JPG, PNG, PDF documents up to 15MB</p>
                <label
                  htmlFor="evidence-file-picker"
                  className="mt-3 px-3 py-1.5 rounded-md bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Choose Files
                </label>
                <input
                  id="evidence-file-picker"
                  type="file"
                  accept="image/*,.pdf,application/pdf"
                  multiple
                  onChange={e => {
                    handleEvidenceFiles(e.target.files);
                    e.currentTarget.value = '';
                  }}
                  className="sr-only"
                />
                {errors.evidence && <p className="text-[11px] text-red-600 mt-2">{errors.evidence}</p>}
              </div>

              {/* Attached Files List */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Attached Evidence ({formData.evidenceFiles.length})
                </label>
                {formData.evidenceFiles.map((f, i) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="p-1 rounded bg-slate-100 text-slate-600 font-mono text-[10px] uppercase">
                        {f.type}
                      </span>
                      <span className="font-medium text-slate-800 truncate max-w-xs">{f.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(f.url);
                        setFormData({
                          ...formData,
                          evidenceFiles: formData.evidenceFiles.filter((_, idx) => idx !== i)
                        });
                      }}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Impact Assessment */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 5: Impact Assessment</h3>
                <p className="text-xs text-slate-500">Estimate severity and human scale of this issue.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Affected People
                  </label>
                  <input
                    type="number"
                    value={formData.affectedPeopleCount}
                    onChange={e => setFormData({ ...formData, affectedPeopleCount: Number(e.target.value) })}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Severity</label>
                  <select
                    value={formData.severity}
                    onChange={e => setFormData({ ...formData, severity: e.target.value as any })}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Life-Threatening">Life-Threatening</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={e => setFormData({ ...formData, urgency: e.target.value as any })}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Immediate">Immediate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Affected Community / Ward
                </label>
                <input
                  type="text"
                  value={formData.affectedCommunity}
                  onChange={e => setFormData({ ...formData, affectedCommunity: e.target.value })}
                  placeholder="e.g., Primary School children, dairy farmers, tribal forest hamlets"
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Citizen Suggested Solution (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.suggestedSolution}
                  onChange={e => setFormData({ ...formData, suggestedSolution: e.target.value })}
                  placeholder="If you or the local community have an idea for solving this, describe it here..."
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Privacy & Consent */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 6: Privacy and Consent</h3>
                <p className="text-xs text-slate-500">Configure how your name and data appear publicly.</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={e => setFormData({ ...formData, isAnonymous: e.target.checked })}
                    className="mt-0.5 h-4 w-4 text-emerald-600 rounded border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Submit Anonymously on Public Portal
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Your phone and name will only be visible to authorized government verification officers.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.shareConsent}
                    onChange={e => setFormData({ ...formData, shareConsent: e.target.checked })}
                    className="mt-0.5 h-4 w-4 text-emerald-600 rounded border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Institutional Sharing Consent *
                    </span>
                    <span className="text-[11px] text-slate-500">
                      I consent to share this challenge record with accredited universities, IITs, and industry CSR partners for engineering solutions.
                    </span>
                  </div>
                </label>
                {errors.consent && <p className="text-xs text-red-600">{errors.consent}</p>}

                <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accuracyDeclaration}
                    onChange={e => setFormData({ ...formData, accuracyDeclaration: e.target.checked })}
                    className="mt-0.5 h-4 w-4 text-emerald-600 rounded border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Accuracy & Ground Truth Declaration *
                    </span>
                    <span className="text-[11px] text-slate-500">
                      I declare that this challenge describes a genuine community problem based on ground reality.
                    </span>
                  </div>
                </label>
                {errors.accuracy && <p className="text-xs text-red-600">{errors.accuracy}</p>}
              </div>
            </div>
          )}

          {/* STEP 7: Review & Submit */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 7: Review & Final Submission</h3>
                <p className="text-xs text-slate-500">
                  Carefully review your information before submitting to the Government Validation Queue.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-bold text-teal-800">{formData.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Title:</span>
                  <span className="font-bold text-slate-900 text-sm">{formData.title}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="font-medium text-slate-800">
                    {formData.villageWard}, {formData.talukaBlock}, {formData.district}, {formData.state} - {formData.pincode}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Affected Scale:</span>
                  <span className="font-bold text-slate-900">{formData.affectedPeopleCount.toLocaleString('en-IN')} citizens</span>
                  <span className="text-slate-600"> (Severity: {formData.severity}, Urgency: {formData.urgency})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Attached Evidence:</span>
                  <span className="font-medium text-slate-800">{formData.evidenceFiles.length} file(s) attached</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Ready to submit. A unique challenge ID will be assigned and AI triage simulation will run automatically.
                </span>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-xs font-bold bg-saffron-500 hover:bg-saffron-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 shadow-md transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving to Database...' : 'Confirm & Submit Challenge'}</span>
              </button>
            )}
          </div>
          {submitError && (
            <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              <strong>Database Submission Error:</strong> {submitError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
