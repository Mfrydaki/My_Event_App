import { useEffect, useState } from "react";

/**
 * EventForm Component
 *
 * Purpose
 * -------
 * A polished, reusable form for creating or editing events.
 *
 * Behavior
 * --------
 * - Collects input fields: title, description, details, date (text), image file.
 * - Displays a live preview for the uploaded image.
 * - On submit, calls onSubmit(payload) with normalized data.
 *
 * Props
 * -----
 * onSubmit : Function
 *   Callback invoked with event data:
 *   { title, description, details, date (ISO string or null), imageFile }
 *
 * Returns
 * -------
 * JSX.Element
 *   A glass-style card on top of a full-bleed background image.
 */
export default function EventForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState(""); // "YYYY-MM-DD"
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  
  /**
   * handleFile
   *
   * Read the chosen file and show a preview.
   *
   * Parameters
   * ----------
   * e : React.ChangeEvent<HTMLInputElement>
   */
  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  /**
   * handleSubmit
   *
   * Build the payload and forward it to the parent.
   *
   * Parameters
   * ----------
   * e : React.FormEvent<HTMLFormElement>
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: title.trim(),
      description: description.trim(),
      details: details.trim(),
      // Convert "YYYY-MM-DD" (no calendar) to ISO for the backend
      date: date ? new Date(date).toISOString() : null,
      imageFile,
    };

    await onSubmit?.(payload);
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Full-bleed background image */}
      <img
        src="/imgs/z.jpg" // βεβαιώσου ότι υπάρχει στο public/imgs/z.jpg
        alt=""
        className="pointer-events-none select-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Soft dark overlay so the form pops */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Glass card */}
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

          {/* Date (text, no native calendar) */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium uppercase tracking-wide text-white/80">
              Date (YYYY-MM-DD) :
            </span>
            <input
              type="text" // no calendar
              lang="en"
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
