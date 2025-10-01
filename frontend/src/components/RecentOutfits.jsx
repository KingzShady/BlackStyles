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
    const [searchTags, setSearchTags] = useState([]); // 🔹 UPDATED: now stores mutiple tags
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
        // If no tags are selected, clear the filter and return
        if (searchTags.length === 0){
            setFilteredOutfits([]);
            return; // Stops the API call if search is empty
        }
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

    // Determine which list to render: filetered results if present, otherwise the main list
    const outfitsToDisplay = filteredOutfits.length > 0 || searchTags.length > 0 
        ? filteredOutfits 
        : outfits;

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

            {/* ✅ UPDATED: Only show "No Outfits saved yet" if the *main* list is empty */}
            {outfits.length === 0 ? (
                <p style={{color: "#666" }}>No outfits saved yet.</p>
            ) : (
                
                <div className="outfit-grid" style={{ display: "flex", gap: 12, flexWrap: "wrap"}}>
                    {/* Check if a search was performed and returned no results */}
                    {outfitsToDisplay.length === 0 && searchTags.length > 0 ? (
                        <p style={{ color: "#666" }}>No outfits match the selected tags.</p>
                    ) : (
                        /* Show determined list of Outfits */
                        outfitsToDisplay.map((o, idx) => (
                            <OutfitCard key={idx} outfit={o} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
export default RecentOutfits;