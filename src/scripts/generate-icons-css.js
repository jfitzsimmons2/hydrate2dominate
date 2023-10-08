import { readFile, writeFile } from "node:fs/promises";
import { getIconsCSS } from "@iconify/utils";
import { locate } from "@iconify/json";

import prime from "@iconify/json/json/prime.json" assert { type: "json" };
console.log(prime);
Object.keys(prime.icons);
/**
 * List of icons. Key is icon set prefix, value is array of icons
 *
 * @type {Record<string, string[]>}
 */
const icons = {
  prime: Object.keys(prime.icons),
  "line-md": [
    "moon-rising-filled-alt-loop",
    "moon-filled-to-sunny-filled-loop-transition",
  ],
};

// Parse each icon set
let code = "";
for (const prefix in icons) {
  // Find location of .json file
  const filename = locate(prefix);

  // Load file and parse it
  /** @type {import("@iconify/types").IconifyJSON} */
  const iconSet = JSON.parse(await readFile(filename, "utf8"));
  console.log(icons);
  // Get CSS
  const css = getIconsCSS(iconSet, icons[prefix], {
    iconSelector: prefix === "prime" ? ".pi-{name}" : ".{prefix}-{name}",
    commonSelector: prefix === "prime" ? ".pi" : ".{prefix}",
    overrideSelector:
      prefix === "prime" ? ".pi.pi-{name}" : ".{prefix}.{prefix}-{name}",
  });

  // Add it to code
  code += css;
}

// Save CSS file
await writeFile("src/icons.css", code, "utf8");
console.log(`Saved CSS (${code.length} bytes)`);
