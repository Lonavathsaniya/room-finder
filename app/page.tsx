"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Room = {
  id: string;
  title: string;
  location: string;
  rent: number;
  property_type: string;
  tenant_preference: string;
  contact: string;
  image_url?: string | null;
};

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [tenant, setTenant] = useState("");

  useEffect(() => {
    async function fetchRooms() {
      let query = supabase.from("rooms").select("*");

      if (search) {
        query = query.ilike("location", `%${search}%`);
      }

      if (propertyType) {
        query = query.eq("property_type", propertyType);
      }

      if (tenant) {
        query = query.eq("tenant_preference", tenant);
      }

      const { data, error } = await query;
      if (!error) setRooms(data || []);
    }

    fetchRooms();
  }, [search, propertyType, tenant]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">🏠 Room Finder</h1>

          <div className="space-x-4">
            <a href="/add-room" className="bg-blue-600 text-white px-4 py-2 rounded">
              Add Room
            </a>
            <a href="/login" className="bg-green-600 text-white px-4 py-2 rounded">
              Owner Login
            </a>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded shadow mb-6 flex gap-4 flex-wrap">
          <input
            className="border p-2 rounded w-64"
            placeholder="Search by location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">All Property Types</option>
            <option value="1 BHK">1 BHK</option>
            <option value="2 BHK">2 BHK</option>
            <option value="3 BHK">3 BHK</option>
          </select>

          <select
            className="border p-2 rounded"
            onChange={(e) => setTenant(e.target.value)}
          >
            <option value="">All Tenants</option>
            <option value="Girls">Girls</option>
            <option value="Bachelors">Bachelors</option>
            <option value="Family">Family</option>
            <option value="Working">Working</option>
          </select>
        </div>

        {rooms.length === 0 && (
          <p className="text-center text-gray-600">No rooms found.</p>
        )}

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg shadow p-4 border"
            >
              <h2 className="text-xl font-semibold mb-2">{room.title}</h2>

              {room.image_url && (
                <img
                  src={room.image_url}
                  className="w-full h-48 object-cover rounded mb-3"
                  alt="Room"
                />
              )}

              <p><b>📍 Location:</b> {room.location}</p>
              <p><b>💰 Rent:</b> ₹{room.rent}</p>
              <p><b>🏠 Type:</b> {room.property_type}</p>
              <p><b>👥 Preference:</b> {room.tenant_preference}</p>
              <p><b>📞 Contact:</b> {room.contact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
