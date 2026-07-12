import * as LocalAuthentication from 'expo-local-authentication';

/** Returns true if the device can and did authenticate biometrically. */
export async function bioAuth(prompt = 'Authenticate to continue'): Promise<boolean> {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return false;
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) return false;
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: prompt,
      fallbackLabel: 'Use PIN',
      disableDeviceFallback: false,
    });
    return result.success;
  } catch {
    return false;
  }
}
