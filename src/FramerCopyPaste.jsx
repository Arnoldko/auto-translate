import * as React from "react"
import { useState, useEffect, useRef } from "react"

// Framer에서 바로 사용할 수 있도록 모든 스타일과 로직을 하나로 합친 컴포넌트입니다.
// This component combines all logic and styles for direct use in Framer.

export function TranslatorComponent() {
    const [uiLang, setUiLang] = useState("ko")
    const [slots, setSlots] = useState([
        { id: 0, lang: "ko", text: "", isLoading: false },
        { id: 1, lang: "en", text: "", isLoading: false },
        { id: 2, lang: "ja", text: "", isLoading: false },
    ])

    const [copiedId, setCopiedId] = useState(null)
    const debounceTimer = useRef(null)

    // Supported languages
    const LANGUAGES = [
        { code: "ko", name: "한국어", native: "한국어" },
        { code: "en", name: "English", native: "English" },
        { code: "ja", name: "Japanese", native: "日本語" },
        { code: "zh", name: "Chinese", native: "中文" },
        { code: "es", name: "Spanish", native: "Español" },
        { code: "fr", name: "French", native: "Français" },
        { code: "de", name: "German", native: "Deutsch" },
        { code: "ru", name: "Russian", native: "Русский" },
    ]

    const UI_TEXTS = {
        ko: {
            title: "3중 자동 번역기",
            uiLangLabel: "사용자 인터페이스 언어",
            placeholder: "텍스트를 입력하세요...",
            error: "번역 오류",
            translating: "번역 중...",
            poweredBy: "번역 제공: MyMemory API",
        },
        en: {
            title: "Triple Auto Translator",
            uiLangLabel: "Interface Language",
            placeholder: "Enter text...",
            error: "Translation Error",
            translating: "Translating...",
            poweredBy: "Powered by MyMemory API",
        },
        ja: {
            title: "3重自動翻訳機",
            uiLangLabel: "インターフェース言語",
            placeholder: "テキストを入力...",
            error: "翻訳エラー",
            translating: "翻訳中...",
            poweredBy: "Powered by MyMemory API",
        },
    }

    const t = (key) => {
        const texts = UI_TEXTS[uiLang] || UI_TEXTS["en"]
        return texts[key] || UI_TEXTS["en"][key]
    }

    const handleCopy = async (text, id) => {
        if (!text) return
        try {
            await navigator.clipboard.writeText(text)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    const translateText = async (text, sourceLang, targetIndex, targetLang) => {
        if (!text) return
        if (sourceLang === targetLang) {
            setSlots((prev) => {
                const next = [...prev]
                next[targetIndex].text = text
                return next
            })
            return
        }

        setSlots((prev) => {
            const next = [...prev]
            next[targetIndex].isLoading = true
            return next
        })

        try {
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
                    text
                )}&langpair=${sourceLang}|${targetLang}`
            )
            const data = await response.json()

            if (data.responseData) {
                setSlots((prev) => {
                    const next = [...prev]
                    next[targetIndex].text = data.responseData.translatedText
                    next[targetIndex].isLoading = false
                    return next
                })
            } else {
                throw new Error("No data")
            }
        } catch (error) {
            console.error("Translation error:", error)
            setSlots((prev) => {
                const next = [...prev]
                next[targetIndex].text = `[${t("error")}]`
                next[targetIndex].isLoading = false
                return next
            })
        }
    }

    const handleTextChange = (index, newText) => {
        const newSlots = [...slots]
        newSlots[index].text = newText
        setSlots(newSlots)

        if (debounceTimer.current) clearTimeout(debounceTimer.current)

        debounceTimer.current = setTimeout(() => {
            if (newText.trim() === "") {
                setSlots((s) =>
                    s.map((item) => ({ ...item, text: "", isLoading: false }))
                )
                return
            }

            slots.forEach((slot, i) => {
                if (i !== index) {
                    translateText(newText, newSlots[index].lang, i, slot.lang)
                }
            })
        }, 800)
    }

    const handleSlotLangChange = (index, newLang) => {
        const newSlots = [...slots]
        newSlots[index].lang = newLang
        setSlots(newSlots)

        const sourceSlot = slots.find(
            (s, i) => i !== index && s.text.trim() !== ""
        )
        if (sourceSlot) {
            translateText(sourceSlot.text, sourceSlot.lang, index, newLang)
        }
    }

    // Styles object
    const styles = {
        container: {
            fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            padding: "20px",
            backgroundColor: "#f0f2f5",
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            color: "#1a1a1a",
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            padding: "15px 25px",
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            flexWrap: "wrap",
            gap: "10px",
        },
        title: {
            margin: 0,
            fontSize: "22px",
            fontWeight: 700,
            background: "linear-gradient(45deg, #1877f2, #8e2de2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            flex: 1,
        },
        card: {
            background: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: "300px",
            boxSizing: "border-box",
        },
        select: {
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #e4e6eb",
            backgroundColor: "#ffffff",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            width: "100%",
        },
        textarea: {
            width: "100%",
            flex: 1,
            border: "none",
            resize: "none",
            fontSize: "18px",
            lineHeight: 1.6,
            outline: "none",
            marginTop: "15px",
            fontFamily: "inherit",
        },
        footer: {
            marginTop: "15px",
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #e4e6eb",
            paddingTop: "15px",
        },
        copyBtn: {
            background: "transparent",
            border: "1px solid #e4e6eb",
            cursor: "pointer",
            padding: "6px 12px",
            borderRadius: "20px",
            color: "#65676b",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            fontWeight: 500,
        },
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>{t("title")}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label style={{ fontSize: "14px", color: "#65676b" }}>
                        {t("uiLangLabel")}:
                    </label>
                    <select
                        value={uiLang}
                        onChange={(e) => setUiLang(e.target.value)}
                        style={{ ...styles.select, width: "auto" }}
                    >
                        {LANGUAGES.map((l) => (
                            <option key={l.code} value={l.code}>
                                {l.native}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={styles.grid}>
                {slots.map((slot, index) => (
                    <div key={slot.id} style={styles.card}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ flex: 1 }}>
                                <select
                                    value={slot.lang}
                                    onChange={(e) =>
                                        handleSlotLangChange(index, e.target.value)
                                    }
                                    style={styles.select}
                                >
                                    {LANGUAGES.map((l) => (
                                        <option key={l.code} value={l.code}>
                                            {l.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {slot.isLoading && (
                                <span
                                    style={{
                                        fontSize: "12px",
                                        color: "#1877f2",
                                        marginLeft: "10px",
                                        alignSelf: "center",
                                    }}
                                >
                                    {t("translating")}
                                </span>
                            )}
                        </div>

                        <textarea
                            value={slot.text}
                            onChange={(e) => handleTextChange(index, e.target.value)}
                            placeholder={t("placeholder")}
                            dir="auto"
                            style={styles.textarea}
                        />

                        <div style={styles.footer}>
                            <button
                                onClick={() => handleCopy(slot.text, slot.id)}
                                style={{
                                    ...styles.copyBtn,
                                    color: copiedId === slot.id ? "#2e7d32" : "#65676b",
                                    borderColor: copiedId === slot.id ? "#a5d6a7" : "#e4e6eb",
                                    backgroundColor: copiedId === slot.id ? "#e8f5e9" : "transparent",
                                }}
                            >
                                {copiedId === slot.id ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#888" }}>
                {t("poweredBy")}
            </div>
        </div>
    )
}

export default TranslatorComponent
