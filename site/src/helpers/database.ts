import Gun from "gun";
import "gun/sea";
import "gun/lib/open";
import "gun/lib/load";

export const db = Gun(["https://tokether-relay.herokuapp.com/gun"]);
