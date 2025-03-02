import type { Locale } from './types'

export const fallbackLng = 'en'
export const languages = [fallbackLng, 'ja'] as const

const dictionaries = {
  en: () => import('./locales/en/common.json').then((module) => module.default),
  ja: () => import('./locales/ja/common.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  try {
    return await dictionaries[locale]()
  } catch (error) {
    console.error(`Failed to load dictionary for ${locale}:`, error)
    // フォールバック
    return await dictionaries[fallbackLng]()
  }
} 