import React, { useState } from 'react';
import {
  Mail,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Building,
  ChevronRight,
  RefreshCw,
  FileText,
  Plus
} from 'lucide-react';
import { EmailEvent } from '../types';

interface EmailMonitorViewProps {
  emails: EmailEvent[];
  onSimulateEmail: (type: 'interview' | 'rejection' | 'offer' | 'screening', company?: string) => Promise<void>;
  onProcessRawEmail: (raw: { sender: string; recipient: string; subject: string; body: string }) => Promise<void>;
  onOpenApplication?: (appId: string) => void;
}

export const EmailMonitorView: React.FC<EmailMonitorViewProps> = ({
  emails,
  onSimulateEmail,
  onProcessRawEmail,
  onOpenApplication,
}) => {
  const [selectedEmail, setSelectedEmail] = useState<EmailEvent | null>(
    emails.length > 0 ? emails[0] : null
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [showRawTester, setShowRawTester] = useState(false);
  const [rawSender, setRawSender] = useState('recruiting@stripe.com');
  const [rawSubject, setRawSubject] = useState('Next steps for Senior Backend Engineer role');
  const [rawBody, setRawBody] = useState(
    'Hi Alex,\n\nWe were really impressed with your application and would like to schedule a 45-minute technical screen with our backend team.\n\nPlease pick a slot here: https://calendly.com/stripe-eng/alex\n\nBest,\nStripe Recruiting'
  );

  const handleSimulate = async (type: 'interview' | 'rejection' | 'offer' | 'screening') => {
    setIsSimulating(true);
    try {
      await onSimulateEmail(type);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleProcessRaw = async () => {
    setIsSimulating(true);
    try {
      await onProcessRawEmail({
        sender: rawSender,
        recipient: 'alex.morgan.dev@example.com',
        subject: rawSubject,
        body: rawBody,
      });
      setShowRawTester(false);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-['Geist',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Mail className="w-4 h-4 text-[#2563EB]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal font-editorial text-[#0F172A] tracking-tight">
              Recruiter Email Monitor & Classifier
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Monitors incoming recruiter emails with Gemini classification and automatically syncs application stages.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowRawTester(!showRawTester)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] shadow-xs transition-all font-['Geist',sans-serif]"
          >
            <Plus className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Test Custom Inbound Email</span>
          </button>
        </div>
      </div>

      {/* Simulator Quick Action Banner */}
      <div className="p-5 rounded-2xl bg-white space-y-3 border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5 uppercase tracking-wider font-['Geist',sans-serif]">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            Simulate Recruiter Inbound Email Event
          </span>
          <span className="text-[11px] text-[#64748B] font-['Geist_Mono',monospace]">Triggers AI classification & pipeline sync</span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap pt-1">
          <button
            id="simulate-interview-email-btn"
            onClick={() => handleSimulate('interview')}
            disabled={isSimulating}
            className="px-3.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 font-['Geist',sans-serif]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Interview Invitation</span>
          </button>

          <button
            id="simulate-offer-email-btn"
            onClick={() => handleSimulate('offer')}
            disabled={isSimulating}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#10B981] border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 font-['Geist',sans-serif]"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Simulate Job Offer</span>
          </button>

          <button
            id="simulate-rejection-email-btn"
            onClick={() => handleSimulate('rejection')}
            disabled={isSimulating}
            className="px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 font-['Geist',sans-serif]"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Simulate Rejection Notice</span>
          </button>
        </div>
      </div>

      {/* Raw Email Test Modal / Drawer */}
      {showRawTester && (
        <div className="p-6 rounded-2xl bg-white border border-[#2563EB] space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F172A] tracking-tight font-['Geist',sans-serif]">Parse Custom Inbound Email</h3>
            <button
              onClick={() => setShowRawTester(false)}
              className="text-xs text-[#64748B] hover:text-[#0F172A]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#64748B] block mb-1 uppercase tracking-wider font-['Geist_Mono',monospace]">Sender Email</label>
              <input
                type="text"
                value={rawSender}
                onChange={(e) => setRawSender(e.target.value)}
                className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 font-['Geist_Mono',monospace]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#64748B] block mb-1 uppercase tracking-wider font-['Geist_Mono',monospace]">Subject</label>
              <input
                type="text"
                value={rawSubject}
                onChange={(e) => setRawSubject(e.target.value)}
                className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 font-['Geist',sans-serif]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#64748B] block mb-1 uppercase tracking-wider font-['Geist_Mono',monospace]">Email Body Content</label>
            <textarea
              rows={4}
              value={rawBody}
              onChange={(e) => setRawBody(e.target.value)}
              className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 font-sans"
            />
          </div>

          <button
            onClick={handleProcessRaw}
            disabled={isSimulating}
            className="huvo-glow-button px-5 py-2 rounded-lg text-white text-xs font-bold transition-all font-['Geist',sans-serif]"
          >
            Classify & Sync Application
          </button>
        </div>
      )}

      {/* Main 2-Column Split: Inbox Stream + Email Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Inbox List */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider font-['Geist_Mono',monospace]">
            Inbound Messages ({emails.length})
          </h3>

          <div className="space-y-2.5 max-h-[65vh] overflow-y-auto pr-1">
            {emails.length === 0 ? (
              <div className="p-8 text-center text-[#64748B] text-xs bg-white border border-[#E2E8F0] rounded-2xl">
                No recruiter emails detected yet.
              </div>
            ) : (
              emails.map((em) => {
                const isSelected = selectedEmail?.id === em.id;
                return (
                  <div
                    key={em.id}
                    onClick={() => setSelectedEmail(em)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-blue-50/70 border-[#2563EB] shadow-xs'
                        : 'bg-white hover:border-blue-300 border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#0F172A] font-['Geist',sans-serif]">{em.detectedCompany || em.sender}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md font-['Geist_Mono',monospace] ${
                          em.classification === 'INTERVIEW'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : em.classification === 'OFFER'
                            ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                            : em.classification === 'REJECTION'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-gray-100 text-[#475569]'
                        }`}
                      >
                        {em.classification}
                      </span>
                    </div>
                    <p className="text-xs text-[#0F172A] font-semibold line-clamp-1">{em.subject}</p>
                    <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">{em.snippet}</p>
                    <span className="text-[10px] text-[#94A3B8] block pt-1 font-['Geist_Mono',monospace]">
                      {new Date(em.receivedAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Email Detail Inspection */}
        <div className="lg:col-span-2 space-y-4">
          {selectedEmail ? (
            <div className="p-6 rounded-2xl bg-white space-y-4 border border-[#E2E8F0] shadow-xs">
              {/* Header */}
              <div className="border-b border-[#E2E8F0] pb-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-xl font-normal font-editorial text-[#0F172A] tracking-tight">{selectedEmail.subject}</h2>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full font-['Geist_Mono',monospace] ${
                      selectedEmail.classification === 'INTERVIEW'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : selectedEmail.classification === 'OFFER'
                        ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                        : selectedEmail.classification === 'REJECTION'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-gray-100 text-[#475569]'
                    }`}
                  >
                    {selectedEmail.classification} (
                    {Math.round(selectedEmail.confidenceScore * 100)}% confidence)
                  </span>
                </div>

                <div className="text-xs text-[#64748B] flex items-center gap-3 flex-wrap font-['Geist_Mono',monospace]">
                  <span>
                    <strong className="text-[#0F172A]">From:</strong> {selectedEmail.sender}
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-[#0F172A]">Company:</strong> {selectedEmail.detectedCompany}
                  </span>
                  <span>•</span>
                  <span>{new Date(selectedEmail.receivedAt).toLocaleString()}</span>
                </div>
              </div>

              {/* AI Classification Insights */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2563EB] flex items-center gap-1.5 uppercase tracking-wider font-['Geist_Mono',monospace]">
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                    AI Action Recommendation:
                  </span>
                  {selectedEmail.matchedApplicationId && onOpenApplication && (
                    <button
                      onClick={() => onOpenApplication(selectedEmail.matchedApplicationId!)}
                      className="text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>View Application</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[#334155] leading-relaxed font-sans">{selectedEmail.actionTaken}</p>
              </div>

              {/* Full Email Body */}
              <div className="bg-[#F8FAFC] rounded-xl p-4.5 border border-[#E2E8F0] font-sans text-xs text-[#0F172A] leading-relaxed whitespace-pre-wrap">
                {selectedEmail.fullBody || selectedEmail.snippet}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#64748B] text-xs bg-white border border-[#E2E8F0] rounded-2xl">
              Select an email on the left to review details and classification telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

