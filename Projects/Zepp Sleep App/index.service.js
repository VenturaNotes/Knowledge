import { Sleep } from '@zos/sensor';
import { LocalStorage } from '@zos/storage';

let timerId = null;

AppService({
  onInit() {
    const storage = new LocalStorage();
    let wasSleeping = storage.getItem('bgWasSleeping', false);

    const checkSleepState = () => {
      try {
        const sleep = new Sleep();
        sleep.updateInfo();

        const now = new Date();
        const nowMs = now.getTime();
        const todayStr = `${now.getMonth() + 1}/${now.getDate()}`;

        // 1. Check real-time sleep transition (1 = sleeping, 0 = awake)
        const currentStatus = typeof sleep.getSleepingStatus === 'function' ? sleep.getSleepingStatus() : 0;

        // Transition: was sleeping -> now awake!
        if (wasSleeping && currentStatus === 0) {
          storage.setItem('savedWakeTimestamp', nowMs);
          wasSleeping = false;
          storage.setItem('bgWasSleeping', false);
        } else if (currentStatus === 1) {
          wasSleeping = true;
          storage.setItem('bgWasSleeping', true);
        }

        // 2. Check finalized sleep sessions (Night Sleep & Naps)
        let wakeMins = null;
        let durationMins = 0;

        const sleepInfo = sleep.getInfo();
        if (sleepInfo && typeof sleepInfo.endTime === 'number' && sleepInfo.endTime > 0) {
          wakeMins = sleepInfo.endTime;
          durationMins = sleepInfo.totalTime || 0;
        }

        const naps = sleep.getNap();
        if (Array.isArray(naps) && naps.length > 0) {
          const latestNap = naps[naps.length - 1];
          if (latestNap && typeof latestNap.stop === 'number' && latestNap.stop > (wakeMins || 0)) {
            wakeMins = latestNap.stop;
            durationMins = latestNap.length || (latestNap.stop - latestNap.start) || 0;
          }
        }

        if (wakeMins !== null) {
          const wakeDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            Math.floor(wakeMins / 60),
            wakeMins % 60,
            0
          );
          const wakeMs = Math.min(wakeDate.getTime(), nowMs);

          const storedWake = storage.getItem('savedWakeTimestamp', 0);
          if (wakeMs > storedWake) {
            storage.setItem('savedWakeTimestamp', wakeMs);

            if (durationMins > 0) {
              storage.setItem('savedSleepDuration', durationMins);

              let history = storage.getItem('savedSleepHistory', [
                { date: '9/10', durationMins: 496 }
              ]);

              const existingIdx = history.findIndex(item => item.date === todayStr);
              if (existingIdx !== -1) {
                history[existingIdx].durationMins = durationMins;
              } else {
                history.unshift({ date: todayStr, durationMins: durationMins });
              }
              storage.setItem('savedSleepHistory', history.slice(0, 7));
            }
          }
        }
      } catch (err) {
        console.log('[WakeBudget BgService] error:', err);
      }
    };

    // Run check immediately on start
    checkSleepState();

    // Run check every 5 minutes in background
    timerId = setInterval(checkSleepState, 5 * 60 * 1000);
  },

  onDestroy() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
});