// frontend/src/components/RecentOutfits.jsx
import React, {useEffect, useState} from "react";
import { getRecentPalettes } from "../utils/api"; // ✅ New: API import replaces localStorage utils — fetches from backend persistence

/*
 RecentOutfits Component
 - Before: Displayed outfits saved only in localStorage.
 - After: Now fetches recent palettes from backend via API.
 - Benefits: Palettes persist across sessions/devices + prepares app for user accounts.
*/
const RecentOutfits = () => {
    const [recent, setItems] = useState([]);

    // ✅ Fetch recent palettes from backend when component mounts
    useEffect(() => {
        async function fetchRecent() {
            try {
                const palettes = await getRecentPalettes();
                setRecent(palettes);
            } catch (err) {
                console.warn("⚠️ Failed to fetch recent palettes:", err);
            }
        }
        fetchRecent();
    }, []);

    return (
        <div style={{ marginTop: 20}} >
            <h3>Recent Outfits</h3>

            {/* ✅ Render list of recent palettes returned from backend */}
            {recent.map((entry, idx) => (
                <div
                    key={idx}
                    style={{
                        display: "flex",
                        gap: 12,
                        padding: 10,
                        border: "1px solid #eee",
                        borderRadius: 8,
                        alignItems: "center",
                    }}
                >
                    {/* ✅Outfit Thumbnail*/}
                    <img
                        src={entry.imageUrl}
                        alt="outfit"
                        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }}
                    />

                    {/* ✅Palette details (theme _swatches) */}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600}}>
                            {entry.theme || "Theme: —"}
                        </div>
                        <div style={{ fontSize: 12, color: "#666"}}>
                            {new Date(entry.timestamp).toLocaleString()}
                        </div>

                        {/* ✅Inline swatches replacing old ColourSwatches component */}
                        <div style={{ display: "flex", gap: 4, marginTop: 6}}>
                            {entry.colors.map((c, i) => (
                                <div
                                    key={i}
                                    style={{
                                        backgroundColor: c,
                                        width: 20,
                                        height: 20,
                                        borderRadius: 4,
                                    }}
                                    />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default RecentOutfits;