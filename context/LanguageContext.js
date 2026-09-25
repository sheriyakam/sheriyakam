import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATIONS, getTranslation } from '../constants/translations';

const LanguageContext = createContext();

const LANGUAGE_STORAGE_KEY = '@sheriyakam_app_language_v1';

export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState('en');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreLanguage = async () => {
            try {
                const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
                if (stored === 'ml' || stored === 'en') {
                    setLanguageState(stored);
                }
            } catch (err) {
                console.warn('[LanguageContext] Failed to restore language:', err);
            } finally {
                setIsLoading(false);
            }
        };

        restoreLanguage();
    }, []);

    const setLanguage = useCallback(async (lang) => {
        const safeLang = lang === 'ml' ? 'ml' : 'en';
        setLanguageState(safeLang);
        try {
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, safeLang);
        } catch (err) {
            console.warn('[LanguageContext] Failed to save language preference:', err);
        }
    }, []);

    const toggleLanguage = useCallback(async () => {
        const newLang = language === 'en' ? 'ml' : 'en';
        await setLanguage(newLang);
    }, [language, setLanguage]);

    const t = useCallback((key, fallback) => {
        return getTranslation(language, key, fallback);
    }, [language]);

    return (
        <LanguageContext.Provider value={{
            language,
            isMalayalam: language === 'ml',
            setLanguage,
            toggleLanguage,
            t,
            isLoading
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        return {
            language: 'en',
            isMalayalam: false,
            setLanguage: async () => {},
            toggleLanguage: async () => {},
            t: (key, fallback) => getTranslation('en', key, fallback),
            isLoading: false
        };
    }
    return context;
};
