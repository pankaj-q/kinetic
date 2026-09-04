import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Building,
  GraduationCap,
  Briefcase,
  DollarSign,
  MapPin,
  Shield,
  Loader2,
  Download,
  FileCode
} from 'lucide-react';
import { CandidateProfile, WorkExperience, Education } from '../types';

interface ProfileViewProps {
  profile: CandidateProfile;
  onSaveProfile: (profile: CandidateProfile) => Promise<void>;
  onParseResume: (resumeText: string) => Promise<void>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  onParseResume,
}) => {
  const [formData, setFormData] = useState<CandidateProfile>(profile);
  const [resumeText, setResumeText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'skills' | 'preferences'>('profile');
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newExcludedCompany, setNewExcludedCompany] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setResumeText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleExportProfile = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${formData.name.replace(/\s+/g, '_')}_profile.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleParse = async () => {
    if (!resumeText.trim()) return;
    setIsParsing(true);
    try {
      await onParseResume(resumeText);
    } finally {
      setIsParsing(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const addRole = () => {
    if (newRole.trim() && !formData.preferredRoles.includes(newRole.trim())) {
      setFormData((prev) => ({ ...prev, preferredRoles: [...prev.preferredRoles, newRole.trim()] }));
      setNewRole('');
    }
  };

  const removeRole = (role: string) => {
    setFormData((prev) => ({ ...prev, preferredRoles: prev.preferredRoles.filter((r) => r !== role) }));
  };

  const addExcludedCompany = () => {
    if (newExcludedCompany.trim() && !formData.excludedCompanies?.includes(newExcludedCompany.trim())) {
      setFormData((prev) => ({
        ...prev,
        excludedCompanies: [...(prev.excludedCompanies || []), newExcludedCompany.trim()],
      }));
      setNewExcludedCompany('');
    }
  };

  const removeExcludedCompany = (comp: string) => {
    setFormData((prev) => ({
      ...prev,
      excludedCompanies: (prev.excludedCompanies || []).filter((c) => c !== comp),
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-['Geist',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FCFBF8] border border-[#DDDAD2] flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4 text-[#FF5A36]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal font-editorial text-[#111111] tracking-tight">
              Candidate Profile & Resume Studio
            </h1>
          </div>
          <p className="text-xs text-[#6B6B67] mt-1">
            Your single source of truth for AI match evaluation and truthful cover letter synthesis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Saved successfully
            </span>
          )}
          <button
            onClick={handleExportProfile}
            className="btn-secondary-outline text-xs py-2 px-3.5"
          >
            <Download className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Export JSON</span>
          </button>
          <button
            id="save-profile-btn"
            onClick={handleSave}
            disabled={isSaving}
            className="btn-accent text-xs py-2 px-4.5 disabled:opacity-50 font-semibold"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </div>

      {/* Resume AI Parser Box */}
      <div className="p-6 rounded-xl editorial-card space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF5A36]" />
            <h2 className="text-base font-normal font-editorial text-[#111111] tracking-tight">AI Resume Extraction Engine</h2>
          </div>
          <span className="text-[11px] font-mono text-[#FF5A36] font-bold">Gemini 2.0 Structured Parser</span>
        </div>

        <p className="text-xs text-[#6B6B67] leading-relaxed font-sans">
          Upload a resume file (.txt, .md, .json) or paste your raw text below. The AI will automatically extract work history, metrics, tech stack skills,
          and career timelines into structured candidate fields.
        </p>

        <textarea
          rows={3}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste raw resume or LinkedIn text here (e.g. Alex Morgan, Senior Backend Engineer, 7+ years in Go/Node.js, AWS, Postgres, Kafka...)"
          className="w-full text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-xl p-3.5 focus:outline-none focus:border-[#111111] font-mono"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md,.json,.pdf,.doc,.docx"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary-outline text-xs py-1.5 px-3.5"
            >
              <Upload className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>Upload Resume File</span>
            </button>
            <span className="text-[11px] text-[#6B6B67] font-mono">Supports .txt, .md, .json</span>
          </div>

          <button
            onClick={handleParse}
            disabled={isParsing || !resumeText.trim()}
            className="btn-accent text-xs py-1.5 px-4.5 disabled:opacity-50 font-semibold"
          >
            {isParsing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
            <span>{isParsing ? 'Parsing Resume...' : 'Parse & Populate Profile'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DDDAD2] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'profile'
              ? 'bg-[#FCFBF8] text-[#111111] border border-[#DDDAD2] shadow-2xs'
              : 'text-[#6B6B67] hover:text-[#111111]'
          }`}
        >
          Personal & Bio
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'experience'
              ? 'bg-[#FCFBF8] text-[#111111] border border-[#DDDAD2] shadow-2xs'
              : 'text-[#6B6B67] hover:text-[#111111]'
          }`}
        >
          Work History ({formData.experience.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'skills'
              ? 'bg-[#FCFBF8] text-[#111111] border border-[#DDDAD2] shadow-2xs'
              : 'text-[#6B6B67] hover:text-[#111111]'
          }`}
        >
          Skills & Tech Stack ({formData.skills.length})
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'preferences'
              ? 'bg-[#FCFBF8] text-[#111111] border border-[#DDDAD2] shadow-2xs'
              : 'text-[#6B6B67] hover:text-[#111111]'
          }`}
        >
          Search Preferences & Salary
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6 sm:p-7 rounded-xl editorial-card space-y-6 shadow-xs">
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono font-bold text-[#111111] block mb-1.5 uppercase tracking-wider">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg p-3 focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#111111] block mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg p-3 font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#111111] block mb-1.5 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg p-3 font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#111111] block mb-1.5 uppercase tracking-wider">Current Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg p-3 focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#111111] block mb-1.5 uppercase tracking-wider">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={formData.linkedinUrl || ''}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg p-3 font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#111111] block mb-1.5 uppercase tracking-wider">GitHub / Portfolio URL</label>
                <input
                  type="text"
                  value={formData.githubUrl || formData.portfolioUrl || ''}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg p-3 font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#111111] block mb-1.5 uppercase tracking-wider">Professional Summary</label>
              <textarea
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg p-3.5 leading-relaxed focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-normal font-editorial text-[#111111] tracking-tight">Work History & Technical Milestones</h3>
              <span className="text-xs text-[#6B6B67] font-mono">{formData.yearsOfExperience} Years Experience</span>
            </div>

            <div className="space-y-4">
              {formData.experience.map((exp, idx) => (
                <div key={exp.id || idx} className="p-5 rounded-xl bg-[#FAF9F5] border border-[#DDDAD2] space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="font-bold text-sm text-[#111111]">{exp.role}</div>
                    <span className="text-xs text-[#FF5A36] font-mono font-semibold">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#6B6B67]" />
                    <span>{exp.company}</span>
                  </div>

                  <ul className="list-disc list-inside text-xs text-[#6B6B67] space-y-1 pt-1 font-sans">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="leading-relaxed">
                        {h}
                      </li>
                    ))}
                  </ul>

                  {exp.technologies && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-2.5 border-t border-[#DDDAD2]">
                      {exp.technologies.map((t, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-md text-[10px] bg-[#FCFBF8] text-[#6B6B67] border border-[#DDDAD2] font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-normal font-editorial text-[#111111] tracking-tight">Verified Technical Skills & Tools</h3>
              <span className="text-xs text-[#6B6B67]">Used for AI job scoring</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Rust, Kubernetes, GraphQL)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                className="text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#111111] flex-1 font-mono"
              />
              <button
                onClick={addSkill}
                className="btn-accent text-xs py-2.5 px-4 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-2">
              {formData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#FFE8E1] text-[#FF5A36] border border-[#FF5A36]/30 flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-[#FF5A36] hover:text-rose-700 transition-colors ml-1 font-bold text-sm"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            {/* Preferred Target Roles */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-[#111111] block uppercase tracking-wider">Target Job Titles</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add target role (e.g. Senior Backend Engineer)..."
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addRole()}
                  className="text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#111111] flex-1"
                />
                <button
                  onClick={addRole}
                  className="btn-accent text-xs py-2.5 px-4 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1">
                {formData.preferredRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#FAF9F5] text-[#111111] border border-[#DDDAD2] flex items-center gap-1.5"
                  >
                    <span>{role}</span>
                    <button
                      onClick={() => removeRole(role)}
                      className="text-[#6B6B67] hover:text-rose-600 ml-1 font-bold text-sm"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Salary Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#DDDAD2]">
              <div>
                <label className="text-xs font-mono font-bold text-[#111111] block mb-1.5 uppercase tracking-wider">Target Minimum Salary (USD)</label>
                <input
                  type="number"
                  value={formData.salaryPreference.min || 135000}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salaryPreference: { ...formData.salaryPreference, min: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg p-3 font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#111111] block mb-1.5 uppercase tracking-wider">Remote Preference</label>
                <select
                  value={formData.remotePreference}
                  onChange={(e) => setFormData({ ...formData, remotePreference: e.target.value as any })}
                  className="w-full text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg p-3 focus:outline-none focus:border-[#111111]"
                >
                  <option value="remote_only">Remote Only</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-Site</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* Excluded Companies */}
            <div className="space-y-2 pt-4 border-t border-[#DDDAD2]">
              <label className="text-xs font-mono font-bold text-[#111111] block uppercase tracking-wider">Excluded Companies (Blacklist)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add company to skip..."
                  value={newExcludedCompany}
                  onChange={(e) => setNewExcludedCompany(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addExcludedCompany()}
                  className="text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#111111] flex-1"
                />
                <button
                  onClick={addExcludedCompany}
                  className="btn-secondary-outline text-xs py-2.5 px-4 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Exclude</span>
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1">
                {(formData.excludedCompanies || []).map((comp, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#FFE8E1] text-[#FF5A36] border border-[#FF5A36]/30 flex items-center gap-1.5"
                  >
                    <span>{comp}</span>
                    <button
                      onClick={() => removeExcludedCompany(comp)}
                      className="text-[#FF5A36] hover:text-rose-700 ml-1 font-bold text-sm"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
