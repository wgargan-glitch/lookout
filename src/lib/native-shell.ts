type CapacitorBridge = {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
};

function capacitor(): CapacitorBridge | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { Capacitor?: CapacitorBridge }).Capacitor;
}

/** True inside the iOS or Android store wrap (Capacitor WebView / TWA). */
export function isNativeShell() {
  try {
    return Boolean(capacitor()?.isNativePlatform?.());
  } catch {
    return false;
  }
}

export function nativePlatform(): "ios" | "android" | "web" {
  const cap = capacitor();
  if (!cap?.isNativePlatform?.()) return "web";
  const platform = cap.getPlatform?.();
  if (platform === "ios") return "ios";
  if (platform === "android") return "android";
  return "web";
}

/**
 * Apple 4.8: if the iOS app offers a third-party social login, it must also
 * offer Sign in with Apple. Lookout's broker does not include Apple, so the
 * iOS store wrap uses email and password only.
 */
export function hideSocialLogins() {
  return nativePlatform() === "ios";
}
