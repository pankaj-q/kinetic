import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Building,
  MapPin,
  Flame,
  FileText,
  Sparkles,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Send,
  Loader2,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { PreparedApplication, ApplicationFormField } from '../types';
import confetti from 'canvas-confetti';

interface ApplicationApprovalModalProps {
  application: PreparedApplication | null;
  onClose: () => void;
  onApprove: (appId: string, editedFields: ApplicationFormField[], editedCoverLetter: string) => Promise<void>;
  onUpdateStatus?: (appId: string, status: any) => void;
}

export const ApplicationApprovalModal: React.FC<ApplicationApprovalModalProps> = ({
  application,
  onClose,
  onApprove,
  onUpdateStatus,
}) => {
  if (!application) return null;

  const [formFields, setFormFields] = useState<ApplicationFormField[]>(application.formFields || []);
  const [coverLetter, setCoverLetter] = useState<string>(application.coverLetterContent || '');
  const [activeTab, setActiveTab] = useState<'fields' | 'cover_letter' | 'history'>('fields');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(application.status === 'APPLIED');
  const [copiedFieldId, setCopiedFieldId] = useState<string | null>(null);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);
  const [copiedAllFields, setCopiedAllFields] = useState(false);

  const handleFieldChange = (fieldId: string, value: string | boolean) => {
    setFormFields((prev) =>
      prev.map((f) => (f.fieldId === fieldId ? { ...f, value } : f))
    );
  };

  const copyFieldText = (fieldId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFieldId(fieldId);
    setTimeout(() => setCopiedFieldId(null), 2000);
  };

  const copyAllFieldsText = () => {
    const summary = formFields
      .map((f) => `Q: ${f.label}\nA: ${String(f.value)}`)
      .join('\n\n');
    navigator.clipboard.writeText(summary);
    setCopiedAllFields(true);
    setTimeout(() => setCopiedAllFields(false), 2000);
  };

  const copyCoverLetterText = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2000);
  };

  const handleApproveSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onApprove(application.id, formFields, coverLetter);
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWaitingApproval = application.status === 'WAITING_FOR_APPROVAL';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-['Geist',sans-serif]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#111116] border border-[#1D1D24] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#1D1D24] flex items-center justify-between bg-[#14141B]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FF5A36]/10 border border-[#FF5A36]/30 flex items-center justify-center text-[#FF5A36]">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display text-white tracking-tight">{application.jobTitle}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                    application.matchScore >= 90
                      ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30'
                      : 'bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/30'
                  }`}
                >
                  <Flame className="w-3 h-3 inline mr-1" />
                  {application.matchScore}% Match
                </span>
              </div>
              <p className="text-xs text-[#8E8E9B] flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-white">{application.company}</span>
                <span>•</span>
                {application.applicationUrl && application.applicationUrl !== '#' && (
                  <a
                    href={application.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF5A36] hover:underline flex items-center gap-1 font-semibold font-mono"
                  >
                    <span>Open Company Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#181822] hover:bg-[#20202E] text-[#8E8E9B] hover:text-white transition-all border border-[#1D1D24]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Human-in-the-Loop Safety Banner */}
        {isWaitingApproval && (
          <div className="px-6 py-2.5 bg-[#FF5A36]/10 border-b border-[#FF5A36]/30 flex items-center justify-between text-xs text-[#FFA285]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF5A36]" />
              <span>
                <strong className="text-white">Human Approval Required:</strong> Review auto-filled application responses and cover letter
                before final submission.
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#FF5A36] font-bold uppercase tracking-widest">Human-In-The-Loop Active</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 border-b border-[#1D1D24] bg-[#0E0E13]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('fields')}
              className={`py-3.5 px-3 border-b-2 text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'fields'
                  ? 'border-[#FF5A36] text-[#FF5A36]'
                  : 'border-transparent text-[#8E8E9B] hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Form Fields & Custom Q&A ({formFields.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('cover_letter')}
              className={`py-3.5 px-3 border-b-2 text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'cover_letter'
                  ? 'border-[#FF5A36] text-[#FF5A36]'
                  : 'border-transparent text-[#8E8E9B] hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tailored Cover Letter</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3.5 px-3 border-b-2 text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'history'
                  ? 'border-[#FF5A36] text-[#FF5A36]'
                  : 'border-transparent text-[#8E8E9B] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Audit Trail ({application.historyLogs.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'fields' && (
              <button
                onClick={copyAllFieldsText}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#181822] hover:bg-[#222230] text-white text-[11px] font-semibold transition-all border border-[#1D1D24]"
              >
                {copiedAllFields ? <Check className="w-3 h-3 text-[#00FF88]" /> : <Copy className="w-3 h-3 text-[#FF5A36]" />}
                <span>{copiedAllFields ? 'Copied All' : 'Copy All Q&A'}</span>
              </button>
            )}
            {activeTab === 'cover_letter' && (
              <button
                onClick={copyCoverLetterText}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#181822] hover:bg-[#222230] text-white text-[11px] font-semibold transition-all border border-[#1D1D24]"
              >
                {copiedCoverLetter ? <Check className="w-3 h-3 text-[#00FF88]" /> : <Copy className="w-3 h-3 text-[#FF5A36]" />}
                <span>{copiedCoverLetter ? 'Copied Letter' : 'Copy Cover Letter'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#111116]">
          {activeTab === 'fields' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-display">Application Form Inputs</h3>
                <span className="text-xs text-[#8E8E9B]">All fields editable & quick-copyable</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields.map((field) => (
                  <div
                    key={field.fieldId}
                    className={`p-4 rounded-xl border transition-all ${
                      field.type === 'textarea' ? 'md:col-span-2' : ''
                    } ${
                      field.isAiGenerated
                        ? 'bg-[#14141E] border-[#FF5A36]/30'
                        : 'bg-[#0D0D12] border-[#1D1D24]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                        <span>{field.label}</span>
                        {field.required && <span className="text-[#FF5A36]">*</span>}
                      </label>
                      <div className="flex items-center gap-2">
                        {field.isAiGenerated && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/30 flex items-center gap-1 font-mono">
                            <Sparkles className="w-2.5 h-2.5" />
                            AI Synthesized
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => copyFieldText(field.fieldId, String(field.value))}
                          className="text-[#8E8E9B] hover:text-white p-1 rounded-md hover:bg-[#1C1C26] transition-all"
                          title="Copy value"
                        >
                          {copiedFieldId === field.fieldId ? (
                            <Check className="w-3 h-3 text-[#00FF88]" />
                          ) : (
                            <Copy className="w-3 h-3 text-[#8E8E9B]" />
                          )}
                        </button>
                      </div>
                    </div>

                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={String(field.value)}
                        onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
                        className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 focus:outline-none focus:border-[#FF5A36] font-sans leading-relaxed"
                      />
                    ) : (
                      <input
                        type="text"
                        value={String(field.value)}
                        onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
                        className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-2.5 focus:outline-none focus:border-[#FF5A36]"
                      />
                    )}

                    {field.reasoning && (
                      <p className="text-[11px] text-[#8E8E9B] mt-2 italic font-mono">
                        Evidence basis: {field.reasoning}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cover_letter' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Customized Cover Letter</h3>
                  <p className="text-xs text-[#8E8E9B]">
                    Truthfully tailored for {application.company}. Cites verified projects only.
                  </p>
                </div>
                <span className="text-xs text-[#00FF88] font-mono font-bold">
                  Attached: {application.resumeVersion}
                </span>
              </div>

              <textarea
                rows={12}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-xl p-4 focus:outline-none focus:border-[#FF5A36] font-mono leading-relaxed"
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white font-display">Application Lifecycle Events</h3>
              <div className="space-y-3">
                {application.historyLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] flex items-start gap-3 text-xs"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#FF5A36] mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{log.status}</span>
                        <span className="text-[10px] text-[#8E8E9B] font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[#CCCCCC] mt-1 font-sans">{log.note}</p>
                      <span className="text-[10px] text-[#8E8E9B] uppercase tracking-widest font-semibold mt-1 inline-block font-mono">
                        Source: {log.source}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1D1D24] flex items-center justify-between bg-[#14141B]">
          <div className="text-xs text-[#8E8E9B] font-mono">
            ID: <span className="font-semibold text-white">{application.id.slice(0, 8)}...</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#181822] hover:bg-[#20202E] text-white text-xs font-semibold border border-[#1D1D24] transition-all"
            >
              Close
            </button>

            {isWaitingApproval ? (
              <button
                id="modal-approve-and-submit-btn"
                onClick={handleApproveSubmit}
                disabled={isSubmitting}
                className="btn-accent flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                )}
                <span>{isSubmitting ? 'Submitting Application...' : 'Approve & Submit Application'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {onUpdateStatus && (
                  <select
                    value={application.status}
                    onChange={(e) => onUpdateStatus(application.id, e.target.value)}
                    className="text-xs bg-[#070709] border border-[#1D1D24] text-white rounded-lg px-3 py-1.5 focus:outline-none"
                  >
                    <option value="APPLIED">APPLIED</option>
                    <option value="SCREENING">SCREENING</option>
                    <option value="INTERVIEW">INTERVIEW</option>
                    <option value="OFFER">OFFER</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="WITHDRAWN">WITHDRAWN</option>
                  </select>
                )}
                <span className="text-xs text-[#00FF88] font-semibold flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  Submitted
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
