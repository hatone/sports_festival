import { z } from 'zod'

export const eventEnum = [
  'running',
  'obstacle',
  'relay',
  'ballgame',
  'tugofwar',
  'dance',
  'tailtag',
  'bigball_team',
  'bigball_pair',
  'borrowing'
] as const

// 追加参加者のスキーマ
export const participantSchema = z.object({
  name: z.string().min(1),
  age: z.number().min(0).max(100),
  gender: z.enum(['male', 'female', 'other']),
  events: z.array(z.enum(eventEnum)).default([])
})

// Waitingリスト用のスキーマ
export const waitingListSchema = z.object({
  name: z.string().min(1),
  age: z.number().min(21).max(100),
  email: z.string().email(),
  gender: z.enum(['male', 'female', 'other']),
  events: z.array(z.enum(eventEnum)).default([]),
  phone: z.string().optional(),
  clubExperience: z.string().optional(),
  exerciseFrequency: z.enum(['none', 'weekly', 'daily']).optional(),
  notes: z.string().optional(),
  participants: z.array(participantSchema).optional().default([])
})

// 代表者を含む全体のスキーマ
export const registerSchema = z.object({
  name: z.string().min(1),
  age: z.number().min(21).max(100),
  email: z.string().email(),
  gender: z.enum(['male', 'female', 'other']),
  events: z.array(z.enum(eventEnum)).default([]),
  phone: z.string().optional(),
  clubExperience: z.string().optional(),
  exerciseFrequency: z.enum(['none', 'weekly', 'daily']).optional(),
  notes: z.string().optional(),
  participants: z.array(participantSchema).optional().default([])
})

export type ParticipantData = z.infer<typeof participantSchema>
export type WaitingListData = z.infer<typeof waitingListSchema>
export type RegisterFormData = z.infer<typeof registerSchema> 