"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type RoomForm = {
  title: string;
  location: string;
  rent: string;
  property_type: string;
  tenant_preference: string;
  contact: string;
};

export default function AddRoom() {
  const [form, setForm] = useState<RoomForm>({
    title: "",
    location: "",
    rent: "",
    property_type: "",
    tenant_preference: "",
    contact: "",
  });

  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        alert("Please login first!");
        window.location.href = "/login";
      }
    });
  }, []);

  async function uploadImage() {
    if (!image) return null;

    const fileName = Date.now() + "_" + image.name;

    const { error } = await supabase.storage
      .from("rooms-images")
      .upload(fileName, image);

    if (error) return null;

    return supabase.storage
      .from("rooms-images")
      .getPublicUrl(fileName).data.publicUrl;
  }

  async function submitRoom(e: React.FormEvent) {
    e.preventDefault();

    const imageUrl = await uploadImage();

    const { error } = await supabase.from("rooms").insert([
      {
        title: form.title,
        location: form.location,
        rent: Number(form.rent),
        property_type: form.property_type,
        tenant_preference: form.tenant_preference,
        contact: form.contact,
        image_url: imageUrl,
      },
    ]);

    if (!error) {
      alert("Room added successfully!");
      window.location.href = "/";
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">➕ Add New Room</h1>

        <form onSubmit={submitRoom} className="space-y-3">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              placeholder={key}
              value={form[key as keyof RoomForm]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          ))}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Add Room
          </button>
        </form>
      </div>
    </div>
  );
}
