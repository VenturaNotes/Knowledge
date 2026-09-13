import { Sleep } from '@zos/sensor';
import { LocalStorage } from '@zos/storage';

let timerId = null;
let midnightTimerIds = [];

function computeSegmentsUpdate(sleep, storage) {
  sleep.updateInfo();

  const sleepInfo = sleep.getInfo();
  const naps = sleep.getNap() || [];

  const now = new Date();
  const nowMs = now.getTime();

  let segments = storage.getItem('savedSegments', []);
  const segmentsBeforeCount = segments.length;
  let updated = false;

  // A. Night Sleep
  if (sleepInfo && typeof sleepInfo.endTime === 'number' && sleepInfo.endTime > 0 && sleepInfo.totalTime > 0) {
    const wakeDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      Math.floor(sleepInfo.endTime / 60),
      sleepInfo.endTime % 60,
      0
    );
    let wakeMs = wakeDate.getTime();
    if (wakeMs > nowMs) wakeMs -= 24 * 60 * 60 * 1000;

    const exists = segments.some(s => Math.abs(s.endMs - wakeMs) < 20 * 60 * 1000);
    if (!exists) {
      segments.push({
        startMs: wakeMs - (sleepInfo.totalTime * 60 * 1000),
        endMs: wakeMs,
        durationMins: sleepInfo.totalTime
      });
      updated = true;
    }
  }

  // B. Daytime Naps
  if (Array.isArray(naps) && naps.length > 0) {
    naps.forEach(nap => {
      const napStop = nap.stop;
      const napDuration = nap.length || (nap.stop - nap.start) || 0;

      if (napStop > 0 && napDuration > 0) {
        const wakeDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          Math.floor(napStop / 60),
          napStop % 60,
          0
        );
        let wakeMs = wakeDate.getTime();
        if (wakeMs > nowMs) wakeMs -= 24 * 60 * 60 * 1000;

        const exists = segments.some(s => Math.abs(s.endMs - wakeMs) < 20 * 60 * 1000);
        if (!exists) {
          segments.push({
            startMs: wakeMs - (napDuration * 60 * 1000),
            endMs: wakeMs,
            durationMins: napDuration
          });
          updated = true;
        }
      }
    });
  }

  if (updated) {
    segments.sort((a, b) => b.endMs - a.endMs);
    const cutoff7Days = nowMs - (7 * 24 * 60 * 60 * 1000);
    segments = segments.filter(s => s.endMs >= cutoff7Days);
    storage.setItem('savedSegments', segments);
  }

  return {
    sleepInfo,
    naps,
    segmentsBeforeCount,
    segmentsAfterCount: segments.length
  };
}

function logHeartbeat(storage, source, sleepInfo, naps, segBefore, segAfter) {
  try {
    const debugLog = storage.getItem('debugLog', []);
    debugLog.push({
      t: Date.now(),
      source: source,
      sleepEnd: sleepInfo && sleepInfo.endTime > 0 ? sleepInfo.endTime : null,
      sleepTotal: sleepInfo && sleepInfo.totalTime > 0 ? sleepInfo.totalTime : null,
      napCount: naps.length,
      segBefore,
      segAfter
    });
    storage.setItem('debugLog', debugLog.slice(-100));
  } catch (e) {
    console.log('[debugLog write error]', e);
  }
}

AppService({
  onInit() {
    const storage = new LocalStorage();
    const sleep = new Sleep();

    const scanSensors = () => {
      try {
        const { sleepInfo, naps, segmentsBeforeCount, segmentsAfterCount } =
          computeSegmentsUpdate(sleep, storage);
        logHeartbeat(storage, 'service', sleepInfo, naps, segmentsBeforeCount, segmentsAfterCount);
      } catch (err) {
        console.log('[BgService Sensor Scan Error]:', err);
      }
    };

    const scheduleMidnightSweeps = () => {
      midnightTimerIds.forEach(id => clearTimeout(id));
      midnightTimerIds = [];

      const now = new Date();
      const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const offsetsSec = [
        23 * 3600 + 59 * 60 + 0,  // 11:59:00 PM
        23 * 3600 + 59 * 60 + 30, // 11:59:30 PM
        23 * 3600 + 59 * 60 + 50  // 11:59:50 PM
      ];

      offsetsSec.forEach(sec => {
        let target = base.getTime() + sec * 1000;
        if (target <= now.getTime()) target += 24 * 60 * 60 * 1000;
        const id = setTimeout(scanSensors, target - now.getTime());
        midnightTimerIds.push(id);
      });

      const lastTarget = base.getTime() + offsetsSec[offsetsSec.length - 1] * 1000;
      const nextBaseTarget = lastTarget <= now.getTime() ? lastTarget + 24 * 60 * 60 * 1000 : lastTarget;
      const rescheduleId = setTimeout(scheduleMidnightSweeps, (nextBaseTarget - now.getTime()) + 1000);
      midnightTimerIds.push(rescheduleId);
    };

    scanSensors();
    timerId = setInterval(scanSensors, 5 * 60 * 1000);
    scheduleMidnightSweeps();
  },

  onDestroy() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    midnightTimerIds.forEach(id => clearTimeout(id));
    midnightTimerIds = [];
  }
});