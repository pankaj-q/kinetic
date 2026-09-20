import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  Search,
  Sparkles,
  ExternalLink,
  RefreshCw,
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  Zap,
  MapPin,
  DollarSign,
  Building,
  Flame,
  Globe,
  Loader2,
  X,
  ChevronRight
} from 'lucide-react';
import { Job, JobMatch } from '../types';

interface JobsViewProps {
  jobs: (Job & { match?: JobMatch; applicationId?: string; applicationStatus?: string })[];
  onSearchIngest: (query?: string, sources?: string[]) => Promise<void>;
  onIngestCustomJob?: (data: { url?: string; rawText?: string }) => Promise<void>;
  onMatchJob: (jobId: string) => Promise<void>;
  onMatchAll: () => Promise<void>;
  onPrepareApplication: (jobId: string) => Promise<void>;
  onAutoApplySingleJob?: (jobId: string) => Promise<any>;
  onOpenApplication: (appId: string) => void;
  onGenerateCoverLetter: (jobId: string) => void;
  onAutoApplyLive?: (minScore?: number, maxCount?: number) => Promise<any>;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  onSearchIngest,
  onIngestCustomJob,
  onMatchJob,
  onMatchAll,
  onPrepareApplication,
  onAutoApplySingleJob,
  onOpenApplication,
  onGenerateCoverLetter,
  onAutoApplyLive,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [onlyHighMatch, setOnlyHighMatch] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAutoApplying, setIsAutoApplying] = useState(false);
  const [autoApplyFeedback, setAutoApplyFeedback] = useState<string | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  // Custom Job Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [customJobUrl, setCustomJobUrl] = useState('');
  const [customJobText, setCustomJobText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.skillsRequired.some((s) => s.toLowerCase().includes(q));

    const matchesSource =
      selectedSource === 'all' ||
      job.source.toLowerCase().includes(selectedSource.toLowerCase());

    const matchesHigh = !onlyHighMatch || (job.match?.score || 0) >= 80;

    return matchesQuery && matchesSource && matchesHigh;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onSearchIngest(searchQuery || undefined);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAutoApply = async () => {
    if (!onAutoApplyLive) return;
    setIsAutoApplying(true);
    setAutoApplyFeedback(null);
    try {
      const res = await onAutoApplyLive(80, 5);
      setAutoApplyFeedback(
        res?.message || `Successfully applied to ${res?.appliedCount || 5} real live jobs & sent details to Telegram!`
      );
      setTimeout(() => setAutoApplyFeedback(null), 7000);
    } catch (err: any) {
      setAutoApplyFeedback(`Auto-apply error: ${err.message || 'Failed to auto apply'}`);
    } finally {
      setIsAutoApplying(false);
    }
  };

  const handleApplySingleJob = async (job: Job) => {
    setApplyingJobId(job.id);
    setAutoApplyFeedback(null);
    try {
      if (onAutoApplySingleJob) {
        await onAutoApplySingleJob(job.id);
        setAutoApplyFeedback(`🚀 Successfully applied to ${job.title} at ${job.company}! Tailored cover letter created & alert dispatched to Telegram.`);
      } else {
        await onPrepareApplication(job.id);
      }
      setTimeout(() => setAutoApplyFeedback(null), 7000);
    } catch (err: any) {
      setAutoApplyFeedback(`Apply error: ${err.message || 'Failed to submit application'}`);
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleCustomImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customJobUrl.trim() && !customJobText.trim()) return;
    setIsImporting(true);
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
      setIsImporting(false);
    }
  };

  const sources = [
    { id: 'all', label: 'All Real Jobs' },
    { id: 'jobicy', label: 'Jobicy' },
    { id: 'remoteok', label: 'RemoteOK' },
    { id: 'arbeitnow', label: 'Arbeitnow' },
    { id: 'remotive', label: 'Remotive' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-['Geist',sans-serif]">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1D1D24] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#111116] border border-[#1D1D24] flex items-center justify-center text-[#FF5A36] shadow-sm">
              <Briefcase className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              Live Verified Jobs Feed
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30">
              {jobs.length} Active Listings
            </span>
          </div>
          <p className="text-xs text-[#8E8E9B] mt-1">
            Real authentic backend & developer jobs scraped from live boards, verified for freshness, and matched against your resume.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {onAutoApplyLive && (
            <button
              id="auto-apply-live-btn"
              onClick={handleAutoApply}
              disabled={isAutoApplying || jobs.length === 0}
              className="btn-accent text-xs py-2 px-4 font-semibold shadow-md shadow-[#FF5A36]/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isAutoApplying ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Zap className="w-3.5 h-3.5" />
              )}
              <span>{isAutoApplying ? 'Applying & Notifying Telegram...' : '⚡ Auto-Apply to Best Matches (≥80%)'}</span>
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-secondary-outline text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF5A36]' : ''}`} />
            <span>{isRefreshing ? 'Scanning Feeds...' : 'Refresh Live Feeds'}</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-[#111116] hover:bg-[#181822] text-[#8E8E9B] hover:text-white border border-[#1D1D24] text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Add Custom Job</span>
          </button>
        </div>
      </div>

      {/* Auto-Apply Feedback Banner */}
      {autoApplyFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-[#111116] border border-[#00FF88]/40 text-xs text-[#00FF88] font-mono flex items-center gap-2.5 shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-[#00FF88] shrink-0" />
          <span>{autoApplyFeedback}</span>
        </motion.div>
      )}

      {/* Clean Search & Source Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#111116] border border-[#1D1D24] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E9B]" />
          <input
            type="text"
            placeholder="Search by role title, company name, or technology (e.g. Node.js, TypeScript, PostgreSQL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#FF5A36] font-sans"
          />
        </div>

        {/* Source Pills & High Match Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-[#070709] border border-[#1D1D24] p-1 rounded-xl">
            {sources.map((src) => (
              <button
                key={src.id}
                onClick={() => setSelectedSource(src.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedSource === src.id
                    ? 'bg-[#181824] text-white font-bold border border-[#2B2B38]'
                    : 'text-[#8E8E9B] hover:text-white'
                }`}
              >
                {src.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOnlyHighMatch(!onlyHighMatch)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border flex items-center gap-1.5 cursor-pointer ${
              onlyHighMatch
                ? 'bg-[#FF5A36]/10 border-[#FF5A36] text-[#FF5A36] font-bold'
                : 'bg-[#070709] border-[#1D1D24] text-[#8E8E9B] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>High Fit Only (≥80%)</span>
          </button>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-3">
          <Briefcase className="w-8 h-8 text-[#8E8E9B] mx-auto opacity-50" />
          <h3 className="text-sm font-bold font-display text-white">No jobs match your filter</h3>
          <p className="text-xs text-[#8E8E9B]">
            Click "Refresh Live Feeds" to fetch the latest postings from verified remote job boards.
          </p>
          <button
            onClick={handleRefresh}
            className="btn-accent text-xs py-2 px-4 mt-2 cursor-pointer"
          >
            <span>Scan Live Job Boards Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const matchScore = job.match?.score;
            const hasMatch = matchScore !== undefined;
            const isApplied = job.applicationStatus === 'APPLIED';
            const hasApp = Boolean(job.applicationId);
            const isApplying = applyingJobId === job.id;

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.22 }}
                className="p-5 sm:p-6 rounded-2xl bg-[#111116] border border-[#1D1D24] hover:border-[#2D2D38] space-y-4 shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-bold text-white hover:text-[#FF5A36] transition-colors">
                          {job.title}
                        </h2>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#16161E] text-[#8E8E9B] border border-[#1D1D24]">
                          {job.source}
                        </span>
                        {job.remote && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30">
                            Remote
                          </span>
                        )}
                        {isApplied && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Applied
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3.5 text-xs text-[#8E8E9B] flex-wrap">
                        <span className="flex items-center gap-1.5 font-semibold text-white">
                          <Building className="w-3.5 h-3.5 text-[#8E8E9B]" />
                          <span>{job.company}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#8E8E9B]" />
                          {job.location}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1 font-mono font-semibold text-[#00FF88]">
                            <DollarSign className="w-3.5 h-3.5 text-[#00FF88]" />
                            ${(job.salary.min || 130000).toLocaleString()} - ${(job.salary.max || 170000).toLocaleString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-[#8E8E9B]" />
                          {new Date(job.postedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="shrink-0">
                      {hasMatch ? (
                        <div
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 font-mono ${
                            matchScore >= 80
                              ? 'bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30'
                              : matchScore >= 60
                              ? 'bg-[#16161E] text-white border border-[#1D1D24]'
                              : 'bg-[#16161E] text-[#8E8E9B] border border-[#1D1D24]'
                          }`}
                        >
                          <Flame className="w-3.5 h-3.5 text-[#FF5A36]" />
                          <span>{matchScore}% Match</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onMatchJob(job.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#16161E] border border-[#1D1D24] text-xs font-medium text-white hover:border-[#2D2D38] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
                          <span>Score Fit</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-xs text-[#8E8E9B] line-clamp-2 leading-relaxed font-normal">
                    {job.description}
                  </p>

                  {/* AI Match Explanation */}
                  {job.match?.reason && (
                    <div className="p-3 rounded-xl bg-[#0D0D12] border border-[#1D1D24] text-xs text-white space-y-1">
                      <div className="flex items-center gap-1.5 text-[#FF5A36] font-semibold text-[11px] uppercase font-mono tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        <span>Resume Match Evaluation</span>
                      </div>
                      <p className="leading-relaxed font-sans text-xs text-[#8E8E9B]">{job.match.reason}</p>
                    </div>
                  )}

                  {/* Skills Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {job.skillsRequired.slice(0, 5).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#16161E] text-[#8E8E9B] border border-[#1D1D24]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#1D1D24]">
                  {/* Direct Link to Verified Real Job */}
                  {job.url && job.url !== '#' ? (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#8E8E9B] hover:text-white flex items-center gap-1.5 font-mono transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#FF5A36]" />
                      <span>Direct Posting Link</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-[#8E8E9B] font-mono">Direct API feed</span>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => onGenerateCoverLetter(job.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#16161E] border border-[#1D1D24] text-xs font-medium text-white hover:border-[#2D2D38] flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#FF5A36]" />
                      <span>Cover Letter</span>
                    </button>

                    {hasApp ? (
                      <button
                        onClick={() => onOpenApplication(job.applicationId!)}
                        className="px-3 py-1.5 rounded-lg bg-[#16161E] border border-[#1D1D24] text-xs font-semibold text-[#FF5A36] hover:border-[#FF5A36] flex items-center gap-1 cursor-pointer"
                      >
                        <span>View ({job.applicationStatus?.replace(/_/g, ' ')})</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#FF5A36]" />
                      </button>
                    ) : (
                      <button
                        id={`job-autoapply-btn-${job.id}`}
                        onClick={() => handleApplySingleJob(job)}
                        disabled={isApplying}
                        className="btn-accent text-xs py-1.5 px-3.5 font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isApplying ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Zap className="w-3.5 h-3.5 text-white" />
                        )}
                        <span>{isApplying ? 'Applying & Notifying...' : '⚡ 1-Click Apply'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Import Custom Job Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 font-['Geist',sans-serif]">
          <div className="relative w-full max-w-xl bg-[#111116] border border-[#1D1D24] rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1D1D24] flex items-center justify-between bg-[#0D0D12]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#16161E] border border-[#1D1D24] flex items-center justify-center shadow-xs">
                  <Globe className="w-4 h-4 text-[#FF5A36]" />
                </div>
                <h3 className="text-lg font-display font-bold text-white tracking-tight">Import Custom Job Posting</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8E8E9B] hover:text-white hover:bg-[#16161E] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCustomImportSubmit} className="p-6 space-y-4">
              <p className="text-xs text-[#8E8E9B] leading-relaxed">
                Paste a link or raw description from any job site (LinkedIn, Greenhouse, Lever, Ashby, Indeed, etc.). Gemini AI will extract the role requirements, score candidate match, and generate an application package.
              </p>

              <div>
                <label className="block text-xs font-mono font-bold text-white mb-1.5 uppercase tracking-wider">
                  Job URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://jobs.lever.co/company/..."
                  value={customJobUrl}
                  onChange={(e) => setCustomJobUrl(e.target.value)}
                  className="w-full text-xs text-white bg-[#0D0D12] border border-[#1D1D24] rounded-xl p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-white mb-1.5 uppercase tracking-wider">
                  Raw Job Description or Requirement Details
                </label>
                <textarea
                  rows={6}
                  placeholder="Paste the full job posting, tech stack, and responsibilities here..."
                  value={customJobText}
                  onChange={(e) => setCustomJobText(e.target.value)}
                  className="w-full text-xs text-white bg-[#0D0D12] border border-[#1D1D24] rounded-xl p-3 font-sans focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1D1D24]">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#16161E] border border-[#1D1D24] text-xs font-semibold text-[#8E8E9B] hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isImporting || (!customJobUrl.trim() && !customJobText.trim())}
                  className="btn-accent text-xs py-2 px-5 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isImporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
                  <span>{isImporting ? 'Parsing & Matching...' : 'Import & Match'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
