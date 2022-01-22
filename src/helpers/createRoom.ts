import router from "@/router";

function generateId(len: number): string {
  const arr = new Uint8Array(len / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join("");
}

export default async function createRoom() {
  const roomId = generateId(8);
  await router.push({ name: "Room", params: { id: roomId } });
}
