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
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FCFBF8] border border-[#DDDAD2] flex items-center justify-center shadow-xs">
              <Briefcase className="w-4 h-4 text-[#FF5A36]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal font-editorial text-[#111111] tracking-tight">
              Job Stream & Match Engine
            </h1>
          </div>
          <p className="text-xs text-[#6B6B67] mt-1">
            Real-time multi-board aggregator (RemoteOK, Arbeitnow, Remotive, Greenhouse, Lever, Ashby, and Custom URL imports).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="btn-secondary-outline text-xs py-2 px-3.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Import Job / Paste Link</span>
          </button>

          <button
            id="match-all-jobs-btn"
            onClick={handleMatchAll}
            disabled={isMatchingAll}
            className="btn-secondary-outline text-xs py-2 px-3.5 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isMatchingAll ? 'animate-spin' : 'text-[#FF5A36]'}`} />
            <span>{isMatchingAll ? 'Evaluating Matches...' : 'Run Match Engine for All'}</span>
          </button>

          <button
            id="crawl-ingest-jobs-btn"
            onClick={handleSearchIngest}
            disabled={isIngesting}
            className="btn-accent text-xs py-2 px-4 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isIngesting ? 'animate-spin' : ''}`} />
            <span>{isIngesting ? 'Ingesting Jobs...' : 'Search & Ingest Live Jobs'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-xl editorial-card space-y-3.5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B67]" />
            <input
              type="text"
              placeholder="Search title, company, skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDDAD2] text-xs text-[#111111] placeholder-[#6B6B67] font-medium focus:outline-none focus:border-[#111111]"
            />
          </div>

          {/* Source filter */}
          <div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full py-2 px-3 rounded-lg bg-[#FAF9F5] border border-[#DDDAD2] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
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
              className="w-full py-2 px-3 rounded-lg bg-[#FAF9F5] border border-[#DDDAD2] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              <option value={0}>All Match Scores</option>
              <option value={85}>🔥 Strong Match (85%+)</option>
              <option value={75}>👍 Good Match (75%+)</option>
              <option value={60}>🔎 Possible Match (60%+)</option>
            </select>
          </div>

          {/* Remote Toggle */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDDAD2]">
            <span className="text-xs text-[#111111] font-semibold">Remote Only</span>
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#FF5A36] focus:ring-[#FF5A36] border-[#DDDAD2]"
            />
          </div>
        </div>
      </div>

      {/* Jobs Grid List */}
      <div className="space-y-3.5">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center editorial-card shadow-xs space-y-3">
            <Briefcase className="w-8 h-8 text-[#6B6B67] mx-auto" />
            <h3 className="text-sm font-bold text-[#111111]">No jobs match your filter criteria</h3>
            <p className="text-xs text-[#6B6B67]">
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
                transition={{ duration: 0.22 }}
                className="p-5 sm:p-6 editorial-card-interactive space-y-4 shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-base sm:text-lg font-bold text-[#111111] hover:text-[#FF5A36] transition-colors">
                        {job.title}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FAF9F5] text-[#6B6B67] border border-[#DDDAD2]">
                        {job.source}
                      </span>
                      {job.remote && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FAF9F5] text-[#111111] border border-[#DDDAD2]">
                          Remote
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#6B6B67] flex-wrap">
                      <span className="flex items-center gap-1.5 font-semibold text-[#111111]">
                        <Building className="w-3.5 h-3.5 text-[#6B6B67]" />
                        <span>{job.company}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#6B6B67]" />
                        {job.location}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1.5 font-mono font-semibold text-[#111111]">
                          <DollarSign className="w-3.5 h-3.5 text-[#6B6B67]" />
                          ${(job.salary.min || 130000).toLocaleString()} - ${(job.salary.max || 170000).toLocaleString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-[#6B6B67]" />
                        {new Date(job.postedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B6B67] line-clamp-2 leading-relaxed pt-1 font-normal">
                      {job.description}
                    </p>
                  </div>

                  {/* Right Score Pill */}
                  <div className="flex items-center gap-2 lg:self-start shrink-0">
                    {score !== undefined ? (
                      <div
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 font-mono ${
                          score >= 85
                            ? 'bg-[#FFE8E1] text-[#FF5A36] border border-[#FF5A36]/30'
                            : score >= 70
                            ? 'bg-[#FAF9F5] text-[#111111] border border-[#DDDAD2]'
                            : 'bg-[#FAF9F5] text-[#6B6B67] border border-[#DDDAD2]'
                        }`}
                      >
                        <Flame className="w-4 h-4 text-[#FF5A36]" />
                        <span>{score}% Match</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onMatchJob(job.id)}
                        className="btn-secondary-outline text-xs py-1.5 px-3"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
                        <span>Score Fit</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Match Explanation */}
                {match?.reason && (
                  <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#DDDAD2] text-xs text-[#111111] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#FF5A36] font-semibold text-[11px] uppercase font-mono tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gemini 2.0 Evaluation</span>
                    </div>
                    <p className="leading-relaxed font-sans text-xs text-[#6B6B67]">{match.reason}</p>
                  </div>
                )}

                {/* Skills & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#DDDAD2]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {job.skillsRequired.slice(0, 5).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-[#FAF9F5] text-[#6B6B67] border border-[#DDDAD2]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => onGenerateCoverLetter(job.id)}
                      className="btn-secondary-outline text-xs py-1.5 px-3"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#FF5A36]" />
                      <span>Custom Cover Letter</span>
                    </button>

                    {hasApp ? (
                      <button
                        onClick={() => onOpenApplication(job.applicationId!)}
                        className="btn-secondary-outline text-xs py-1.5 px-3.5 font-semibold text-[#FF5A36] border-[#DDDAD2] hover:border-[#FF5A36]"
                      >
                        <span>View Application ({job.applicationStatus?.replace(/_/g, ' ')})</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#FF5A36]" />
                      </button>
                    ) : (
                      <button
                        id={`job-prepare-btn-${job.id}`}
                        onClick={() => onPrepareApplication(job.id)}
                        className="btn-accent text-xs py-1.5 px-4 font-semibold"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/50 backdrop-blur-xs animate-in fade-in duration-200 font-['Geist',sans-serif]">
          <div className="relative w-full max-w-xl bg-[#FCFBF8] border border-[#DDDAD2] rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#DDDAD2] flex items-center justify-between bg-[#FAF9F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FCFBF8] border border-[#DDDAD2] flex items-center justify-center shadow-xs">
                  <Globe className="w-4 h-4 text-[#FF5A36]" />
                </div>
                <h3 className="text-xl font-normal font-editorial text-[#111111] tracking-tight">Import Custom Job Posting</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="btn-icon p-1.5 text-[#6B6B67] hover:text-[#111111]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportCustomSubmit} className="p-6 space-y-4">
              <p className="text-xs text-[#6B6B67] leading-relaxed">
                Paste a link or raw description from any job site (LinkedIn, Greenhouse, Lever, Ashby, Indeed, etc.). Gemini AI will extract the role requirements, score candidate match, and generate an application package.
              </p>

              <div>
                <label className="block text-xs font-mono font-bold text-[#111111] mb-1.5 uppercase tracking-wider">
                  Job URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://jobs.lever.co/stripe/..."
                  value={customJobUrl}
                  onChange={(e) => setCustomJobUrl(e.target.value)}
                  className="w-full text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg p-3 font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#111111] mb-1.5 uppercase tracking-wider">
                  Raw Job Description or Requirement Details
                </label>
                <textarea
                  rows={6}
                  placeholder="Paste the full job posting, tech stack, and responsibilities here..."
                  value={customJobText}
                  onChange={(e) => setCustomJobText(e.target.value)}
                  className="w-full text-xs text-[#111111] bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg p-3 font-sans focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DDDAD2]">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="btn-secondary-outline text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isImportingCustom || (!customJobUrl.trim() && !customJobText.trim())}
                  className="btn-accent text-xs py-2 px-5 disabled:opacity-50"
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
