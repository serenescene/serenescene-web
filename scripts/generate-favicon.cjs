/**
 * Generates public/favicon.ico from public/logo.png when the logo exists
 * and favicon.ico is missing. Run: npm run generate-favicon
 */
const fs = require("fs");
const path = require("path");

async function main() {
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const favPath = path.join(process.cwd(), "public", "favicon.ico");

  if (!fs.existsSync(logoPath)) {
    console.log("generate-favicon: public/logo.png not found; skipping.");
    process.exit(0);
  }

  if (fs.existsSync(favPath)) {
    console.log("generate-favicon: public/favicon.ico already exists; skipping.");
    process.exit(0);
  }

  const sharp = require("sharp");
  const pngToIco = require("png-to-ico");

  const buf32 = await sharp(logoPath).resize(32, 32).png().toBuffer();
  const buf16 = await sharp(logoPath).resize(16, 16).png().toBuffer();
  const ico = await pngToIco([buf32, buf16]);

  fs.writeFileSync(favPath, ico);
  console.log("generate-favicon: wrote public/favicon.ico");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
