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
  Plus,
  Inbox
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
    'Hi Pankaj,\n\nWe were really impressed with your distributed systems background at Vync and Coron and would like to schedule a 45-minute technical screen with our backend team.\n\nPlease pick a slot here: https://calendly.com/stripe-eng/pankaj\n\nBest,\nStripe Recruiting'
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
        recipient: 'codepankaj84@gmail.com',
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
            <div className="w-9 h-9 rounded-xl bg-[#111116] border border-[#1D1D24] flex items-center justify-center text-[#FF5A36] shadow-sm">
              <Inbox className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                Recruiter Email Monitor & Classifier
              </h1>
              <p className="text-xs text-[#8E8E9B] mt-0.5">
                Monitors incoming recruiter emails with Gemini classification and automatically syncs application stages.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowRawTester(!showRawTester)}
            className="btn-secondary-outline text-xs py-2 px-3.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Test Custom Inbound Email</span>
          </button>
        </div>
      </div>

      {/* Simulator Quick Action Banner */}
      <div className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#8E8E9B] flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
            Simulate Recruiter Inbound Email Event
          </span>
          <span className="text-[11px] text-[#00FF88] font-mono">Triggers AI classification & pipeline sync</span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap pt-1">
          <button
            id="simulate-interview-email-btn"
            onClick={() => handleSimulate('interview')}
            disabled={isSimulating}
            className="btn-secondary-outline text-xs py-1.5 px-3.5 disabled:opacity-50 hover:border-[#FF5A36]/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Simulate Interview Invitation</span>
          </button>

          <button
            id="simulate-offer-email-btn"
            onClick={() => handleSimulate('offer')}
            disabled={isSimulating}
            className="btn-secondary-outline text-xs py-1.5 px-3.5 disabled:opacity-50 text-[#00FF88] border-[#00FF88]/30 hover:border-[#00FF88]"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF88]" />
            <span>Simulate Job Offer</span>
          </button>

          <button
            id="simulate-rejection-email-btn"
            onClick={() => handleSimulate('rejection')}
            disabled={isSimulating}
            className="btn-secondary-outline text-xs py-1.5 px-3.5 disabled:opacity-50 text-[#8E8E9B]"
          >
            <Clock className="w-3.5 h-3.5 text-[#8E8E9B]" />
            <span>Simulate Rejection Notice</span>
          </button>
        </div>
      </div>

      {/* Raw Email Test Modal / Drawer */}
      {showRawTester && (
        <div className="p-6 rounded-2xl bg-[#111116] border border-[#FF5A36]/40 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-display text-white tracking-tight">Parse Custom Inbound Email</h3>
            <button
              onClick={() => setShowRawTester(false)}
              className="text-xs text-[#8E8E9B] hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-[#8E8E9B] block mb-1 uppercase tracking-wider">Sender Email</label>
              <input
                type="text"
                value={rawSender}
                onChange={(e) => setRawSender(e.target.value)}
                className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-2.5 font-mono focus:outline-none focus:border-[#FF5A36]"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-[#8E8E9B] block mb-1 uppercase tracking-wider">Subject</label>
              <input
                type="text"
                value={rawSubject}
                onChange={(e) => setRawSubject(e.target.value)}
                className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-2.5 focus:outline-none focus:border-[#FF5A36]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-[#8E8E9B] block mb-1 uppercase tracking-wider">Email Body Content</label>
            <textarea
              rows={4}
              value={rawBody}
              onChange={(e) => setRawBody(e.target.value)}
              className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
            />
          </div>

          <button
            onClick={handleProcessRaw}
            disabled={isSimulating}
            className="btn-accent text-xs py-2 px-5 font-semibold"
          >
            Classify & Sync Application
          </button>
        </div>
      )}

      {/* Main 2-Column Split: Inbox Stream + Email Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Inbox List */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold text-[#8E8E9B] uppercase tracking-wider font-mono">
            Inbound Messages ({emails.length})
          </h3>

          <div className="space-y-2.5 max-h-[65vh] overflow-y-auto pr-1">
            {emails.length === 0 ? (
              <div className="p-8 text-center text-[#8E8E9B] text-xs bg-[#111116] border border-[#1D1D24] rounded-2xl">
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
                        ? 'bg-[#14141E] border-[#FF5A36] shadow-sm'
                        : 'bg-[#111116] hover:border-[#353545] border-[#1D1D24]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{em.detectedCompany || em.sender}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md font-mono ${
                          em.classification === 'INTERVIEW'
                            ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30'
                            : em.classification === 'OFFER'
                            ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30'
                            : em.classification === 'REJECTION'
                            ? 'bg-[#14141B] text-[#8E8E9B] border border-[#1D1D24]'
                            : 'bg-[#14141B] text-white border border-[#1D1D24]'
                        }`}
                      >
                        {em.classification}
                      </span>
                    </div>
                    <p className="text-xs text-[#CCCCCC] font-semibold line-clamp-1">{em.subject}</p>
                    <p className="text-[11px] text-[#8E8E9B] line-clamp-2 leading-relaxed">{em.snippet}</p>
                    <span className="text-[10px] text-[#5A5A66] block pt-1 font-mono">
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
            <div className="p-6 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-4">
              {/* Header */}
              <div className="border-b border-[#1D1D24] pb-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-xl font-bold font-display text-white tracking-tight">{selectedEmail.subject}</h2>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full font-mono ${
                      selectedEmail.classification === 'INTERVIEW'
                        ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30'
                        : selectedEmail.classification === 'OFFER'
                        ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30'
                        : selectedEmail.classification === 'REJECTION'
                        ? 'bg-[#14141B] text-[#8E8E9B] border border-[#1D1D24]'
                        : 'bg-[#14141B] text-white border border-[#1D1D24]'
                    }`}
                  >
                    {selectedEmail.classification} (
                    {Math.round(selectedEmail.confidenceScore * 100)}% confidence)
                  </span>
                </div>

                <div className="text-xs text-[#8E8E9B] flex items-center gap-3 flex-wrap font-mono">
                  <span>
                    <strong className="text-white">From:</strong> {selectedEmail.sender}
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-white">Company:</strong> {selectedEmail.detectedCompany}
                  </span>
                  <span>•</span>
                  <span>{new Date(selectedEmail.receivedAt).toLocaleString()}</span>
                </div>
              </div>

              {/* AI Classification Insights */}
              <div className="p-4 rounded-xl bg-[#14141B] border border-[#FF5A36]/30 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#FF5A36] flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
                    AI Action Recommendation:
                  </span>
                  {selectedEmail.matchedApplicationId && onOpenApplication && (
                    <button
                      onClick={() => onOpenApplication(selectedEmail.matchedApplicationId!)}
                      className="text-[#FF5A36] hover:underline font-semibold flex items-center gap-1 font-mono"
                    >
                      <span>View Application</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[#CCCCCC] leading-relaxed">{selectedEmail.actionTaken}</p>
              </div>

              {/* Full Email Body */}
              <div className="bg-[#070709] rounded-xl p-4.5 border border-[#1D1D24] font-mono text-xs text-[#E2E2E8] leading-relaxed whitespace-pre-wrap">
                {selectedEmail.fullBody || selectedEmail.snippet}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#8E8E9B] text-xs bg-[#111116] border border-[#1D1D24] rounded-2xl">
              Select an email on the left to review details and classification telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
