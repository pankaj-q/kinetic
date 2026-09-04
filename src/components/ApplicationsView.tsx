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

const STAGES: { key: ApplicationStatus; label: string; badgeColor: string }[] = [
  { key: 'WAITING_FOR_APPROVAL', label: 'Waiting Approval', badgeColor: 'bg-[#FFE8E1] text-[#FF5A36] border-[#FF5A36]/30' },
  { key: 'APPLIED', label: 'Applied', badgeColor: 'bg-[#FAF9F5] text-[#111111] border-[#DDDAD2]' },
  { key: 'SCREENING', label: 'Screening', badgeColor: 'bg-[#FAF9F5] text-[#111111] border-[#DDDAD2]' },
  { key: 'INTERVIEW', label: 'Interview', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { key: 'OFFER', label: 'Offer', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { key: 'REJECTED', label: 'Rejected', badgeColor: 'bg-[#FAF9F5] text-[#6B6B67] border-[#DDDAD2]' },
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
            <div className="w-8 h-8 rounded-lg bg-[#FCFBF8] border border-[#DDDAD2] flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4 text-[#FF5A36]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal font-editorial text-[#111111] tracking-tight">
              Application Pipeline
            </h1>
          </div>
          <p className="text-xs text-[#6B6B67] mt-1">
            Track applications from AI preparation through human approval, recruiter interviews, and offers.
          </p>
        </div>

        {/* View Toggle & Search */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B67]" />
            <input
              type="text"
              placeholder="Search company or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#DDDAD2] text-xs text-[#111111] placeholder-[#6B6B67] w-48 sm:w-56 focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="flex items-center bg-[#FAF9F5] border border-[#DDDAD2] rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'kanban' ? 'bg-[#FCFBF8] text-[#111111] shadow-2xs border border-[#DDDAD2]' : 'text-[#6B6B67] hover:text-[#111111]'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'table' ? 'bg-[#FCFBF8] text-[#111111] shadow-2xs border border-[#DDDAD2]' : 'text-[#6B6B67] hover:text-[#111111]'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onNavigateTab('jobs')}
            className="btn-accent text-xs py-2 px-3.5 font-semibold"
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
                className="flex flex-col rounded-xl bg-[#FAF9F5] p-3.5 min-w-[240px] space-y-3.5 border border-[#DDDAD2] shadow-xs"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-[#DDDAD2]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                      {stage.label}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FCFBF8] text-[#6B6B67] border border-[#DDDAD2]">
                    {stageApps.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-0.5">
                  {stageApps.length === 0 ? (
                    <div className="py-10 text-center text-[#6B6B67] text-[11px] font-medium">No applications</div>
                  ) : (
                    stageApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => onOpenApplication(app.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 group ${
                          app.status === 'WAITING_FOR_APPROVAL'
                            ? 'border-[#FF5A36]/40 bg-[#FFE8E1]/20 hover:border-[#FF5A36]'
                            : 'border-[#DDDAD2] bg-[#FCFBF8] hover:border-[#111111]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="font-semibold text-xs text-[#111111] group-hover:text-[#FF5A36] transition-colors line-clamp-1">
                            {app.jobTitle}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md font-mono ${
                              app.matchScore >= 90
                                ? 'bg-[#FFE8E1] text-[#FF5A36] border border-[#FF5A36]/30'
                                : 'bg-[#FAF9F5] text-[#111111] border border-[#DDDAD2]'
                            }`}
                          >
                            {app.matchScore}%
                          </span>
                        </div>

                        <p className="text-[11px] text-[#6B6B67] flex items-center gap-1.5">
                          <Building className="w-3 h-3 text-[#6B6B67]" />
                          <span className="font-medium text-[#111111]">{app.company}</span>
                        </p>

                        {app.status === 'WAITING_FOR_APPROVAL' && (
                          <div className="pt-1">
                            <span className="block text-center py-1 rounded-lg bg-[#FFE8E1] text-[#FF5A36] text-[10px] font-bold border border-[#FF5A36]/30">
                              ⚡ Click to Review & Submit
                            </span>
                          </div>
                        )}

                        {app.status === 'INTERVIEW' && app.interviewDate && (
                          <div className="pt-1 text-[10px] text-emerald-800 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(app.interviewDate).toLocaleDateString()}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 text-[10px] text-[#6B6B67] border-t border-[#DDDAD2] font-mono">
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
        <div className="rounded-xl editorial-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#111111]">
              <thead className="bg-[#FAF9F5] border-b border-[#DDDAD2] text-[11px] text-[#6B6B67] font-bold uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3.5 px-5">Role & Company</th>
                  <th className="py-3.5 px-5">Match Score</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Form Fields</th>
                  <th className="py-3.5 px-5">Updated</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDDAD2]">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#111111] text-sm">{app.jobTitle}</div>
                      <div className="text-[#6B6B67] text-xs mt-0.5">{app.company}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-[#FAF9F5] text-[#111111] border border-[#DDDAD2]">
                        {app.matchScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold ${
                          app.status === 'APPLIED'
                            ? 'bg-[#FAF9F5] text-[#111111] border border-[#DDDAD2]'
                            : app.status === 'WAITING_FOR_APPROVAL'
                            ? 'bg-[#FFE8E1] text-[#FF5A36] border border-[#FF5A36]/30'
                            : app.status === 'INTERVIEW'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : app.status === 'OFFER'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-[#FAF9F5] text-[#6B6B67] border border-[#DDDAD2]'
                        }`}
                      >
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-[#6B6B67] font-mono">{app.formFields.length} inputs prepared</td>
                    <td className="py-3.5 px-5 text-[#6B6B67] font-mono">
                      {new Date(app.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenApplication(app.id)}
                          className="btn-accent text-xs py-1 px-3"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => onDeleteApplication(app.id)}
                          className="btn-icon p-1.5 text-[#6B6B67] hover:text-rose-600"
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

