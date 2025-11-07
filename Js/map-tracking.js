// js/map-tracking.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

// NOTE: do NOT initialize app twice. If app already initialized in other module, adjust accordingly.
// To be safe, we create a local app instance here if none exists.
let app;
try {
  // try to reuse global firebase app if exists
  app = initializeApp(firebaseConfig);
} catch (e) {
  // already initialized in another module — it's okay
  app = initializeApp(firebaseConfig);
}

const db = getDatabase(app);

let watchId = null;

/**
 * startTracking
 * @param {String} uid - authenticated user's uid
 * @param {Object} meta - object { name: string, role: string, office: string }
 * @param {Object} opts - optional options { intervalMs: number, highAccuracy: boolean }
 */
export function startTracking(uid, meta = {}, opts = {}) {
  if (!navigator.geolocation) throw new Error("Geolocation not supported");

  if (watchId !== null) return; // already running

  const highAccuracy = opts.highAccuracy === undefined ? true : !!opts.highAccuracy;

  watchId = navigator.geolocation.watchPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const timestamp = new Date().toISOString();

    try {
      await set(ref(db, `locations/${uid}`), {
        uid,
        name: meta.name || null,
        role: meta.role || null,
        office: meta.office || null,
        lat,
        lng,
        accuracy: pos.coords.accuracy || null,
        speed: pos.coords.speed || null,
        timestamp
      });
    } catch (err) {
      console.error("Failed to write location:", err);
    }
  }, (err) => {
    console.error("Geolocation error:", err);
  }, {
    enableHighAccuracy: highAccuracy,
    maximumAge: 3000,
    timeout: 10000
  });

  return watchId;
}

export function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}