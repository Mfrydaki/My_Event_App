import { useEffect, useMemo, useState } from "react";

/**
 * Typewriter Component
 *
 * Purpose
 * -------
 * Animate text with a typewriter effect, character by character.
 *
 * Behavior
 * --------
 * - Accepts a single string or an array of strings.
 * - If given an array and `loop = true`, it cycles through all phrases
 *   (typing, pausing, deleting, and moving to the next).
 * - Shows an optional caret (blinking cursor).
 *
 * Props
 * -----
 * text : string | string[]
 *   Text or array of phrases to type.
 * speed : number
 *   Typing speed in ms per character (default: 70).
 * deleteSpeed : number
 *   Deletion speed in ms per character (default: 40).
 * pause : number
 *   Pause duration in ms after finishing a phrase (default: 1200).
 * loop : boolean
 *   If true and multiple texts are given, cycles through them (default: false).
 * caret : boolean
 *   Whether to show a blinking caret (default: true).
 * className : string
 *   Additional Tailwind classes for styling.
 *
 * State
 * -----
 * i : number
 *   Current index in the texts array.
 * out : string
 *   Current displayed substring.
 * del : boolean
 *   Whether the component is currently deleting text.
 *
 * Returns
 * -------
 * JSX.Element | null
 *   The animated typewriter text, with optional caret.
 */
export default function Typewriter({
  text,
  speed = 70,
  deleteSpeed = 40,
  pause = 1200,
  loop = false,
  caret = true,
  className = "",
}) {
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const [i, setI] = useState(0); // index of current phrase
  const [out, setOut] = useState(""); // displayed substring
  const [del, setDel] = useState(false); // deleting mode

  useEffect(() => {
    if (!texts.length || typeof texts[i] !== "string") return;
    const target = texts[i];
    let t;

    if (!del && out.length < target.length) {
      // Typing characters
      t = setTimeout(() => setOut(target.slice(0, out.length + 1)), speed);
    } else if (!del && out.length === target.length) {
      // Finished typing a phrase
      if (loop && texts.length > 1) {
        t = setTimeout(() => setDel(true), pause);
      }
    } else if (del && out.length > 0) {
      // Deleting characters
      t = setTimeout(
        () => setOut(target.slice(0, out.length - 1)),
        deleteSpeed
      );
    } else if (del && out.length === 0) {
      // Move to the next phrase
      setDel(false);
      setI((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(t);
  }, [out, del, i, texts, speed, deleteSpeed, pause, loop]);

  // Reset state when text prop changes
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
