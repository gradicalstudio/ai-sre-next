import { create } from "zustand";

// Single source of truth for which Events tab ("upcoming" | "past") is
// active. Replaces the previous window CustomEvent("tabchange") bridge and
// prop-drilled onTabChange/activeEventTab between HeaderClient, NavDropdown,
// and Events.jsx — all three now just read/write this store directly.
export const useEventsStore = create((set) => ({
  activeTab: "upcoming",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));