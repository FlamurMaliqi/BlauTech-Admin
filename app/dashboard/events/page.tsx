'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import DataTable from '@/components/DataTable'
import Modal from '@/components/Modal'
import EventForm from '@/components/EventForm'
import EventDetailView from '@/components/EventDetailView'
import { eventsApi } from '@/lib/api'
import { format } from 'date-fns'

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [viewingEvent, setViewingEvent] = useState<any>(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await eventsApi.fetch()
      setEvents(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingEvent(null)
    setIsModalOpen(true)
  }

  const handleEdit = (event: any) => {
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  const handleViewDetails = (event: any) => {
    setViewingEvent(event)
    setIsDetailModalOpen(true)
  }

  const handleDelete = async (event: any) => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) {
      return
    }

    try {
      await eventsApi.delete(event.id)
      await loadEvents()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      setError('')
      setSuccessMessage('')
      
      if (editingEvent) {
        await eventsApi.update(editingEvent.id, data)
        setSuccessMessage('Event updated successfully!')
      } else {
        await eventsApi.create(data)
        setSuccessMessage('Event created successfully!')
      }
      
      // Close modal and reload after a short delay to show success message
      setTimeout(() => {
        setIsModalOpen(false)
        setEditingEvent(null)
        setSuccessMessage('')
        loadEvents()
      }, 1000)
    } catch (err: any) {
      console.error('Error saving event:', err)
      // Error will be displayed in the form component
      throw err // Re-throw so form can handle it
    }
  }

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

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError('')}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="sm:flex sm:items-center mb-6">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={handleAdd}
              className="block rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors"
            >
              Add Event
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No events available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => handleViewDetails(event)}
                className="group relative bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:shadow-lg hover:border-primary-300 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* Header with Status and Category */}
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {event.title}
                      </h3>
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
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {event.short_description}
                    </p>
                  )}
                </div>

                {/* Details Section */}
                <div className="px-6 pb-4 space-y-3 border-t border-gray-100 pt-4">
                  {/* Date & Time */}
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {event.start_date ? format(new Date(event.start_date), 'PPp') : '-'}
                      </p>
                      {event.end_date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ends: {format(new Date(event.end_date), 'PPp')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium text-gray-900">{event.location}</p>
                      </div>
                    </div>
                  )}

                  {/* Registration & Capacity */}
                  <div className="grid grid-cols-2 gap-3">
                    {event.registration_url && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Registration</p>
                        <a
                          href={event.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-800 font-medium inline-flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Register
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                    {event.capacity && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Capacity</p>
                        <p className="text-sm font-medium text-gray-900">{event.capacity} attendees</p>
                      </div>
                    )}
                  </div>

                  {/* Organizer */}
                  {event.organizer_name && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Organizer</p>
                        <p className="text-sm font-medium text-gray-900">{event.organizer_name}</p>
                        {event.organizer_contactinfo && (
                          <p className="text-xs text-gray-500 mt-0.5">{event.organizer_contactinfo}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    {event.duration && (
                      <span className="text-xs text-gray-500">
                        ⏱️ {event.duration} min
                      </span>
                    )}
                    {event.registration_deadline && (
                      <span className="text-xs text-gray-500">
                        📅 Reg. by {format(new Date(event.registration_deadline), 'MMM d')}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail View Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setViewingEvent(null)
        }}
        title="Event Details"
      >
        {viewingEvent && (
          <EventDetailView
            event={viewingEvent}
            onEdit={() => {
              setIsDetailModalOpen(false)
              setEditingEvent(viewingEvent)
              setIsModalOpen(true)
            }}
            onDelete={() => {
              setIsDetailModalOpen(false)
              handleDelete(viewingEvent)
            }}
            onClose={() => {
              setIsDetailModalOpen(false)
              setViewingEvent(null)
            }}
          />
        )}
      </Modal>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingEvent(null)
          setError('')
        }}
        title={editingEvent ? 'Edit Event' : 'Add Event'}
      >
        <EventForm
          initialData={editingEvent}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingEvent(null)
            setError('')
          }}
          title={editingEvent ? 'Edit Event' : 'Add Event'}
        />
      </Modal>
    </Layout>
  )
}

