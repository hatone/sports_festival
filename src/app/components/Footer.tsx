'use client'

import { useParams } from 'next/navigation';
import { Locale } from "../types";
import { getDictionary } from "../i18n";
import { useEffect, useState } from 'react';

export default function Footer() {
  const { lang } = useParams() as { lang: Locale };
  const [dict, setDict] = useState<any>({
    footer: {
      organizer: '主催',
      contact: 'お問い合わせ'
    }
  });
  
  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    
    loadDictionary();
  }, [lang]);
  
  return (
    <footer className="bg-gray-100 text-gray-800 py-4 w-full border-t border-gray-200">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">{dict.footer.organizer}: BaySpo　{dict.footer.contact}: info@bayspo.com</p>
      </div>
    </footer>
  );
} 