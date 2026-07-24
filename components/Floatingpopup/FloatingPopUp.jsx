import { createClient } from "@/prismicio";
import FloatingPopupClient from "./FloatingPopUpClient";

export default async function FloatingPopup() {
  const client = createClient();
  const homepage = await client.getSingle("home_page").catch(() => null);

  if (!homepage?.data.floating_popup) return null;

  const eventsSlice = homepage?.data.slices?.find(
    (s) => s.slice_type === "events",
  );
  const events = eventsSlice?.primary.events ?? [];
 const now = new Date();

const popups = events
  .filter((item) => {
    if (!item.floating_popup) return false;
    const rawDateTime = item.event_datetime;
    if (!rawDateTime) return false;
    const eventDate = new Date(rawDateTime);
    return eventDate >= now;
  })
    .map((item) => ({
      image: item.icon,
      title: item.title,
      popup_link: item.cta_button,
    }));

  if (popups.length === 0) return null;

  return <FloatingPopupClient popups={popups} />;
}
