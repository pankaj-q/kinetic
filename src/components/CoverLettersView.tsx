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
  CheckCircle2
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
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal font-editorial text-[#0F172A] tracking-tight">
              Bespoke Cover Letter Studio
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Generates truthful, role-tailored cover letters that cite real verified accomplishments without hallucination.
          </p>
        </div>
      </div>

      {/* Generator Tool Bar */}
      <div className="p-6 rounded-2xl bg-white space-y-4 border border-[#E2E8F0] shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1.5 uppercase tracking-wider font-['Geist',sans-serif]">Target Job</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id} className="bg-white text-[#0F172A]">
                  {j.company} - {j.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0F172A] block mb-1.5 uppercase tracking-wider font-['Geist',sans-serif]">Tone & Voice</label>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value as any)}
              className="w-full py-2.5 px-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="professional" className="bg-white text-[#0F172A]">Professional & Direct</option>
              <option value="technical" className="bg-white text-[#0F172A]">Technical & Metrics-Driven</option>
              <option value="conversational" className="bg-white text-[#0F172A]">Warm & Conversational</option>
              <option value="enthusiastic" className="bg-white text-[#0F172A]">Enthusiastic & High Energy</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedJobId}
              className="huvo-glow-button w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg text-white text-xs font-bold transition-all disabled:opacity-50 font-['Geist',sans-serif]"
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
          <h3 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider font-['Geist_Mono',monospace]">
            Generated Library ({coverLetters.length})
          </h3>

          <div className="space-y-2.5 max-h-[65vh] overflow-y-auto pr-1">
            {coverLetters.length === 0 ? (
              <div className="p-8 text-center text-[#64748B] text-xs bg-white border border-[#E2E8F0] rounded-2xl">
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
                        ? 'bg-blue-50/70 border-[#2563EB] shadow-xs'
                        : 'bg-white hover:border-blue-300 border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#0F172A] font-['Geist',sans-serif]">{cl.company}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] capitalize font-['Geist_Mono',monospace]">
                        {cl.tone}
                      </span>
                    </div>
                    <p className="text-xs text-[#2563EB] font-semibold line-clamp-1">{cl.jobTitle}</p>
                    <p className="text-[11px] text-[#64748B] line-clamp-2 font-['Geist_Mono',monospace]">{cl.content.slice(0, 90)}...</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 2 Cols: Editor & Full Text Preview */}
        <div className="lg:col-span-2 space-y-3">
          {selectedLetter ? (
            <div className="p-6 rounded-2xl bg-white space-y-4 border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3.5">
                <div>
                  <h2 className="text-xl font-normal font-editorial text-[#0F172A] tracking-tight">{selectedLetter.jobTitle}</h2>
                  <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5 font-['Geist_Mono',monospace]">
                    <Building className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>{selectedLetter.company}</span>
                    <span>•</span>
                    <span className="text-[#2563EB] capitalize">{selectedLetter.tone} tone</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] text-xs font-semibold border border-[#E2E8F0] transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#2563EB]" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>
              </div>

              {selectedLetter.tailoredHighlights && selectedLetter.tailoredHighlights.length > 0 && (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1 text-xs">
                  <span className="font-bold text-[#2563EB] uppercase tracking-wider font-['Geist_Mono',monospace]">Custom Role Alignment Points:</span>
                  <ul className="list-disc list-inside text-[#334155] space-y-0.5 font-sans">
                    {selectedLetter.tailoredHighlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-['Geist_Mono',monospace]">Letter Body (Editable):</label>
                <textarea
                  rows={14}
                  value={selectedLetter.content}
                  onChange={(e) =>
                    setSelectedLetter({ ...selectedLetter, content: e.target.value })
                  }
                  className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4.5 focus:outline-none focus:border-[#2563EB] font-['Geist_Mono',monospace] leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#64748B] text-xs bg-white border border-[#E2E8F0] rounded-2xl">
              Select a cover letter on the left to preview and edit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

