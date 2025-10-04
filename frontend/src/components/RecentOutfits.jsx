// frontend/src/components/RecentOutfits.jsx
import React, { useEffect, useState } from "react";
import { fetchOutfits, searchOutfits } from "../utils/api";
import OutfitCard from "./OutfitCard";

/*
 RecentOutfits Component
* - Fetches and display recently saved outfits
* - Adds: sidebar filters for tags + themes
* - Why: Provides more precise filtering and better UX
*/
const RecentOutfits = () => {
    const [outfits, setOutfits] = useState([]); // All outfits from backend
    const [searchTags, setSearchTags] = useState([]); // Selected tags
    const [searchTheme, setSearchTheme] = useState(""); // Selected theme
    const [sortOption, setSortOption] = useState(""); // 🆕 ADDED: Sort option state
    const [sidebarOpen, setSidebarOpen] = useState(true); // 🆕 ADDED: Collapsible sidebar state
    const [filteredOutfits, setFilteredOutfits] = useState([]); // Filtered search results

    useEffect(() => {
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

    // 🔹 UPDATED: Seach includes sorting parameter
    const handleSearch = async () => {
        try {
            const results = await searchOutfits(searchTags, searchTheme, sortOption);
            setFilteredOutfits(results || []);
        } catch (err){
            console.error("Search failed:", err);
        }
    };

    const popularTags = ["Formal", "Casual", "Streetwear", "Workwear", "Sportswear", "Vintage", "Beachwear", "Party", "Bohemian", "Festival"];
    const themes = ["Summer", "Winter", "Spring", "Autumn"];

    // Determine which list to render: filetered results if present, otherwise the main list
    const outfitsToDisplay = filteredOutfits.length > 0 || searchTags.length > 0 || searchTheme
         ? filteredOutfits 
        : outfits;

    return (
        <div className="flex relative" style={{ padding: 12}}>
            {/* 🆕 Collapsible Sidebar */}
            {sidebarOpen && (
            <div className="w-1/4 p-4 border-r bg-gray-50 shadow-md rounded-lg" style={{ marginBottom: 12 }}>
            <h3 className="font-bold mb-2">Filter Outfits</h3>
            
            {/* Tag Filter */}
            <label className="block font-semibold mt-2">Tags:</label>
            <select
                multiple
                value={searchTags}
                onChange={(e) =>
                    setSearchTags(Array.from(e.target.selectedOptions, (opt) => opt.value))
                }
                className="border rounded w-full p-1"
            >
                {popularTags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                ))}
            </select>

            {/* Theme Filter */}
            <label className="block font-semibold mt-2">Theme:</label>
            <select
                value={searchTheme}
                onChange={(e) => setSearchTheme(e.target.value)}
                className="border rounded w-full p-1"
            >
                <option value="">All</option>
                {themes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            {/* 🆕 Sort Options */}
            <label className="block font-semibold mt-2">Sort:</label>
            <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border rounded w-full p-1"
            >
                <option value="">Default</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="alphabetical">Alphabetical</option>
            </select>

            <button 
                onClick={handleSearch}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Search
            </button>
        </div>
    )}

    {/* 🆕 Sidebar Toggle Button */}
    <button
        className="absolute left-2 top-2 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition"
        onClick={() => setSidebarOpen(!sidebarOpen)}
    >
        {sidebarOpen ? "Hide Filters" : "Show Filters"}
    </button>

    {/* Outfit Grid Display*/}
    <div className="w-3/4 p-4 outfit-grid">
        {(filteredOutfits.length > 0 ? filteredOutfits : outfits).map((outfit, i) => (
            <OutfitCard key={i} outfit={outfit} />
        ))}
    </div>
    </div>
    );
};

export default RecentOutfits;