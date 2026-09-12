import { Sleep } from '@zos/sensor';
import { LocalStorage } from '@zos/storage';

let timerId = null;

AppService({
  onInit() {
    const storage = new LocalStorage();
    const sleep = new Sleep();

    const checkSleepSegments = () => {
      try {
        const now = new Date();
        const nowMs = now.getTime();
        const currentStatus = typeof sleep.getSleepingStatus === 'function' ? sleep.getSleepingStatus() : 0;
        const currentSleepStart = storage.getItem('currentSleepStart', 0);

        // 1. Transition: Awake -> Fell Asleep (Start a new segment)
        if (!currentSleepStart && currentStatus === 1) {
          storage.setItem('currentSleepStart', nowMs);
        }

        // 2. Transition: Asleep -> Woke Up (Finalize the segment)
        else if (currentSleepStart > 0 && currentStatus === 0) {
          const durationMins = Math.round((nowMs - currentSleepStart) / (60 * 1000));

          if (durationMins > 0) {
            // Seed with your real Friday night sleep if empty: 8:25 PM - 3:13 AM (408 mins)
            const seedStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20, 25, 0).getTime();
            const seedEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 13, 0).getTime();

            let segments = storage.getItem('savedSegments', [
              { startMs: seedStart, endMs: seedEnd, durationMins: 408 }
            ]);

            // Add this completed segment to the list
            segments.unshift({
              startMs: currentSleepStart,
              endMs: nowMs,
              durationMins: durationMins
            });

            // Keep segments from the last 7 days (prune older ones)
            const cutoff7Days = nowMs - (7 * 24 * 60 * 60 * 1000);
            segments = segments.filter(s => s.endMs >= cutoff7Days);

            storage.setItem('savedSegments', segments);
          }

          // Reset active sleep start (you are now awake)
          storage.setItem('currentSleepStart', 0);
        }
      } catch (err) {
        console.log('[WakeBudget Segment Service] error:', err);
      }
    };

    checkSleepSegments();
    timerId = setInterval(checkSleepSegments, 5 * 60 * 1000);
  },

  onDestroy() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
});