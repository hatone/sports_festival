'use client'

import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData, type ParticipantData, eventEnum } from './schema'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

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
  event_description: string
  event_title: string
  event_options: {
    running: string
    obstacle: string
    relay: string
    ballgame: string
    tugofwar: string
    dance: string
    tailtag: string
    bigball_team: string
    bigball_pair: string
    borrowing: string
  }
  phone: string
  notes: string
  submit: string
  participants: {
    title: string
    add: string
    remove: string
    empty: string
  }
  pricing: {
    title: string
    free?: string
    paid?: string
    details: {
      date: string
      venue: string
      participants: string
      fee: string
      format: string
    }
  }
  errors: {
    required: string
    email: string
    phone: string
    age: {
      min: string
      max: string
    }
    events: string
  }
  representative_info: string
}

export default function RegisterForm({ dict }: { dict: FormDict }) {
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState('');
  
  // 言語パラメータを取得（現在のURLから）- クライアントサイドでのみ実行
  useEffect(() => {
    const pathParts = pathname.split('/');
    if (pathParts.length > 1) {
      setLang(pathParts[1]);
    }
  }, [pathname]);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      age: 0,
      email: '',
      gender: 'male',
      events: [],
      phone: '',
      notes: '',
      participants: []
    }
  })
  
  // 追加参加者のフィールド配列
  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });
  
  // 新しい参加者を追加
  const addParticipant = () => {
    append({
      name: '',
      age: 0,
      gender: 'male',
      events: []
    });
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // URLパラメータを作成
      const params = new URLSearchParams()
      params.set('name', data.name)
      params.set('age', data.age.toString())
      params.set('email', data.email)
      params.set('gender', data.gender)
      params.set('events', JSON.stringify(data.events))
      params.set('phone', data.phone || '')
      params.set('notes', data.notes || '')
      
      // 追加参加者の情報を含める
      if (data.participants && data.participants.length > 0) {
        params.set('participants', JSON.stringify(data.participants))
      } else {
        params.set('participants', '[]')
      }
      
      // 免責事項ページへ遷移
      router.push(`/${lang}/disclaimer?${params.toString()}`)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  // 参加者のイベント選択のレンダリング関数
  const renderEventCheckboxes = (participantIndex: number) => {
    const fieldName = participantIndex === -1 ? 'events' : `participants.${participantIndex}.events`;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Controller
          control={control}
          name={fieldName as any}
          render={({ field: { onChange, value } }) => (
            <>
              {eventEnum.map((event) => (
                <div key={event} className="flex items-center">
                  <input
                    id={`event-${event}-${participantIndex}`}
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-500 rounded bg-gray-700"
                    checked={value?.includes(event)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const newValue = checked
                        ? [...(value || []), event]
                        : (value || []).filter((val: string) => val !== event);
                      onChange(newValue);
                    }}
                  />
                  <label
                    htmlFor={`event-${event}-${participantIndex}`}
                    className="ml-2 block text-sm text-white"
                  >
                    {dict.event_options[event]}
                  </label>
                </div>
              ))}
            </>
          )}
        />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* イベント詳細セクション */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-white mb-2">{dict.pricing.title}</h3>
        <ul className="text-gray-300 space-y-1 text-sm">
          <li>{dict.pricing.details.date}</li>
          <li>{dict.pricing.details.venue}</li>
          <li>{dict.pricing.details.participants}</li>
          <li>{dict.pricing.details.fee}</li>
          <li>{dict.pricing.details.format}</li>
        </ul>
      </div>
      
      {/* 代表者セクション */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white border-b pb-2">{dict.representative_info}</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white">
              {dict.name}
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{dict.errors.required}</p>
            )}
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-white">
              {dict.age}
            </label>
            <input
              type="number"
              id="age"
              {...register('age', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-400">
                {errors.age.type === 'too_small'
                  ? dict.errors.age.min.replace('{{min}}', '0')
                  : dict.errors.age.max.replace('{{max}}', '100')}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              {dict.email}
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{dict.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white">
              {dict.phone}
            </label>
            <input
              type="tel"
              id="phone"
              {...register('phone')}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="(123) 456-7890"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-400">{dict.errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-white">
              {dict.gender}
            </label>
            <select
              id="gender"
              {...register('gender')}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="male">{dict.gender_options.male}</option>
              <option value="female">{dict.gender_options.female}</option>
              <option value="other">{dict.gender_options.other}</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-400">{dict.errors.required}</p>
            )}
          </div>

          {/* 参加種目 */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">
              {dict.event}
            </label>
            <p className="text-gray-300 mb-3 text-sm">
              {dict.event_description}
            </p>
            <h4 className="text-white font-medium mb-2">
              {dict.event_title}
            </h4>
            <div className="space-y-2">
              {renderEventCheckboxes(-1)}
            </div>
            {errors.events && (
              <p className="text-red-500 text-sm mt-1">{dict.errors.events}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-white">
              {dict.notes}
            </label>
            <textarea
              id="notes"
              {...register('notes')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* 追加参加者セクション */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white border-b pb-2 mb-4">{dict.participants.title}</h2>
        
        {fields.length === 0 ? (
          <div>
            <p className="text-gray-400 text-center py-4">{dict.participants.empty}</p>
            <button
              type="button"
              onClick={addParticipant}
              className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors"
            >
              {dict.participants.add}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-700 rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-white">参加者 {index + 2}</h3>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors text-sm"
                  >
                    {dict.participants.remove}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white">
                      {dict.name}
                    </label>
                    <input
                      type="text"
                      {...register(`participants.${index}.name`)}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.participants?.[index]?.name && (
                      <p className="mt-1 text-sm text-red-400">{dict.errors.required}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white">
                      {dict.age}
                    </label>
                    <input
                      type="number"
                      {...register(`participants.${index}.age`, { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.participants?.[index]?.age && (
                      <p className="mt-1 text-sm text-red-400">
                        {dict.errors.age.min.replace('{{min}}', '0')}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white">
                      {dict.gender}
                    </label>
                    <select
                      {...register(`participants.${index}.gender`)}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="male">{dict.gender_options.male}</option>
                      <option value="female">{dict.gender_options.female}</option>
                      <option value="other">{dict.gender_options.other}</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <fieldset>
                    <legend className="block text-sm font-medium text-white mb-2">
                      {dict.event}
                    </legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {renderEventCheckboxes(index)}
                    </div>
                    {errors.participants?.[index]?.events && (
                      <p className="mt-1 text-sm text-red-400">{dict.errors.events}</p>
                    )}
                  </fieldset>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addParticipant}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors"
            >
              {`${fields.length + 2}人目を追加`}
            </button>
          </div>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
        >
          {dict.submit}
        </button>
      </div>
    </form>
  )
} 