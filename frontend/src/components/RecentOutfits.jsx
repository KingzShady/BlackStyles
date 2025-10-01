// frontend/src/components/RecentOutfits.jsx
import React, { useEffect, useState } from "react";
import { fetchOutfits, searchOutfitsByTag } from "../utils/api"; // ✅ New: Updated import for multi-tag search
import OutfitCard from "./OutfitCard";

/*
 RecentOutfits Component
* - Fetches and display recently saved outfits
* - Adds: multi-tag dropdown search for outfits
* - Why: Allows more powerful filtering (e.g., by "Formal" + "Casual")
*/
const RecentOutfits = () => {
    const [outfits, setOutfits] = useState([]); // All outfits from backend
    const [searchTags, setSearchTags] = useState(""); // 🔹 UPDATED: now stores mutiple tags
    const [filteredOutfits, setFilteredOutfits] = useState([]); // Filtered results

    useEffect(() => {
        // Load recent outfits when component mounts
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

    // 🔹 New: handler for multi-tag search
    const handleSearch = async () => {
        if (!searchTags.trim()) return; // Skip if no tags selected
        try{
            const results = await searchOutfitsByTag(searchTags); // Updated API call
            setFilteredOutfits(results || []); // store filtered results 
        }
        catch (err){
            console.error("Search failed:", err);
        }
    };

    // ✅ New: Dropdown list of popular tags for convenience
    const popularTags = ["Formal", "Casual", "Streetwear", "Workwear", "Sportswear"]; 

    return (
        <div style={{ padding: 12}}>
            <h2>Recent Outfits</h2>

            {/* ✅ New: Multi-tag dropdown */}
            <div className="search-bar" style={{ marginBottom: 12 }}>
                <select
                    multiple
                    value={searchTags}
                    onChange={(e) =>
                        setSearchTags(Array.from(e.target.selectedOptions, (opt) => opt.value))
                    }
                >
                    {popularTags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* ✅ Show filtered results if avaliable, otherwise all outfits */}
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