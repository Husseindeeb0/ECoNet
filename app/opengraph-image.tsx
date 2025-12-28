/* Code for Root Open Graph Image */
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ECoNet - Connecting Communities";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#0f0518", // Dark purple/black background
                    backgroundImage:
                        "linear-gradient(to bottom right, #0f0518, #1a0b2e, #0f0518)",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Neon Grid Effect (Simplified) */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage:
                            "linear-gradient(#2d1b4e 1px, transparent 1px), linear-gradient(90deg, #2d1b4e 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                        opacity: 0.2,
                    }}
                />

                {/* Outer Glow Circle */}
                <div
                    style={{
                        position: "absolute",
                        width: "600px",
                        height: "600px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(15,5,24,0) 70%)",
                        filter: "blur(40px)",
                    }}
                />

                {/* Main Title */}
                <div
                    style={{
                        display: "flex",
                        fontSize: 130,
                        fontWeight: "bold",
                        color: "white",
                        textShadow: "0 0 20px #a855f7, 0 0 40px #a855f7",
                        letterSpacing: "-0.05em",
                        zIndex: 10,
                    }}
                >
                    ECoNet
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        display: "flex",
                        fontSize: 40,
                        color: "#d8b4fe",
                        marginTop: 20,
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        zIndex: 10,
                        textAlign: "center",
                    }}
                >
                    Event Connect Network
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
