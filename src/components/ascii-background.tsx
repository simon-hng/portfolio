"use client";

import { useEffect, useState } from "react";

const ASCII_CHARS = " .:-=+*#%@";

// Generate a procedural ASCII pattern that creates an interesting visual texture
function generateAsciiPattern(width: number, height: number): string {
  const lines: string[] = [];
  
  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      // Create a wave-like pattern with some noise
      const wave1 = Math.sin(x * 0.05 + y * 0.03) * 0.5 + 0.5;
      const wave2 = Math.sin(x * 0.03 - y * 0.05) * 0.5 + 0.5;
      const wave3 = Math.sin((x + y) * 0.02) * 0.5 + 0.5;
      
      // Add some pseudo-random noise
      const noise = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const noiseValue = (noise - Math.floor(noise)) * 0.3;
      
      // Combine waves and noise
      const value = (wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.3 + noiseValue) / 1.3;
      
      // Map to ASCII character
      const charIndex = Math.floor(value * (ASCII_CHARS.length - 1));
      line += ASCII_CHARS[Math.max(0, Math.min(charIndex, ASCII_CHARS.length - 1))];
    }
    lines.push(line);
  }
  
  return lines.join("\n");
}

export function AsciiBackground() {
  const [pattern, setPattern] = useState<string>("");
  const [dimensions, setDimensions] = useState({ width: 200, height: 80 });

  useEffect(() => {
    // Calculate dimensions based on viewport
    const updateDimensions = () => {
      const charWidth = 8; // approximate monospace char width
      const charHeight = 16; // approximate monospace char height
      const width = Math.ceil(window.innerWidth / charWidth) + 20;
      const height = Math.ceil(window.innerHeight / charHeight) + 10;
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    setPattern(generateAsciiPattern(dimensions.width, dimensions.height));
  }, [dimensions]);

  return (
    <div className="ascii-background" aria-hidden="true">
      <pre className="ascii-content">{pattern}</pre>
    </div>
  );
}

