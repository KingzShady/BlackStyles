// frontend/src/components/RecentOutfits.jsx
import React, { useEffect, useState } from "react";
import { fetchOutfits, searchOutfitsByTag } from "../utils/api"; // ✅ New: Added search API import
import OutfitCard from "./OutfitCard";

/*
 RecentOutfits Component
* - Fetches and display recently saved outfits
* - Adds: a search bar to filter outfits by tags
* - Why: Improves UX by letting users quicly find specific outfits
*/
const RecentOutfits = () => {
    const [outfits, setOutfits] = useState([]); // all outfits from backend
    const [searchTag, setSearchTag] = useState(""); // 🔹 New: track user input for search
    const [filteredOutfits, setFilteredOutfits] = useState([]); // 🔹 New: filtered results

    useEffect(() => {
        // load recent outfits when component mounts
        const loadOutfits = async () => {
            try {
                const data = await fetchOutfits();
                setOutfits(data.outfits || []);
            } catch (err){
                console.error("Failed to fetch outfits:", err);
            }
        };
        loadOutfits();
    }, []);

    // 🔹 New: handler for search button click
    const handleSearch = async () => {
        if (!searchTag.trim()) return; // skip empty input
        try{
            const results = await searchOutfitsByTag(searchTag.trim()); // call API
            setFilteredOutfits(results || []); // store filtered results 
        }
        catch (err){
            console.error("Search failed:", err);
        }
    };

    return (
        <div style={{ padding: 12}}>
            <h2>Recent Outfits</h2>

            {/* 🔹 New: Search bar UI */}
            <div className="search-bar" style={{ marginBottom: 12 }}>
                <input
                    type="text"
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value)}
                    placeholder="Search by tag (e.g., casual, formal)"
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* graceful empty state */}
            {(filteredOutfits.length === 0 || outfits.length === 0) ? (
                <p style={{color: "#666" }}>No outfits saved yet.</p>
            ) : (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap"}}>
                    {/* 🔹 Show filtered results if present, otherwise all outfits */}
                    {(filteredOutfits.length > 0 ? filteredOutfits : outfits).map((o, idx) => (
                        <OutfitCard key={idx} outfit={o} />
                    ))}
                </div>
            )}
        </div>
    );
};
export default RecentOutfits;