import { useState, useEffect } from "react";

/**
 * EventForm Component
 *
 * Purpose
 * -------
 * Reusable form for creating an event.
 *
 * Behavior
 * --------
 * - Collects: title, description, details, date (YYYY-MM-DD), and an image file.
 * - Shows a live preview for the selected image (Object URL).
 * - On submit:
 *   - Validates and normalizes the date to YYYY-MM-DD.
 *   - Converts the selected image file to a Base64 data URL (if provided) with a small size check.
 *   - Calls onSubmit({ title, description, details, date, imageDataUrl }).
 *
 * Props
 * -----
 * onSubmit : Function
 *   Callback invoked with the normalized payload.
 *
 * Returns
 * -------
 * JSX.Element
 *   A glass-style card form over a full-bleed background image.
 */
export default function EventForm({ onSubmit }) {
  // Controlled inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState(""); // Expected format: "YYYY-MM-DD"

  // File + preview state (keeps UI unchanged)
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Handle file selection and generate an Object URL for preview
  function handleFile(e) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : "");
  }

  // Clean up preview Object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Read a File as Base64 data URL
  const fileToDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // e.g. "data:image/png;base64,...."
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Submit handler: validate inputs, serialize image, and forward payload
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Normalize date: allow "YYYY/MM/DD" or "YYYY.MM.DD" → "YYYY-MM-DD"
    const normalizedDate = (date || "").trim().replace(/[\/.]/g, "-");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
      alert("Please use date format YYYY-MM-DD");
      return;
    }

    // Optional image: convert to Base64 data URL
    let imageDataUrl = "";
    if (imageFile) {
      imageDataUrl = await fileToDataURL(imageFile);

      // Optional guard to avoid very large JSON payloads (~2MB string)
      if (imageDataUrl.length > 2_000_000) {
        alert("Image is too large. Choose a smaller file.");
        return;
      }
    }

    // Call parent with normalized payload
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      details: details.trim(), // backend may ignore this; safe to send
      date: normalizedDate,
      imageDataUrl, // parent will send this as 'image' to the backend
    });
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Full-bleed background image */}
      <img
        src="/imgs/z.jpg"
        alt=""
        className="pointer-events-none select-none absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Glass card form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-xl rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl p-6"
      >
        <div className="space-y-5">
          {/* Title */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium uppercase tracking-wide text-white/80">
              Title :
            </span>
            <input
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-white placeholder-white/60
                         focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              placeholder=""
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          {/* Description */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium uppercase tracking-wide text-white/80">
              Description :
            </span>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-white placeholder-white/60
                         focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              placeholder="Short summary of the event"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          {/* Details */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium uppercase tracking-wide text-white/80">
              Details :
            </span>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-white placeholder-white/60
                         focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              placeholder=""
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </label>

          {/* Date */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium uppercase tracking-wide text-white/80">
              Date (YYYY-MM-DD) :
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{4}-\d{2}-\d{2}"
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-white placeholder-white/60
                         focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              placeholder="YYYY-MM-DD"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          {/* Image uploader + preview */}
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium tracking-wide text-white/80">
                Image:
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="block w-full text-sm text-white/80
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0
                           file:bg-indigo-600 file:text-white
                           hover:file:bg-indigo-700
                           cursor-pointer"
              />
            </label>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-xl border border-white/10"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="inline-block rounded-2xl bg-indigo-700 px-6 py-3 text-sm font-semibold shadow-lg transition text-white hover:bg-indigo-600"
            >
              Create the Event
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
