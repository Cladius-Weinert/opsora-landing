"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className="heroSceneFallback" aria-hidden="true" />
});

export default function HeroSceneLoader() {
  const [show3d, setShow3d] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 900px)").matches;
    setShow3d(!reduced && !narrow);
  }, []);

  if (!show3d) {
    return <div className="heroSceneFallback" aria-hidden="true" />;
  }

  return (
    <div className="heroSceneWrap" aria-hidden="true">
      <HeroScene />
    </div>
  );
}
