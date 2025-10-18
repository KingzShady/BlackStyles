// frontend/src/components/RecentOutfits.jsx
import React, { useEffect, useState } from "react";
import { fetchOutfits, searchOutfits } from "../utils/api";
import OutfitCard from "./OutfitCard";
import { saveFilters, loadFilters } from "../utils/localStorageUtils";
import FavouriteButton from "./FavouriteButton";


const RecentOutfits = () => {
    // 🆕 Persisted filters state using localStorage
    const [filters, setFilters] = useState(loadFilters());
    const [page, setPage] = useState(1); // 🆕 Pagination state
    const [outfits, setOutfits] = useState([]); 
    const [sidebarOpen, setSidebarOpen] = useState(true); 
    const [filteredOutfits, setFilteredOutfits] = useState([]);

    // Load inital outfits on mount
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
        saveFilters(filters);
        try {
            const results = await searchOutfits(
                filters.tags,
                filters.theme,
                filters.sort,
                page
            );
            setFilteredOutfits(results || []);
        } catch (err){
            console.error("Search failed:", err);
        }
    };

    const popularTags = [
        "Formal", "Casual", "Streetwear", "Workwear", "Sportswear",
         "Vintage", "Beachwear", "Party", "Bohemian", "Festival"
    ];
    const themes = ["Summer", "Winter", "Spring", "Autumn"];

    const outfitsToDisplay = 
        filteredOutfits.length > 0 || filters.tags.length > 0 || filters.theme
        ? filteredOutfits 
        : outfits;

    return (
        <div className="flex relative" style={{ padding: 12}}>
            {/* 🆕 Collapsible Sidebar */}
            {sidebarOpen && (
                <div 
                    className="w-1/4 p-4 border-r bg-gray-50 shadow-md rounded-lg" 
                    style={{ marginBottom: 12 }}
                >
                    <h3 className="font-bold mb-2">Filter Outfits</h3>
            
            {/* Tag Filter */}
            <label className="block font-semibold mt-2">Tags:</label>
            <select
                multiple
                value={filters.tags}
                onChange={(e) =>
                    setFilters({ ...filters, tags: Array.from(e.target.selectedOptions, (opt) => opt.value)})
                }
                className="border rounded w-full p-1"
            >
                {popularTags.map((tag) => (
                    <option key={tag} value={tag}>
                        {tag}
                    </option>
                ))}
            </select>

            {/* Theme Filter */}
            <label className="block font-semibold mt-2">Theme:</label>
            <select
                value={filters.theme}
                onChange={(e) => setFilters({ ...filters, theme: e.target.value })}
                className="border rounded w-full p-1"
            >
                <option value="">All</option>
                {themes.map((t) => (
                    <option key={t} value={t}>
                        {t}
                    </option>
                 ))}
            </select>

            {/* 🆕 Sort Options */}
            <label className="block font-semibold mt-2">Sort:</label>
            <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
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

    {/* Pagination Controls */}
    <div className="flex justify-between mb-3 w-full px-4">
        <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3, py-1, bg-gray-200 rounded hover:bg-gray-300 transition"
        >
            Prev
        </button>
        <span>Page {page}</span>
        <button
            onClick={ () => setPage(page + 1)}
            className="px-3, py-1, bg-gray-200 rounded hover:bg-gray-300 transition"
        >
            Next
        </button>
    </div>

    {/* Outfit Grid Display*/}
    <div className="w-3/4 p-4 outfit-grid">
        {outfitsToDisplay.map((o, i) => (
            <div key={i} className="relative">
                <OutfitCard outfit={o} />
                {/* 🆕 Favourite Button */}
                <FavouriteButton outfitId={o._id || i} />
            </div>
        ))}
    </div>
    </div>
    );
};

export default RecentOutfits;