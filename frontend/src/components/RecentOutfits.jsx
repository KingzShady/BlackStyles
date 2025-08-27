import React, {useEffect, useState} from "react";
import { getSavedOutfits, deleteOutfit, clearSavedOutfits } from "../utils/localStorageUtils";
import ColourSwatches from "./ColourSwatches";

/*
 RecentOutfits Component
 - Displays a list of recently saved outfits from localStorage.
 - Show thumbnail, palette, theme, and saved time.
 - Supports deleting individual outfits or clearing all.
*/

export default function RecentOutfits() {
    const [items, setItems] = useState([]);

    // Load saved outfits on component mount
    useEffect(() => {
        setItems(getSavedOutfits());
    }, []);

    // Handle deleting a single outfit and update state
    const handleDelete = (id) => {
        deleteOutfit(id);
        setItems(getSavedOutfits());
    };

    // No outfits saved, render nothing
    if (!items || items.length === 0) return null;

    return (
        <div style={{ marginTop: 20}} >
            <h3>Recent Outfits</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {items.slice(0,6).map((o) => (
                    <div
                       key={o.id}
                       style={{
                        display: "flex",
                        gap: 12,
                        padding: 10,
                        border: "1px solid #eee",
                        borderRadius: 8,
                        alignItems: "center",
                        }} 
                        >
                            {/* Outfit Thumbnail */}
                            <img 
                                src={o.imageData} 
                                alt="outfit"
                                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }}
                            />

                            {/* Outfit Details: theme, saved date, colour palette */}
                            <div style = {{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 600}}>
                                    {o.theme || "Theme: —"}
                                </div>
                                <div style={{ fontSize: 12, color: "#666"}}>
                                    {new Date(o.savedAt).toLocaleString()}
                                </div>
                                <ColourSwatches colours={o.palette || []} />
                            </div>
                            
                            {/* Delete single outfit */}
                            <div>
                                <button
                                  onClick={() => handleDelete(o.id)}
                                  style={{
                                    padding: "6px 10px",
                                    borderRadius: 6,
                                    border: "1px solid #ddd",
                                    background: "#fff",
                                    cursor: "pointer",
                                  }}
                                  >
                                    Delete
                                  </button>
                            </div>
                    </div>
                ))}

                {/* Clear all outfits button */}
                <div>
                    <button
                      onClick={() => {
                        clearSavedOutfits();
                        setItems([]);

                      }}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                        cursor: "pointer",
                      }}
                      >
                        Clear All
                      </button>
                </div>
            </div>
        </div>
    );
}