import { useState } from "react";
import InteractiveLogo from "./InteractiveLogo";

const LOGO_SOURCES = ["/assets/jobsphere_logo.png", "/jobsphere_logo.png"];

export default function BrandHeader({
  title = "jobSphere",
  caption = "Smart hiring and career hub",
  centered = true,
  largeLogo = false,
  dark = false,
  fixed = false,
  side = "left"
}) {
  const [logoSrcIndex, setLogoSrcIndex] = useState(0);

  const classes = [
    "brand-header-global",
    centered ? "is-centered" : "",
    largeLogo ? "is-large" : "",
    dark ? "is-dark" : "",
    fixed ? "is-fixed" : "",
    side === "right" ? "is-right" : "is-left"
  ]
    .filter(Boolean)
    .join(" ");

  function handleLogoError() {
    setLogoSrcIndex((prev) => Math.min(prev + 1, LOGO_SOURCES.length - 1));
  }

  return (
    <header className={classes}>
      <InteractiveLogo
        src={LOGO_SOURCES[logoSrcIndex]}
        alt="jobSphere logo"
        size={fixed ? "sm" : "md"}
        className="brand-header-logo-wrap"
      />
      <div className="brand-header-text">
        <h1>{title}</h1>
        <p>{caption}</p>
      </div>
      {/* fallback pre-load */}
      <img src={LOGO_SOURCES[logoSrcIndex]} alt="" className="brand-header-logo-fallback" onError={handleLogoError} />
    </header>
  );
}
