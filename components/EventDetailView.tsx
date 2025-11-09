'use client'

import { format } from 'date-fns'

interface EventDetailViewProps {
  event: any
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export default function EventDetailView({ event, onEdit, onDelete, onClose }: EventDetailViewProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
      published: { bg: 'bg-green-100', text: 'text-green-800', label: 'Published' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
      postponed: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Postponed' },
    }
    const config = statusConfig[status] || statusConfig.draft
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      workshop: 'bg-purple-100 text-purple-800',
      conference: 'bg-indigo-100 text-indigo-800',
      meetup: 'bg-pink-100 text-pink-800',
      webinar: 'bg-cyan-100 text-cyan-800',
      networking: 'bg-orange-100 text-orange-800',
      training: 'bg-teal-100 text-teal-800',
      hackathon: 'bg-emerald-100 text-emerald-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return colors[category] || colors.other
  }

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="text-gray-400 mt-0.5 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <div className="text-sm text-gray-900">{value}</div>
      </div>
    </div>
  )

  return (
    <div className="max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(event.status)}
              {event.category && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                  {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </span>
              )}
              {event.format && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {event.format.charAt(0).toUpperCase() + event.format.slice(1).replace('-', ' ')}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {event.short_description && (
          <p className="text-gray-600 leading-relaxed">{event.short_description}</p>
        )}
      </div>

      {/* Details Grid */}
      <div className="space-y-1">
        {/* Description */}
        {event.description && (
          <InfoRow
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            }
            label="Description"
            value={<p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>}
          />
        )}

        {/* Dates */}
        <InfoRow
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          label="Event Dates"
          value={
            <div className="space-y-1">
              <p className="font-medium">
                Start: {event.start_date ? format(new Date(event.start_date), 'PPp') : '-'}
              </p>
              {event.end_date && (
                <p className="text-gray-600">
                  End: {format(new Date(event.end_date), 'PPp')}
                </p>
              )}
              {event.duration && (
                <p className="text-gray-600 text-xs">
                  Duration: {event.duration} minutes
                </p>
              )}
            </div>
          }
        />

        {/* Location */}
        {event.location && (
          <InfoRow
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            label="Location"
            value={<p className="font-medium">{event.location}</p>}
          />
        )}

        {/* Registration */}
        {(event.registration_url || event.registration_deadline || event.capacity) && (
          <InfoRow
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Registration"
            value={
              <div className="space-y-2">
                {event.registration_url && (
                  <a
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Registration Link
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {event.registration_deadline && (
                  <p className="text-gray-600">
                    Deadline: {format(new Date(event.registration_deadline), 'PPp')}
                  </p>
                )}
                {event.capacity && (
                  <p className="text-gray-600">
                    Capacity: {event.capacity} attendees
                  </p>
                )}
              </div>
            }
          />
        )}

        {/* Organizer */}
        {(event.organizer_name || event.organizer_contactinfo) && (
          <InfoRow
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            label="Organizer"
            value={
              <div className="space-y-1">
                {event.organizer_name && (
                  <p className="font-medium">{event.organizer_name}</p>
                )}
                {event.organizer_contactinfo && (
                  <p className="text-gray-600">{event.organizer_contactinfo}</p>
                )}
              </div>
            }
          />
        )}

        {/* Requirements */}
        {event.requirements && (
          <InfoRow
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            label="Requirements / Prerequisites"
            value={<p className="text-gray-700 whitespace-pre-wrap">{event.requirements}</p>}
          />
        )}

        {/* Metadata */}
        <InfoRow
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Metadata"
          value={
            <div className="space-y-1 text-xs text-gray-500">
              <p>Created: {event.created_at ? format(new Date(event.created_at), 'PPp') : '-'}</p>
              {event.updated_at && (
                <p>Last updated: {format(new Date(event.updated_at), 'PPp')}</p>
              )}
            </div>
          }
        />
      </div>

      {/* Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
        <button
          onClick={onEdit}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Edit Event
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete Event
        </button>
      </div>
    </div>
  )
}

