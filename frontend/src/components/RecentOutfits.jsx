// frontend/src/components/RecentOutfits.jsx
import React, { useEffect, useState } from "react";
import { fetchOutfits } from "../utils/api"; // ✅ New: Fetch outfits from backend persistence API
import OutfitCard from "./OutfitCard"; // Reusable card component to render a single outfit

/*
 RecentOutfits Component
* - Fetches recently saved outfits from backend (persistence layer)
* - Delegates rendering of each outfit to OutfitCard (keeps this component focused on data + layout)
* - Why: moving rendering into OutfitCard Keeps code DRY and makes UI easier to test and style
*/
const RecentOutfits = () => {
    const [outfits, setOutfits] = useState([]);

    useEffect(() => {
        // load recent outfits when component mounts
        const loadOutfits = async () => {
            try {
                // fetchOutfits is expected to call the backend /api/outfits/recent and return {outfits: [...]}
                const data = await fetchOutfits();
                setOutfits(data.outfits || []);
            } catch (err){
                // Log to console for developers and keep UI silent (could add user-facing error later)
                console.error("Failed to fetch outfits:", err);
            }
        };
        loadOutfits();
    }, []);

    return (
        <div style={{ padding: 12}}>
            <h2>Recent Outfits</h2>

            {/* graceful empty state for first-time users */}
            {outfits.length === 0 ? (
                <p style={{color: "#666" }}>No outfits saved yet.</p>
            ) : (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap"}}>
                    {outfits.map((o, idx) => (
                        // OutfitCard handles thumbnail, theme, colours swatches rendering
                        <OutfitCard key={idx} outfit={o} />
                    ))}
                </div>
            )}
        </div>
    );
};
export default RecentOutfits;