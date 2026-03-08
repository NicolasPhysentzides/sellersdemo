import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default async function Icon() {
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logoBuffer = await fs.readFile(logoPath);
  const logoDataUrl = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "transparent",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <img
          alt="Aura Services"
          src={logoDataUrl}
          style={{
            height: "82px",
            width: "82px",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
