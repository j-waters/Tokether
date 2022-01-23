import Gun from "gun";
import "gun/sea";
import "gun/lib/open";

export const db = Gun(["https://tokether-relay.herokuapp.com/gun"]);
