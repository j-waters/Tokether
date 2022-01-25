import { isRef, watch, WatchOptions, WatchSource } from "vue";

/**
Waits until the given
 */
export function waitForTrue(
  source: WatchSource<boolean>,
  options?: WatchOptions
) {
  return new Promise<void>((resolve) => {
    let hasRun = false;
    const stopWatch = watch(
      source,
      (value, oldValue, onCleanup) => {
        if (value) {
          if (hasRun) {
            stopWatch();
          }
          resolve();
        }
        hasRun = true;
      },
      { ...options, immediate: true }
    );
  });
}
