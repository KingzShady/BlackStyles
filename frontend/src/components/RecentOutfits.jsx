// frontend/src/components/RecentOutfits.jsx
import React, { useEffect, useState } from "react";
import { fetchOutfits, searchOutfits } from "../utils/api"; // ✅ Updated: now using combined search (tags + theme)
import OutfitCard from "./OutfitCard";

/*
 RecentOutfits Component
* - Fetches and display recently saved outfits
* - Adds: sidebar filters for tags + themes
* - Why: Provides more precise filtering and better UX
*/
const RecentOutfits = () => {
    const [outfits, setOutfits] = useState([]); // All outfits from backend
    const [searchTags, setSearchTags] = useState([]); // User-selected tags
    const [searchTheme, setSearchTheme] = useState(""); // User-selected theme
    const [filteredOutfits, setFilteredOutfits] = useState([]); // Results after filter applied

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

    // 🔹 Updated: search now supports tags + theme
    const handleSearch = async () => {
        try {
            const results = await searchOutfits(searchTags, searchTheme);
            setFilteredOutfits(results || []);
        } catch (err){
            console.error("Search failed:", err);
        }
    };

    // ✅ New: Sidebar filter Options
    const popularTags = ["Formal", "Casual", "Streetwear", "Workwear", "Sportswear", "Vintage", "Beachwear", "Party", "Bohemian", "Festival"];
    const themes = ["Summer", "Winter", "Spring", "Autumn"];

    // Determine which list to render: filetered results if present, otherwise the main list
    const outfitsToDisplay = filteredOutfits.length > 0 || searchTags.length > 0 || searchTheme
        ? filteredOutfits 
        : outfits;

    return (
        <div className="flex" style={{ padding: 12}}>
            {/* Sidebar Filters */}
            <div className="w-1/4 p-4 border-r flex flex-col gap-4" style={{ marginBottom: 12 }}>
            <h3>Filter Outfits</h3>

            {/* Tag Filter  Group*/}
            <div className="filter-group flex flex-col">
            <label htmlFor="tag-select">Tags:</label>
            <select
                    id="tag-select"
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
            </div>

            {/* Theme Filter Group*/}
            <div className="filter-group flex flex-col">
            <label htmlFor="theme-select">Theme:</label>
            <select
                    id="theme-select"
                    value={searchTheme}
                    onChange={(e) => setSearchTheme(e.target.value)}
                >
                    <option value="">All</option>
                    {themes.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </div>

                <button onClick={handleSearch} className="mt-2">
                    Search
                </button>
                
            </div>
            {/* Outfit Display Area */}
            <div className="w-3/4 p-4 outfit-grid flex flex-wrap gap-4">
            {outfitsToDisplay.length === 0 ? (
                <p style={{ color: "#666" }}>
                    {outfits.length === 0
                        ? "No outfits saved yet."
                        : "No outfits match the selected filters."}
                </p>
            ) : (
                outfitsToDisplay.map((o, idx) => <OutfitCard key={idx} outfit={o} />)
            )}
        </div>
    </div>
    );
};

export default RecentOutfits;