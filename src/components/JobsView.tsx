import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  Search,
  Filter,
  Flame,
  Building,
  MapPin,
  DollarSign,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Plus,
  X,
  Globe,
  Loader2
} from 'lucide-react';
import { Job, JobMatch, PreparedApplication } from '../types';

interface JobsViewProps {
  jobs: (Job & { match?: JobMatch; applicationId?: string; applicationStatus?: string })[];
  onSearchIngest: (query?: string, sources?: string[]) => Promise<void>;
  onIngestCustomJob?: (data: { url?: string; rawText?: string }) => Promise<void>;
  onMatchJob: (jobId: string) => Promise<void>;
  onMatchAll: () => Promise<void>;
  onPrepareApplication: (jobId: string) => Promise<void>;
  onOpenApplication: (appId: string) => void;
  onGenerateCoverLetter: (jobId: string) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  onSearchIngest,
  onIngestCustomJob,
  onMatchJob,
  onMatchAll,
  onPrepareApplication,
  onOpenApplication,
  onGenerateCoverLetter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minScore, setMinScore] = useState<number>(0);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isMatchingAll, setIsMatchingAll] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [customJobUrl, setCustomJobUrl] = useState('');
  const [customJobText, setCustomJobText] = useState('');
  const [isImportingCustom, setIsImportingCustom] = useState(false);

  const filteredJobs = jobs.filter((job) => {
    const matchesQuery =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skillsRequired.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSource = selectedSource === 'all' || job.source.toLowerCase() === selectedSource.toLowerCase();
    const matchesRemote = !remoteOnly || job.remote;
    const matchesScore = (job.match?.score || 0) >= minScore;
    return matchesQuery && matchesSource && matchesRemote && matchesScore;
  });

  const handleSearchIngest = async () => {
    setIsIngesting(true);
    try {
      await onSearchIngest(searchQuery || undefined);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleMatchAll = async () => {
    setIsMatchingAll(true);
    try {
      await onMatchAll();
    } finally {
      setIsMatchingAll(false);
    }
  };

  const handleImportCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customJobUrl.trim() && !customJobText.trim()) return;
    setIsImportingCustom(true);
    try {
      if (onIngestCustomJob) {
        await onIngestCustomJob({
          url: customJobUrl.trim() || undefined,
          rawText: customJobText.trim() || undefined,
        });
      }
      setIsImportModalOpen(false);
      setCustomJobUrl('');
      setCustomJobText('');
    } finally {
      setIsImportingCustom(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-['Geist',sans-serif]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#2563EB]" />
            <h1 className="text-2xl sm:text-3xl font-normal font-editorial text-[#0F172A] tracking-tight">
              Job Search & Match Engine
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time multi-board aggregator (RemoteOK, Arbeitnow, Remotive, Greenhouse, Lever, Ashby, and Custom URL imports).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Import Job / Paste Link</span>
          </button>

          <button
            id="match-all-jobs-btn"
            onClick={handleMatchAll}
            disabled={isMatchingAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isMatchingAll ? 'animate-spin' : 'text-[#2563EB]'}`} />
            <span>{isMatchingAll ? 'Evaluating Matches...' : 'Run Match Engine for All'}</span>
          </button>

          <button
            id="crawl-ingest-jobs-btn"
            onClick={handleSearchIngest}
            disabled={isIngesting}
            className="huvo-glow-button flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 font-['Geist',sans-serif]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isIngesting ? 'animate-spin' : ''}`} />
            <span>{isIngesting ? 'Ingesting Jobs...' : 'Search & Ingest Live Jobs'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white space-y-3.5 border border-[#E2E8F0] shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search title, company, skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] font-medium focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Source filter */}
          <div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full py-2 px-3 rounded-lg huvo-input text-xs text-[#111827]"
            >
              <option value="all">All Job Sources</option>
              <option value="RemoteOK">RemoteOK (Live API)</option>
              <option value="Arbeitnow">Arbeitnow (Live API)</option>
              <option value="Remotive">Remotive (Live API)</option>
              <option value="Greenhouse">Greenhouse</option>
              <option value="Lever">Lever</option>
              <option value="Custom Import">Custom Imports</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>

          {/* Min Match Score */}
          <div>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full py-2 px-3 rounded-lg huvo-input text-xs text-[#111827]"
            >
              <option value={0}>All Match Scores</option>
              <option value={85}>🔥 Strong Match (85%+)</option>
              <option value={75}>👍 Good Match (75%+)</option>
              <option value={60}>🔎 Possible Match (60%+)</option>
            </select>
          </div>

          {/* Remote Toggle */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-lg huvo-input">
            <span className="text-xs text-[#374151] font-semibold">Remote Only</span>
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-[#E5E7EB]"
            />
          </div>
        </div>
      </div>

      {/* Jobs Grid List */}
      <div className="space-y-3.5">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
            <Briefcase className="w-8 h-8 text-[#9CA3AF] mx-auto" />
            <h3 className="text-sm font-bold text-[#111827] font-['Inter',sans-serif]">No jobs match your filter criteria</h3>
            <p className="text-xs text-[#6B7280]">
              Try adjusting your search keywords, lowering the match threshold, or clicking "Search & Ingest Live Jobs".
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const match = job.match;
            const score = match?.score;
            const hasApp = !!job.applicationId;

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25 }}
                className="p-5 sm:p-6 rounded-2xl huvo-card-interactive space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-base sm:text-lg font-bold text-[#111827] hover:text-[#2563EB] transition-colors font-['Inter',sans-serif]">
                        {job.title}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                        {job.source}
                      </span>
                      {job.remote && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-[#10B981] border border-emerald-200">
                          Remote
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#4B5563] flex-wrap">
                      <span className="flex items-center gap-1.5 font-medium text-[#111827]">
                        <Building className="w-3.5 h-3.5 text-[#6B7280]" />
                        <strong>{job.company}</strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                        {job.location}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1.5 font-semibold text-[#10B981]">
                          <DollarSign className="w-3.5 h-3.5" />
                          ${(job.salary.min || 130000).toLocaleString()} - ${(job.salary.max || 170000).toLocaleString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
                        {new Date(job.postedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed pt-1">
                      {job.description}
                    </p>
                  </div>

                  {/* Right Score Pill */}
                  <div className="flex items-center gap-2 lg:self-start">
                    {score !== undefined ? (
                      <div
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 font-mono ${
                          score >= 85
                            ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                            : score >= 70
                            ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
                            : 'bg-gray-50 text-[#6B7280] border border-[#E5E7EB]'
                        }`}
                      >
                        <Flame className="w-4 h-4 text-[#2563EB]" />
                        <span>{score}% Match</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onMatchJob(job.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>Score Fit</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Match Explanation */}
                {match?.reason && (
                  <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs text-[#374151] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#2563EB] font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gemini 3.7 Evaluation</span>
                    </div>
                    <p className="leading-relaxed font-sans">{match.reason}</p>
                  </div>
                )}

                {/* Skills & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {job.skillsRequired.slice(0, 5).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => onGenerateCoverLetter(job.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F3F4F6] text-[#374151] text-xs font-semibold border border-[#E5E7EB] transition-all shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Custom Cover Letter</span>
                    </button>

                    {hasApp ? (
                      <button
                        onClick={() => onOpenApplication(job.applicationId!)}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition-all font-['Geist',sans-serif]"
                      >
                        <span>View Application ({job.applicationStatus?.replace(/_/g, ' ')})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        id={`job-prepare-btn-${job.id}`}
                        onClick={() => onPrepareApplication(job.id)}
                        className="huvo-glow-button flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-bold transition-all font-['Geist',sans-serif]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        <span>Prepare Application</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Import Custom Job Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-['Geist',sans-serif]">
          <div className="relative w-full max-w-xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4.5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-200">
                  <Globe className="w-4 h-4 text-[#2563EB]" />
                </div>
                <h3 className="text-xl font-normal font-editorial text-[#0F172A] tracking-tight">Import Custom Job Posting</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportCustomSubmit} className="p-6 space-y-4">
              <p className="text-xs text-[#475569] leading-relaxed">
                Paste a link or raw description from any job site (LinkedIn, Greenhouse, Lever, Ashby, Indeed, etc.). The Gemini AI will extract the role requirements, score candidate match, and generate an application package.
              </p>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5 uppercase tracking-wider font-['Geist',sans-serif]">
                  Job URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://jobs.lever.co/stripe/..."
                  value={customJobUrl}
                  onChange={(e) => setCustomJobUrl(e.target.value)}
                  className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 font-['Geist_Mono',monospace]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5 uppercase tracking-wider font-['Geist',sans-serif]">
                  Raw Job Description or Requirement Details
                </label>
                <textarea
                  rows={6}
                  placeholder="Paste the full job posting, tech stack, and responsibilities here..."
                  value={customJobText}
                  onChange={(e) => setCustomJobText(e.target.value)}
                  className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] text-xs font-semibold border border-[#E2E8F0] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isImportingCustom || (!customJobUrl.trim() && !customJobText.trim())}
                  className="huvo-glow-button flex items-center gap-1.5 px-5 py-2 rounded-lg text-white text-xs font-bold transition-all disabled:opacity-50 font-['Geist',sans-serif]"
                >
                  {isImportingCustom ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
                  <span>{isImportingCustom ? 'Parsing & Matching...' : 'Import & Match'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
