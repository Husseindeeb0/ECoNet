import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to events page as the main landing page
  redirect("/events");
}
