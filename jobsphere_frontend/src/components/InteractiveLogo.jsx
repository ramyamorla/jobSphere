import { useMemo, useRef } from "react";

export default function InteractiveLogo({
  src = "/assets/jobsphere_logo.png",
  alt = "jobSphere logo",
  size = "md",
  className = ""
}) {
  const wrapRef = useRef(null);
  const rafRef = useRef(null);

  const sizeClass = useMemo(() => {
    if (size === "lg") return "interactive-logo--lg";
    if (size === "sm") return "interactive-logo--sm";
    return "interactive-logo--md";
  }, [size]);

  function applyTransform(clientX, clientY) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const px = (x / rect.width) * 2 - 1;
    const py = (y / rect.height) * 2 - 1;
    const rotateY = px * 14;
    const rotateX = py * -14;
    el.style.setProperty("--logo-rx", `${rotateX.toFixed(2)}deg`);
    el.style.setProperty("--logo-ry", `${rotateY.toFixed(2)}deg`);
    el.style.setProperty("--logo-glow-x", `${(x / rect.width) * 100}%`);
    el.style.setProperty("--logo-glow-y", `${(y / rect.height) * 100}%`);
  }

  function handleMouseMove(e) {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    const { clientX, clientY } = e;
    rafRef.current = requestAnimationFrame(() => applyTransform(clientX, clientY));
  }

  function resetTransform() {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty("--logo-rx", "0deg");
    el.style.setProperty("--logo-ry", "0deg");
    el.style.setProperty("--logo-glow-x", "50%");
    el.style.setProperty("--logo-glow-y", "50%");
  }

  return (
    <div
      ref={wrapRef}
      className={`interactive-logo ${sizeClass} ${className}`.trim()}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTransform}
    >
      <div className="interactive-logo-orb" />
      <div className="interactive-logo-plate">
        <img src={src} alt={alt} />
      </div>
    </div>
  );
}
