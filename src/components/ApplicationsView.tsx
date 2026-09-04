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
  { key: 'WAITING_FOR_APPROVAL', label: 'Waiting Approval', badgeColor: 'bg-[#FF5A36]/15 text-[#FF5A36] border-[#FF5A36]/30' },
  { key: 'APPLIED', label: 'Applied', badgeColor: 'bg-[#16161E] text-[#FFFFFF] border-[#1D1D24]' },
  { key: 'SCREENING', label: 'Screening', badgeColor: 'bg-[#16161E] text-[#FFFFFF] border-[#1D1D24]' },
  { key: 'INTERVIEW', label: 'Interview', badgeColor: 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/30' },
  { key: 'OFFER', label: 'Offer', badgeColor: 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/30' },
  { key: 'REJECTED', label: 'Rejected', badgeColor: 'bg-[#16161E] text-[#8E8E9B] border-[#1D1D24]' },
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
            <div className="w-8 h-8 rounded-lg bg-[#111116] border border-[#1D1D24] flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4 text-[#FF5A36]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#FFFFFF] tracking-tight">
              Application Pipeline
            </h1>
          </div>
          <p className="text-xs text-[#8E8E9B] mt-1">
            Track applications from AI preparation through human approval, recruiter interviews, and offers.
          </p>
        </div>

        {/* View Toggle & Search */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E9B]" />
            <input
              type="text"
              placeholder="Search company or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl bg-[#0D0D12] border border-[#1D1D24] text-xs text-[#FFFFFF] placeholder-[#8E8E9B] w-48 sm:w-56 focus:outline-none focus:border-[#FF5A36]"
            />
          </div>

          <div className="flex items-center bg-[#111116] border border-[#1D1D24] rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'kanban' ? 'bg-[#1D1D24] text-[#FFFFFF]' : 'text-[#8E8E9B] hover:text-[#FFFFFF]'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-[#1D1D24] text-[#FFFFFF]' : 'text-[#8E8E9B] hover:text-[#FFFFFF]'
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
                className="flex flex-col rounded-2xl bg-[#0D0D12] p-3.5 min-w-[240px] space-y-3.5 border border-[#1D1D24] shadow-xs"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-[#1D1D24]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-display font-bold uppercase tracking-wider text-[#FFFFFF]">
                      {stage.label}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#16161E] text-[#8E8E9B] border border-[#1D1D24]">
                    {stageApps.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-0.5">
                  {stageApps.length === 0 ? (
                    <div className="py-10 text-center text-[#8E8E9B] text-[11px] font-medium">No applications</div>
                  ) : (
                    stageApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => onOpenApplication(app.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 group ${
                          app.status === 'WAITING_FOR_APPROVAL'
                            ? 'border-[#FF5A36]/50 bg-[#111116] hover:border-[#FF5A36] shadow-sm'
                            : 'border-[#1D1D24] bg-[#111116] hover:border-[#2D2D38]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="font-semibold text-xs text-[#FFFFFF] group-hover:text-[#FF5A36] transition-colors line-clamp-1">
                            {app.jobTitle}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md font-mono ${
                              app.matchScore >= 90
                                ? 'bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30'
                                : 'bg-[#16161E] text-[#FFFFFF] border border-[#1D1D24]'
                            }`}
                          >
                            {app.matchScore}%
                          </span>
                        </div>

                        <p className="text-[11px] text-[#8E8E9B] flex items-center gap-1.5">
                          <Building className="w-3 h-3 text-[#8E8E9B]" />
                          <span className="font-medium text-[#FFFFFF]">{app.company}</span>
                        </p>

                        {app.status === 'WAITING_FOR_APPROVAL' && (
                          <div className="pt-1">
                            <span className="block text-center py-1 rounded-lg bg-[#FF5A36]/15 text-[#FF5A36] text-[10px] font-bold border border-[#FF5A36]/30">
                              ⚡ Click to Review &amp; Submit
                            </span>
                          </div>
                        )}

                        {app.status === 'INTERVIEW' && (
                          <div className="pt-1 text-[10px] text-[#00FF88] font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{app.interviewDate ? new Date(app.interviewDate).toLocaleDateString() : 'Round Scheduled'}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 text-[10px] text-[#8E8E9B] border-t border-[#1D1D24] font-mono">
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
        <div className="rounded-2xl bg-[#111116] border border-[#1D1D24] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#FFFFFF]">
              <thead className="bg-[#0D0D12] border-b border-[#1D1D24] text-[11px] text-[#8E8E9B] font-bold uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3.5 px-5">Role &amp; Company</th>
                  <th className="py-3.5 px-5">Match Score</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Form Fields</th>
                  <th className="py-3.5 px-5">Updated</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D1D24]">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#16161E] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#FFFFFF] text-sm">{app.jobTitle}</div>
                      <div className="text-[#8E8E9B] text-xs mt-0.5">{app.company}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-[#16161E] text-[#FFFFFF] border border-[#1D1D24]">
                        {app.matchScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold ${
                          app.status === 'APPLIED'
                            ? 'bg-[#16161E] text-[#FFFFFF] border border-[#1D1D24]'
                            : app.status === 'WAITING_FOR_APPROVAL'
                            ? 'bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30'
                            : app.status === 'INTERVIEW'
                            ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30'
                            : app.status === 'OFFER'
                            ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30'
                            : 'bg-[#16161E] text-[#8E8E9B] border border-[#1D1D24]'
                        }`}
                      >
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-[#8E8E9B] font-mono">{app.formFields.length} inputs prepared</td>
                    <td className="py-3.5 px-5 text-[#8E8E9B] font-mono">
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
                          className="p-1.5 rounded-lg text-[#8E8E9B] hover:text-rose-500 hover:bg-[#16161E] transition-colors cursor-pointer"
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

