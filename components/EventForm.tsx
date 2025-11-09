'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface EventFormData {
  title: string
  short_description?: string
  description?: string
  start_date: string
  start_time?: string
  end_date: string
  duration?: number
  location?: string
  status: string
  category: string
  format: string
  registration_url?: string
  registration_deadline?: string
  capacity?: number
  organizer_name?: string
  organizer_contactinfo?: string
  requirements?: string
}

interface EventFormProps {
  initialData?: any
  onSubmit: (data: EventFormData) => Promise<void>
  onCancel: () => void
  title: string
}

export default function EventForm({ initialData, onSubmit, onCancel, title }: EventFormProps) {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<EventFormData>({
    mode: 'onChange',
  })
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  
  const startDate = watch('start_date')
  const endDate = watch('end_date')

  useEffect(() => {
    if (initialData) {
      const startDate = initialData.start_date ? new Date(initialData.start_date) : null
      // Extract time from start_date if it exists, otherwise use start_time field
      let startTime = initialData.start_time || ''
      if (!startTime && startDate) {
        const hours = startDate.getHours().toString().padStart(2, '0')
        const minutes = startDate.getMinutes().toString().padStart(2, '0')
        startTime = `${hours}:${minutes}`
      }
      
      reset({
        title: initialData.title || '',
        short_description: initialData.short_description || '',
        description: initialData.description || '',
        start_date: startDate ? startDate.toISOString().slice(0, 10) : '',
        start_time: startTime,
        end_date: initialData.end_date ? new Date(initialData.end_date).toISOString().slice(0, 10) : '',
        duration: initialData.duration || '',
        location: initialData.location || '',
        status: initialData.status || 'draft',
        category: initialData.category || '',
        format: initialData.format || 'in-person',
        registration_url: initialData.registration_url || '',
        registration_deadline: initialData.registration_deadline ? new Date(initialData.registration_deadline).toISOString().slice(0, 16) : '',
        capacity: initialData.capacity || '',
        organizer_name: initialData.organizer_name || '',
        organizer_contactinfo: initialData.organizer_contactinfo || '',
        requirements: initialData.requirements || '',
      })
    } else {
      reset({
        status: 'draft',
        format: 'in-person',
      })
    }
  }, [initialData, reset])

  const onSubmitForm = async (data: EventFormData) => {
    setFormError('')
    setLoading(true)
    
    try {
      // Validate dates
      if (data.start_date && data.end_date) {
        const start = new Date(data.start_date)
        const end = new Date(data.end_date)
        
        if (end < start) {
          setFormError('End date must be after start date.')
          setLoading(false)
          return
        }
      }
      
      // Validate registration deadline
      if (data.registration_deadline && data.start_date) {
        const deadline = new Date(data.registration_deadline)
        const start = new Date(data.start_date)
        
        if (deadline > start) {
          setFormError('Registration deadline must be before the event start date.')
          setLoading(false)
          return
        }
      }
      
      // Validate capacity
      if (data.capacity !== undefined && data.capacity < 0) {
        setFormError('Capacity must be a positive number.')
        setLoading(false)
        return
      }
      
      // Validate duration
      if (data.duration !== undefined && data.duration < 0) {
        setFormError('Duration must be a positive number.')
        setLoading(false)
        return
      }
      
      // Combine start_date and start_time if both are provided
      let processedData: any = { ...data }
      
      if (data.start_date && data.start_time) {
        const [hours, minutes] = data.start_time.split(':')
        const startDateTime = new Date(data.start_date)
        startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        processedData.start_date = startDateTime.toISOString()
      } else if (data.start_date) {
        processedData.start_date = new Date(data.start_date).toISOString()
      }
      
      if (data.end_date) {
        processedData.end_date = new Date(data.end_date).toISOString()
      }
      
      // Remove start_time from the data as it's combined with start_date
      delete processedData.start_time
      
      await onSubmit(processedData)
    } catch (err: any) {
      console.error('Form submission error:', err)
      setFormError(err.message || 'An error occurred while saving the event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5 max-h-[80vh] overflow-y-auto pr-2">
      {/* Error Message */}
      {formError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{formError}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            {...register('title', { required: 'Title is required' })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">
            Short Description
          </label>
          <textarea
            id="short_description"
            rows={2}
            {...register('short_description')}
            placeholder="Brief summary for previews and cards"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Full Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
          />
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Event Details</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              id="start_date"
              {...register('start_date', { required: 'Start date is required' })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
            />
            {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>}
          </div>

          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              id="start_time"
              {...register('start_time')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              id="end_date"
              min={startDate || undefined}
              {...register('end_date', { 
                required: 'End date is required',
                validate: (value) => {
                  if (startDate && value && new Date(value) < new Date(startDate)) {
                    return 'End date must be after start date'
                  }
                  return true
                }
              })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
            />
            {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>}
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              min="1"
              {...register('duration', { 
                valueAsNumber: true,
                validate: (value) => {
                  if (value !== undefined && value < 1) {
                    return 'Duration must be at least 1 minute'
                  }
                  return true
                }
              })}
              placeholder="e.g., 120"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
            />
            {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              {...register('status', { required: 'Status is required' })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="postponed">Postponed</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              {...register('category', { required: 'Category is required' })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
            >
              <option value="">Select category</option>
              <option value="workshop">Workshop</option>
              <option value="conference">Conference</option>
              <option value="meetup">Meetup</option>
              <option value="webinar">Webinar</option>
              <option value="networking">Networking</option>
              <option value="training">Training</option>
              <option value="hackathon">Hackathon</option>
              <option value="other">Other</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
            Format *
          </label>
          <select
            id="format"
            {...register('format', { required: 'Format is required' })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
          >
            <option value="in-person">In-Person</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            {...register('location')}
            placeholder="Address or venue name"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
          />
        </div>
      </div>

      {/* Registration & Capacity */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Registration & Capacity</h3>
        
        <div>
          <label htmlFor="registration_url" className="block text-sm font-medium text-gray-700 mb-1">
            Registration URL
          </label>
          <input
            type="url"
            id="registration_url"
            {...register('registration_url', {
              validate: (value) => {
                if (!value) return true // Optional field
                try {
                  new URL(value)
                  return true
                } catch {
                  return 'Please enter a valid URL (e.g., https://example.com)'
                }
              }
            })}
            placeholder="https://example.com/register"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
          />
          {errors.registration_url && <p className="mt-1 text-sm text-red-600">{errors.registration_url.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="registration_deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Registration Deadline
            </label>
            <input
              type="datetime-local"
              id="registration_deadline"
              max={startDate ? new Date(startDate).toISOString().slice(0, 16) : undefined}
              {...register('registration_deadline', {
                validate: (value) => {
                  if (value && startDate && new Date(value) > new Date(startDate)) {
                    return 'Registration deadline must be before event start date'
                  }
                  return true
                }
              })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
            />
            {errors.registration_deadline && <p className="mt-1 text-sm text-red-600">{errors.registration_deadline.message}</p>}
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Capacity (max attendees)
            </label>
            <input
              type="number"
              id="capacity"
              min="1"
              {...register('capacity', { 
                valueAsNumber: true,
                validate: (value) => {
                  if (value !== undefined && value < 1) {
                    return 'Capacity must be at least 1'
                  }
                  return true
                }
              })}
              placeholder="e.g., 100"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
            />
            {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>}
          </div>
        </div>
      </div>

      {/* Organizer & Requirements */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Organizer & Requirements</h3>
        
        <div>
          <label htmlFor="organizer_name" className="block text-sm font-medium text-gray-700 mb-1">
            Organizer Name
          </label>
          <input
            type="text"
            id="organizer_name"
            {...register('organizer_name')}
            placeholder="Name of the organizer"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
          />
        </div>

        <div>
          <label htmlFor="organizer_contactinfo" className="block text-sm font-medium text-gray-700 mb-1">
            Organizer Contact Info
          </label>
          <input
            type="text"
            id="organizer_contactinfo"
            {...register('organizer_contactinfo')}
            placeholder="Email, phone, or contact information"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
          />
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
            Requirements / Prerequisites
          </label>
          <textarea
            id="requirements"
            rows={3}
            {...register('requirements')}
            placeholder="Prerequisites, eligibility criteria, or requirements for attendees"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 sm:text-sm transition-colors px-4 py-2.5"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

