'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from './schema'

type FormDict = {
  title: string
  name: string
  age: string
  email: string
  gender: string
  gender_options: {
    male: string
    female: string
    other: string
  }
  event: string
  event_options: {
    running: string
    relay: string
    jump: string
    throw: string
  }
  submit: string
  errors: {
    required: string
    email: string
    age: {
      min: string
      max: string
    }
  }
}

export default function RegisterForm({ dict }: { dict: FormDict }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    // TODO: Implement form submission
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {dict.name}
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{dict.errors.required}</p>
        )}
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          {dict.age}
        </label>
        <input
          type="number"
          id="age"
          {...register('age', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.age && (
          <p className="mt-1 text-sm text-red-600">
            {errors.age.type === 'too_small'
              ? dict.errors.age.min.replace('{{min}}', '5')
              : dict.errors.age.max.replace('{{max}}', '100')}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {dict.email}
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{dict.errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          {dict.gender}
        </label>
        <select
          id="gender"
          {...register('gender')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="male">{dict.gender_options.male}</option>
          <option value="female">{dict.gender_options.female}</option>
          <option value="other">{dict.gender_options.other}</option>
        </select>
        {errors.gender && (
          <p className="mt-1 text-sm text-red-600">{dict.errors.required}</p>
        )}
      </div>

      <div>
        <label htmlFor="event" className="block text-sm font-medium text-gray-700">
          {dict.event}
        </label>
        <select
          id="event"
          {...register('event')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="running">{dict.event_options.running}</option>
          <option value="relay">{dict.event_options.relay}</option>
          <option value="jump">{dict.event_options.jump}</option>
          <option value="throw">{dict.event_options.throw}</option>
        </select>
        {errors.event && (
          <p className="mt-1 text-sm text-red-600">{dict.errors.required}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {dict.submit}
        </button>
      </div>
    </form>
  )
} 