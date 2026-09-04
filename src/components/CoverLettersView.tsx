import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Building,
  RotateCw,
  Edit3,
  Flame,
  Download,
  CheckCircle2,
  Send
} from 'lucide-react';
import { CoverLetter, Job } from '../types';

interface CoverLettersViewProps {
  coverLetters: CoverLetter[];
  jobs: Job[];
  onGenerate: (jobId: string, tone: any) => Promise<void>;
}

export const CoverLettersView: React.FC<CoverLettersViewProps> = ({
  coverLetters,
  jobs,
  onGenerate,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(
    coverLetters.length > 0 ? coverLetters[0] : null
  );
  const [selectedTone, setSelectedTone] = useState<'professional' | 'conversational' | 'technical' | 'enthusiastic'>('professional');
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (selectedLetter) {
      navigator.clipboard.writeText(selectedLetter.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerate = async () => {
    if (!selectedJobId) return;
    setIsGenerating(true);
    try {
      await onGenerate(selectedJobId, selectedTone);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-['Geist',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#111116] border border-[#1D1D24] flex items-center justify-center text-[#FF5A36] shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                Cover Letter Studio & Synthesis
              </h1>
              <p className="text-xs text-[#8E8E9B] mt-0.5">
                Generates truthful, role-tailored cover letters citing verified architecture accomplishments without hallucination.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Tool Bar */}
      <div className="p-6 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-mono font-bold text-[#8E8E9B] block mb-1.5 uppercase tracking-wider">Target Job</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#070709] border border-[#1D1D24] text-xs text-white focus:outline-none focus:border-[#FF5A36]"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id} className="bg-[#111116] text-white">
                  {j.company} - {j.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-[#8E8E9B] block mb-1.5 uppercase tracking-wider">Tone & Voice</label>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value as any)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#070709] border border-[#1D1D24] text-xs text-white focus:outline-none focus:border-[#FF5A36]"
            >
              <option value="professional" className="bg-[#111116] text-white">Professional & Direct</option>
              <option value="technical" className="bg-[#111116] text-white">Technical & Metrics-Driven</option>
              <option value="conversational" className="bg-[#111116] text-white">Warm & Conversational</option>
              <option value="enthusiastic" className="bg-[#111116] text-white">Enthusiastic & High Energy</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedJobId}
              className="btn-accent w-full text-xs py-2.5 px-4 font-semibold disabled:opacity-50"
            >
              {isGenerating ? (
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-white" />
              )}
              <span>{isGenerating ? 'Synthesizing Letter...' : 'Generate Bespoke Letter'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split: Saved Letters List + Full Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Letters List */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold text-[#8E8E9B] uppercase tracking-wider font-mono">
            Generated Library ({coverLetters.length})
          </h3>

          <div className="space-y-2.5 max-h-[65vh] overflow-y-auto pr-1">
            {coverLetters.length === 0 ? (
              <div className="p-8 text-center text-[#8E8E9B] text-xs bg-[#111116] border border-[#1D1D24] rounded-2xl">
                No cover letters generated yet. Choose a job above to create one.
              </div>
            ) : (
              coverLetters.map((cl) => {
                const isSelected = selectedLetter?.id === cl.id;
                return (
                  <div
                    key={cl.id}
                    onClick={() => setSelectedLetter(cl)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-[#14141E] border-[#FF5A36] shadow-sm'
                        : 'bg-[#111116] hover:border-[#353545] border-[#1D1D24]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{cl.company}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#14141B] text-[#8E8E9B] capitalize font-mono border border-[#1D1D24]">
                        {cl.tone}
                      </span>
                    </div>
                    <p className="text-xs text-[#FF5A36] font-semibold line-clamp-1">{cl.jobTitle}</p>
                    <p className="text-[11px] text-[#8E8E9B] line-clamp-2 font-mono">{cl.content.slice(0, 90)}...</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 2 Cols: Editor & Full Text Preview */}
        <div className="lg:col-span-2 space-y-3">
          {selectedLetter ? (
            <div className="p-6 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1D1D24] pb-3.5">
                <div>
                  <h2 className="text-xl font-bold font-display text-white tracking-tight">{selectedLetter.jobTitle}</h2>
                  <p className="text-xs text-[#8E8E9B] flex items-center gap-1.5 mt-0.5 font-mono">
                    <Building className="w-3.5 h-3.5 text-[#8E8E9B]" />
                    <span className="text-white">{selectedLetter.company}</span>
                    <span>•</span>
                    <span className="text-[#FF5A36] capitalize font-semibold">{selectedLetter.tone} tone</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="btn-secondary-outline text-xs py-1.5 px-3.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#00FF88]" /> : <Copy className="w-3.5 h-3.5 text-[#FF5A36]" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>
              </div>

              {selectedLetter.tailoredHighlights && selectedLetter.tailoredHighlights.length > 0 && (
                <div className="p-4 rounded-xl bg-[#14141B] border border-[#FF5A36]/30 space-y-1 text-xs">
                  <span className="font-bold text-[#FF5A36] uppercase tracking-wider font-mono">Verified Experience Alignment:</span>
                  <ul className="list-disc list-inside text-[#CCCCCC] space-y-0.5 font-sans">
                    {selectedLetter.tailoredHighlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#8E8E9B] uppercase tracking-wider">Letter Body (Editable):</label>
                <textarea
                  rows={14}
                  value={selectedLetter.content}
                  onChange={(e) =>
                    setSelectedLetter({ ...selectedLetter, content: e.target.value })
                  }
                  className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-xl p-4.5 focus:outline-none focus:border-[#FF5A36] font-mono leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#8E8E9B] text-xs bg-[#111116] border border-[#1D1D24] rounded-2xl">
              Select a cover letter on the left to preview and edit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
