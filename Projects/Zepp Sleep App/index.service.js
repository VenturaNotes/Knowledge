import { Sleep } from '@zos/sensor';
import { LocalStorage } from '@zos/storage';

let timerId = null;

AppService({
  onInit() {
    const storage = new LocalStorage();
    const sleep = new Sleep();

    const checkSleepState = () => {
      try {
        const now = new Date();
        const nowMs = now.getTime();
        const currentStatus = typeof sleep.getSleepingStatus === 'function' ? sleep.getSleepingStatus() : 0;
        const wasSleeping = storage.getItem('bgWasSleeping', false);

        // 1. Transition: Awake -> Fell Asleep (0 -> 1)
        if (!wasSleeping && currentStatus === 1) {
          storage.setItem('bgWasSleeping', true);
          storage.setItem('sleepStartTimestamp', nowMs);
        }

        // 2. Transition: Asleep -> Woke Up (1 -> 0)
        else if (wasSleeping && currentStatus === 0) {
          storage.setItem('bgWasSleeping', false);
          storage.setItem('savedWakeTimestamp', nowMs);

          // Calculate sleep duration from real elapsed time
          const startMs = storage.getItem('sleepStartTimestamp', 0);
          let durationMins = 0;
          if (startMs > 0 && nowMs > startMs) {
            durationMins = Math.round((nowMs - startMs) / (60 * 1000));
          }

          if (durationMins > 0) {
            // A. Update Recent Sessions for Rolling 24h Calculation
            const yesterday521PM = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 17, 21, 0).getTime();
            let sessions = storage.getItem('savedSleepSessions', [
              { wakeTimestamp: yesterday521PM, durationMins: 496 }
            ]);

            sessions.unshift({ wakeTimestamp: nowMs, durationMins: durationMins });

            // Keep sessions from the last 48 hours
            const cutoff48h = nowMs - (48 * 60 * 60 * 1000);
            sessions = sessions.filter(s => s.wakeTimestamp >= cutoff48h).slice(0, 15);
            storage.setItem('savedSleepSessions', sessions);

            // B. Calculate TRUE Rolling 24h Sleep (past 24h from this wake-up)
            const cutoff24h = nowMs - (24 * 60 * 60 * 1000);
            const rolling24hMins = sessions
              .filter(s => s.wakeTimestamp >= cutoff24h && s.wakeTimestamp <= nowMs)
              .reduce((sum, s) => sum + s.durationMins, 0);

            storage.setItem('savedRollingSleepDuration', rolling24hMins);

            // C. Update Calendar Date Log (Second Screen, as-is)
            const wakeDate = new Date(nowMs);
            const dateStr = `${wakeDate.getMonth() + 1}/${wakeDate.getDate()}`;
            let history = storage.getItem('savedSleepHistory', [
              { date: '9/10', durationMins: 496 }
            ]);

            const existingIdx = history.findIndex(item => item.date === dateStr);
            if (existingIdx !== -1) {
              history[existingIdx].durationMins += durationMins;
            } else {
              history.unshift({ date: dateStr, durationMins: durationMins });
            }
            storage.setItem('savedSleepHistory', history.slice(0, 7));
          }
        }
      } catch (err) {
        console.log('[WakeBudget BgService] error:', err);
      }
    };

    // Check immediately on start, then every 5 minutes
    checkSleepState();
    timerId = setInterval(checkSleepState, 5 * 60 * 1000);
  },

  onDestroy() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
});