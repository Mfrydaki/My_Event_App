// src/components/Typewriter.jsx
import { useEffect, useMemo, useState } from "react";

/**
 * Typewriter
 * - Γράφει κείμενο χαρακτήρα–χαρακτήρα.
 * - Δέχεται string ή array από strings (με loop optional).
 */
export default function Typewriter({
  text, // string ή string[]
  speed = 60, // ms ανά χαρακτήρα (πληκτρολόγηση)
  deleteSpeed = 40, // ms ανά χαρακτήρα (διαγραφή, αν loop)
  pause = 1200, // παύση όταν ολοκληρωθεί μια φράση (αν loop)
  loop = false, // αν true και δώσεις array -> εναλλάσσει φράσεις
  caret = true, // εμφάνιση του caret
  className = "", // επιπλέον κλάσεις
}) {
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const [i, setI] = useState(0); // index τρέχουσας φράσης
  const [out, setOut] = useState(""); // εμφανιζόμενο κείμενο
  const [del, setDel] = useState(false); // αν διαγράφει

  useEffect(() => {
    if (!texts.length || typeof texts[i] !== "string") return;
    const target = texts[i];
    let t;

    if (!del && out.length < target.length) {
      // πληκτρολόγηση
      t = setTimeout(() => setOut(target.slice(0, out.length + 1)), speed);
    } else if (!del && out.length === target.length) {
      // τέλους φράσης
      if (loop && texts.length > 1) {
        t = setTimeout(() => setDel(true), pause);
      }
    } else if (del && out.length > 0) {
      // διαγραφή
      t = setTimeout(
        () => setOut(target.slice(0, out.length - 1)),
        deleteSpeed
      );
    } else if (del && out.length === 0) {
      // επόμενη φράση
      setDel(false);
      setI((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(t);
  }, [out, del, i, texts, speed, deleteSpeed, pause, loop]);

  // επανεκκίνηση όταν αλλάζει το input text
  useEffect(() => {
    setI(0);
    setOut("");
    setDel(false);
  }, [texts]);

  if (!texts.length) return null;

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{out}</span>
      {caret && (
        <span
          aria-hidden
          className="ml-1 inline-block h-[1em] w-[2px] bg-white animate-pulse"
        />
      )}
    </span>
  );
}
