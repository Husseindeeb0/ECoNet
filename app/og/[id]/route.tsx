import { ImageResponse } from "next/og";
import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import { isValidObjectId } from "mongoose";

export const runtime = "nodejs";

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;

    let eventTitle = "Exclusive Event";
    let eventLocation = "Join us on ECoNet";
    let eventDate = "";

    try {
        if (id && isValidObjectId(id)) {
            await connectDb();
            const event = await Event.findById(id);
            if (event) {
                const eventData = event as any;
                eventTitle =
                    eventData.title.length > 50
                        ? eventData.title.slice(0, 50) + "..."
                        : eventData.title;
                eventLocation = eventData.isOnline
                    ? "Online Event"
                    : eventData.location || "Join us on ECoNet";
                if (eventData.startsAt) {
                    eventDate = new Date(eventData.startsAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    });
                }
            }
        }
    } catch (e) {
        console.error("Failed to fetch event for OG image:", e);
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    backgroundColor: "#0f0518",
                    backgroundImage: "linear-gradient(to bottom right, #0f0518, #2e1065)",
                    fontFamily: "sans-serif",
                    padding: "60px",
                    border: "20px solid #1a0b2e",
                }}
            >
                {/* Background Accent */}
                <div
                    style={{
                        position: "absolute",
                        right: "-100px",
                        top: "-100px",
                        width: "600px",
                        height: "600px",
                        background:
                            "radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(0,0,0,0) 70%)",
                        borderRadius: "50%",
                        filter: "blur(60px)",
                    }}
                />

                {/* Top: Brand */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        borderBottom: "2px solid #a855f7",
                        paddingBottom: "10px",
                        marginBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "#a855f7",
                            display: "flex",
                        }}
                    ></div>
                    <span
                        style={{
                            fontSize: 30,
                            fontWeight: "bold",
                            color: "#f3e8ff",
                            letterSpacing: "0.05em",
                        }}
                    >
                        ECoNet
                    </span>
                </div>

                {/* Center: Title */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        zIndex: 10,
                        flexGrow: 1,
                        justifyContent: "center",
                    }}
                >
                    {eventDate && (
                        <div
                            style={{
                                fontSize: 32,
                                color: "#a855f7",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            {eventDate}
                        </div>
                    )}

                    <div
                        style={{
                            fontSize: eventTitle.length > 30 ? 70 : 90,
                            fontWeight: 900,
                            color: "white",
                            lineHeight: 1.1,
                            textShadow: "0 0 30px rgba(168,85,247,0.5)",
                        }}
                    >
                        {eventTitle}
                    </div>

                    <div
                        style={{
                            fontSize: 36,
                            color: "#d8b4fe",
                            marginTop: 10,
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        📍 {eventLocation}
                    </div>
                </div>

                {/* Bottom: CTA */}
                <div
                    style={{
                        display: "flex",
                        marginTop: "auto",
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "15px 40px",
                        fontSize: 30,
                        borderRadius: "50px",
                        fontWeight: "bold",
                        boxShadow: "0 0 20px rgba(168,85,247,0.6)",
                    }}
                >
                    Get Tickets Now
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
