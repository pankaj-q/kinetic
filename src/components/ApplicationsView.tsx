import React, { useState } from 'react';
import {
  Layers,
  LayoutGrid,
  List,
  Search,
  Filter,
  Flame,
  Building,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Trash2
} from 'lucide-react';
import { PreparedApplication, ApplicationStatus } from '../types';

interface ApplicationsViewProps {
  applications: PreparedApplication[];
  onOpenApplication: (appId: string) => void;
  onUpdateStatus: (appId: string, status: ApplicationStatus) => void;
  onDeleteApplication: (appId: string) => void;
  onNavigateTab: (tab: string) => void;
}

const STAGES: { key: ApplicationStatus; label: string; color: string }[] = [
  { key: 'WAITING_FOR_APPROVAL', label: 'Waiting Approval', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
  { key: 'APPLIED', label: 'Applied', color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300' },
  { key: 'SCREENING', label: 'Screening', color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' },
  { key: 'INTERVIEW', label: 'Interview', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
  { key: 'OFFER', label: 'Offer', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
  { key: 'REJECTED', label: 'Rejected', color: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
];

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onOpenApplication,
  onUpdateStatus,
  onDeleteApplication,
  onNavigateTab,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-['Geist',sans-serif]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Layers className="w-4 h-4 text-[#2563EB]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal font-editorial text-[#0F172A] tracking-tight">
              Application Pipeline
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Track applications from AI preparation through approval, recruiter interviews, and offers.
          </p>
        </div>

        {/* View Toggle & Search */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search company or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] w-48 sm:w-56 focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="flex items-center bg-white border border-[#E2E8F0] rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'kanban' ? 'bg-[#F1F5F9] text-[#0F172A] shadow-2xs' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'table' ? 'bg-[#F1F5F9] text-[#0F172A] shadow-2xs' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onNavigateTab('jobs')}
            className="huvo-glow-button flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-white text-xs font-bold transition-all font-['Geist',sans-serif]"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Discover More Jobs</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageApps = filteredApps.filter((a) => a.status === stage.key);
            return (
              <div
                key={stage.key}
                className="flex flex-col rounded-2xl bg-white p-3.5 min-w-[240px] space-y-3.5 border border-[#E2E8F0] shadow-xs"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      stage.key === 'WAITING_FOR_APPROVAL' ? 'text-amber-700' :
                      stage.key === 'APPLIED' ? 'text-[#2563EB]' :
                      stage.key === 'SCREENING' ? 'text-cyan-700' :
                      stage.key === 'INTERVIEW' ? 'text-purple-700' :
                      stage.key === 'OFFER' ? 'text-[#10B981]' : 'text-rose-600'
                    }`}>{stage.label}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F1F5F9] text-[#475569] font-['Geist_Mono',monospace]">
                    {stageApps.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-0.5">
                  {stageApps.length === 0 ? (
                    <div className="py-10 text-center text-[#94A3B8] text-[11px] font-medium">No applications</div>
                  ) : (
                    stageApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => onOpenApplication(app.id)}
                        className={`p-4 rounded-xl border huvo-card-interactive cursor-pointer transition-all space-y-2.5 group ${
                          app.status === 'WAITING_FOR_APPROVAL'
                            ? 'border-amber-300 bg-amber-50/40'
                            : 'border-[#E2E8F0] bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="font-bold text-xs text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-1 font-['Geist',sans-serif]">
                            {app.jobTitle}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md font-['Geist_Mono',monospace] ${
                              app.matchScore >= 90
                                ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                                : 'bg-blue-50 text-[#2563EB] border border-blue-200'
                            }`}
                          >
                            {app.matchScore}%
                          </span>
                        </div>

                        <p className="text-[11px] text-[#64748B] flex items-center gap-1.5 font-['Geist',sans-serif]">
                          <Building className="w-3 h-3 text-[#94A3B8]" />
                          <span className="font-medium text-[#334155]">{app.company}</span>
                        </p>

                        {app.status === 'WAITING_FOR_APPROVAL' && (
                          <div className="pt-1">
                            <span className="block text-center py-1 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                              ⚡ Click to Review & Submit
                            </span>
                          </div>
                        )}

                        {app.status === 'INTERVIEW' && app.interviewDate && (
                          <div className="pt-1 text-[10px] text-purple-700 font-['Geist_Mono',monospace] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(app.interviewDate).toLocaleDateString()}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 text-[10px] text-[#94A3B8] border-t border-[#E2E8F0] font-['Geist_Mono',monospace]">
                          <span>{app.formFields.length} fields</span>
                          <span>{new Date(app.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl bg-white overflow-hidden shadow-xs border border-[#E2E8F0]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#334155]">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] text-[#64748B] font-bold uppercase tracking-wider font-['Geist_Mono',monospace]">
                <tr>
                  <th className="py-3.5 px-5">Role & Company</th>
                  <th className="py-3.5 px-5">Match Score</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Form Fields</th>
                  <th className="py-3.5 px-5">Updated</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#0F172A] text-sm font-['Geist',sans-serif]">{app.jobTitle}</div>
                      <div className="text-[#64748B] text-xs mt-0.5">{app.company}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200 font-['Geist_Mono',monospace]">
                        {app.matchScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold font-['Geist_Mono',monospace] ${
                          app.status === 'APPLIED'
                            ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
                            : app.status === 'WAITING_FOR_APPROVAL'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : app.status === 'INTERVIEW'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : app.status === 'OFFER'
                            ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                            : 'bg-gray-100 text-[#475569]'
                        }`}
                      >
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-[#64748B] font-['Geist_Mono',monospace]">{app.formFields.length} inputs prepared</td>
                    <td className="py-3.5 px-5 text-[#64748B] font-['Geist_Mono',monospace]">
                      {new Date(app.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenApplication(app.id)}
                          className="px-3 py-1 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs transition-all font-['Geist',sans-serif]"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => onDeleteApplication(app.id)}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 transition-all"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

