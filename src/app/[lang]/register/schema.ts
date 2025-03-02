import { z } from 'zod'

export const eventEnum = [
  'running',
  'obstacle',
  'relay',
  'ballgame',
  'tugofwar',
  'dance',
  'tailtag'
] as const

// 追加参加者のスキーマ
export const participantSchema = z.object({
  name: z.string().min(1),
  age: z.number().min(0).max(100),
  gender: z.enum(['male', 'female', 'other']),
  events: z.array(z.enum(eventEnum)).min(1, { message: 'required' })
})

// 代表者を含む全体のスキーマ
export const registerSchema = z.object({
  name: z.string().min(1),
  age: z.number().min(0).max(100),
  email: z.string().email(),
  gender: z.enum(['male', 'female', 'other']),
  events: z.array(z.enum(eventEnum)).min(1, { message: 'required' }),
  phone: z.string().optional(),
  notes: z.string().optional(),
  // 追加参加者の配列
  participants: z.array(participantSchema).optional().default([])
})

export type ParticipantData = z.infer<typeof participantSchema>
export type RegisterFormData = z.infer<typeof registerSchema> 