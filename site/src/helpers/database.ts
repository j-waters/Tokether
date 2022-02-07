import Gun from "gun";
import "gun/sea";
import "gun/lib/open";
import "gun/lib/load";
import { TikTokVideo } from "@tokether/common";

interface StoredAppState {
  rooms: Record<string, StoredRoomRoot>;
}

export interface StoredRoomRoot {
  state: StoredRoomState;
  playlist: Record<string, StoredPlaylistItem>;
  player: StoredPlayerState;
  users: Record<string, StoredUser | null>;
}

export interface StoredUser {
  lastUpdate: string;
  joinTime: string;
  loaded?: string;
  username: string | null;
  hasExtension: boolean;
  userId: string;
}

export interface StoredPlayerState {
  playing: boolean;
}

export interface StoredRoomState {
  currentItemId: string | undefined;
}

export interface StoredPlaylistItem {
  fullInfo?: TikTokVideo;
  url: string;
}

export const db = Gun<StoredAppState>({
  peers: ["https://tokether-relay.herokuapp.com/gun"],
});

db.open!((data) => console.log("Update data:", data));
