import { createWidget, widget, align, prop } from '@zos/ui';
import { Sleep } from '@zos/sensor';
import { LocalStorage } from '@zos/storage';
import * as appService from '@zos/app-service';

function formatTime12(dateObj) {
  const h24 = dateObj.getHours();
  const m = dateObj.getMinutes();
  const isPM = h24 >= 12;
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
}

function formatMinutesSinceMidnight(mins) {
  if (typeof mins !== 'number') return '-';
  const d = new Date();
  d.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
  return formatTime12(d);
}

Page({
  build() {
    const storage = new LocalStorage();
    const now = new Date();
    const nowMs = now.getTime();

    // 1. Start background service and log the exact result code to Debug Log
    try {
      if (appService && typeof appService.start === 'function') {
        const startRes = appService.start({
          file: 'service/index.service',
          complete_func: (opt) => {
            try {
              const dLog = storage.getItem('debugLog', []);
              dLog.push({
                t: Date.now(),
                source: 'init',
                line: `srv_cb: ${opt.result === 0 ? 'OK' : 'err_' + opt.result}`
              });
              storage.setItem('debugLog', dLog.slice(-100));
            } catch (e) {}
          }
        });

        // If start returns an immediate code, log it
        if (typeof startRes === 'number') {
          const dLog = storage.getItem('debugLog', []);
          dLog.push({
            t: nowMs,
            source: 'init',
            line: `srv_start: ${startRes === 0 ? 'OK' : 'err_' + startRes}`
          });
          storage.setItem('debugLog', dLog.slice(-100));
        }
      }
    } catch (e) {
      console.log('AppService start error:', e);
    }

    let segments = storage.getItem('savedSegments', []);
    const segmentsBeforeCount = segments.length;

    let sleepInfo = null;
    let naps = [];

    // 2. Live sensor read
    try {
      const sleep = new Sleep();
      sleep.updateInfo();

      sleepInfo = sleep.getInfo();
      naps = sleep.getNap() || [];

      let hasNewData = false;

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
          hasNewData = true;
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
              hasNewData = true;
            }
          }
        });
      }

      segments.sort((a, b) => b.endMs - a.endMs);
      const cutoff7Days = nowMs - (7 * 24 * 60 * 60 * 1000);
      segments = segments.filter(s => s.endMs >= cutoff7Days);

      if (hasNewData || segments.length > 0) {
        storage.setItem('savedSegments', segments);
      }
    } catch (err) {
      console.log('Live sensor read error:', err);
    }

    // 3. Log Page-Side Heartbeat
    try {
      const debugLog = storage.getItem('debugLog', []);
      debugLog.push({
        t: nowMs,
        source: 'page',
        sleepEnd: sleepInfo && sleepInfo.endTime > 0 ? sleepInfo.endTime : null,
        sleepTotal: sleepInfo && sleepInfo.totalTime > 0 ? sleepInfo.totalTime : null,
        napCount: naps ? naps.length : 0,
        segBefore: segmentsBeforeCount,
        segAfter: segments.length
      });
      storage.setItem('debugLog', debugLog.slice(-100));
    } catch (e) {}

    // Fallback if brand new install
    if (segments.length === 0) {
      const defaultEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 4, 0).getTime();
      segments = [{
        startMs: defaultEnd - (320 * 60 * 1000),
        endMs: defaultEnd,
        durationMins: 320
      }];
    }

    // 4. Latest Wake Time
    const latestSegment = segments[0];
    const latestWakeMs = latestSegment.endMs;

    const AWAKE_BUDGET_MS = 17 * 60 * 60 * 1000;
    const msAwake = Math.max(0, nowMs - latestWakeMs);
    const msRemaining = AWAKE_BUDGET_MS - msAwake;

    const bedDate = new Date(latestWakeMs + AWAKE_BUDGET_MS);
    const bedTimeFormatted = formatTime12(bedDate);

    const wakeDateObj = new Date(latestWakeMs);
    const wakeFormatted = formatTime12(wakeDateObj);

    // 5. True Rolling 24-Hour Total Sleep
    const cutoff24h = latestWakeMs - (24 * 60 * 60 * 1000);
    const rollingSleepMins = segments
      .filter(s => s.endMs >= cutoff24h && s.endMs <= latestWakeMs)
      .reduce((sum, s) => sum + s.durationMins, 0);

    const sleepHours = Math.floor(rollingSleepMins / 60);
    const sleepMins = rollingSleepMins % 60;

    let sleepColor = 0x00FF88;
    if (rollingSleepMins < 300) {
      sleepColor = 0xFF4444;
    } else if (rollingSleepMins < 420) {
      sleepColor = 0xFFCC00;
    }

    // 6. Daily Sleep Log Grouping
    const dailyMap = {};
    segments.forEach(s => {
      const d = new Date(s.endMs);
      const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + s.durationMins;
    });

    const dailyLogList = Object.keys(dailyMap).map(dateStr => ({
      date: dateStr,
      durationMins: dailyMap[dateStr]
    }));

    // 7. Debug Log Entries
    const debugLog = storage.getItem('debugLog', []);
    const recentEntries = [...debugLog].reverse().slice(0, 9);

    // --- MAIN DASHBOARD WIDGETS ---
    const mainWidgets = [];

    mainWidgets.push(createWidget(widget.TEXT, {
      x: 0,
      y: 42,
      w: 320,
      h: 22,
      text: 'AWAKE BUDGET',
      color: 0x888888,
      text_size: 14,
      align_h: align.CENTER_H
    }));

    let mainColor = 0x00FF88;
    let statusText = '';
    const totalMinsRemaining = Math.floor(Math.abs(msRemaining) / (60 * 1000));
    const remHours = Math.floor(totalMinsRemaining / 60);
    const remMins = totalMinsRemaining % 60;

    if (msRemaining > 0) {
      statusText = `${remHours}h ${remMins}m`;
    } else {
      mainColor = 0xFF4444;
      statusText = `+${remHours}h ${remMins}m`;
    }

    mainWidgets.push(createWidget(widget.TEXT, {
      x: 0,
      y: 65,
      w: 320,
      h: 55,
      text: statusText,
      text_size: 46,
      color: mainColor,
      align_h: align.CENTER_H
    }));

    mainWidgets.push(createWidget(widget.TEXT, {
      x: 0,
      y: 122,
      w: 320,
      h: 20,
      text: msRemaining > 0 ? 'time remaining' : 'overdue',
      text_size: 13,
      color: 0x777777,
      align_h: align.CENTER_H
    }));

    // Bedtime Card
    mainWidgets.push(createWidget(widget.TEXT, {
      x: 0,
      y: 152,
      w: 320,
      h: 30,
      text: `Bed latest: ${bedTimeFormatted}`,
      text_size: 22,
      color: 0xFFFFFF,
      align_h: align.CENTER_H
    }));

    // Time Awake & Wake Time
    const totalMinsAwake = Math.floor(msAwake / (60 * 1000));
    const awakeHours = Math.floor(totalMinsAwake / 60);
    const awakeMins = totalMinsAwake % 60;

    mainWidgets.push(createWidget(widget.TEXT, {
      x: 0,
      y: 190,
      w: 320,
      h: 28,
      text: `Awake ${awakeHours}h ${awakeMins}m (Woke ${wakeFormatted})`,
      text_size: 16,
      color: 0xCCCCCC,
      align_h: align.CENTER_H
    }));

    // 24h Sleep Indicator
    mainWidgets.push(createWidget(widget.TEXT, {
      x: 0,
      y: 226,
      w: 320,
      h: 30,
      text: `24h Sleep: ${sleepHours}h ${sleepMins}m`,
      text_size: 18,
      color: sleepColor,
      align_h: align.CENTER_H
    }));

    // --- SLEEP HISTORY OVERLAY WIDGETS ---
    const historyWidgets = [];

    const historyBg = createWidget(widget.FILL_RECT, {
      x: 0, y: 0, w: 320, h: 380, color: 0x000000
    });
    historyBg.setProperty(prop.VISIBLE, false);
    historyWidgets.push(historyBg);

    const historyTitle = createWidget(widget.TEXT, {
      x: 0, y: 45, w: 320, h: 25,
      text: 'SLEEP LOG', color: 0x888888, text_size: 16, align_h: align.CENTER_H
    });
    historyTitle.setProperty(prop.VISIBLE, false);
    historyWidgets.push(historyTitle);

    const list = dailyLogList.slice(0, 5);
    const startY = 85;

    list.forEach((item, index) => {
      const itemH = Math.floor(item.durationMins / 60);
      const itemM = item.durationMins % 60;
      const formattedDuration = `${itemH}h ${itemM > 0 ? itemM + 'm' : ''}`.trim();

      let itemColor = 0x00FF88;
      if (item.durationMins < 300) itemColor = 0xFF4444;
      else if (item.durationMins < 420) itemColor = 0xFFCC00;

      const rowText = createWidget(widget.TEXT, {
        x: 45,
        y: startY + (index * 36),
        w: 230,
        h: 30,
        text: `${item.date} :   ${formattedDuration}`,
        text_size: 21,
        color: itemColor,
        align_h: align.LEFT
      });
      rowText.setProperty(prop.VISIBLE, false);
      historyWidgets.push(rowText);
    });

    const historyBackBtn = createWidget(widget.BUTTON, {
      x: 75, y: 285, w: 170, h: 42, radius: 21,
      normal_color: 0x222222, press_color: 0x444444,
      text: 'Back', text_size: 17, color: 0xFFFFFF,
      click_func: () => {
        historyWidgets.forEach(w => w.setProperty(prop.VISIBLE, false));
        mainWidgets.forEach(w => w.setProperty(prop.VISIBLE, true));
      }
    });
    historyBackBtn.setProperty(prop.VISIBLE, false);
    historyWidgets.push(historyBackBtn);

    // --- DEBUG LOG OVERLAY WIDGETS ---
    const debugWidgets = [];

    const debugBg = createWidget(widget.FILL_RECT, {
      x: 0, y: 0, w: 320, h: 380, color: 0x000000
    });
    debugBg.setProperty(prop.VISIBLE, false);
    debugWidgets.push(debugBg);

    const debugTitle = createWidget(widget.TEXT, {
      x: 0, y: 35, w: 320, h: 22,
      text: 'DEBUG LOG (latest first)', color: 0x888888, text_size: 13, align_h: align.CENTER_H
    });
    debugTitle.setProperty(prop.VISIBLE, false);
    debugWidgets.push(debugTitle);

    if (recentEntries.length === 0) {
      const emptyText = createWidget(widget.TEXT, {
        x: 10, y: 80, w: 300, h: 24,
        text: 'No entries yet.', text_size: 14, color: 0x777777, align_h: align.CENTER_H
      });
      emptyText.setProperty(prop.VISIBLE, false);
      debugWidgets.push(emptyText);
    }

    recentEntries.forEach((entry, index) => {
      const t = new Date(entry.t);
      const timeStr = formatTime12(t);
      let line = '';

      if (entry.line) {
        line = `${timeStr} [${entry.source}] ${entry.line}`;
      } else {
        const endStr = formatMinutesSinceMidnight(entry.sleepEnd);
        line = `${timeStr} [${entry.source || '?'}] end:${endStr} naps:${entry.napCount} seg:${entry.segBefore}->${entry.segAfter}`;
      }

      const row = createWidget(widget.TEXT, {
        x: 10,
        y: 60 + (index * 26),
        w: 300,
        h: 24,
        text: line,
        text_size: 13,
        color: entry.source === 'service' ? 0x00FF88 : (entry.source === 'init' ? 0xFFCC00 : 0x00CCFF),
        align_h: align.LEFT
      });
      row.setProperty(prop.VISIBLE, false);
      debugWidgets.push(row);
    });

    const debugBackBtn = createWidget(widget.BUTTON, {
      x: 75, y: 320, w: 170, h: 40, radius: 20,
      normal_color: 0x222222, press_color: 0x444444,
      text: 'Back', text_size: 16, color: 0xFFFFFF,
      click_func: () => {
        debugWidgets.forEach(w => w.setProperty(prop.VISIBLE, false));
        mainWidgets.forEach(w => w.setProperty(prop.VISIBLE, true));
      }
    });
    debugBackBtn.setProperty(prop.VISIBLE, false);
    debugWidgets.push(debugBackBtn);

    // --- MAIN SCREEN BUTTONS ---
    const historyBtn = createWidget(widget.BUTTON, {
      x: 75, y: 268, w: 170, h: 38, radius: 19,
      normal_color: 0x1c1c1e, press_color: 0x3a3a3c,
      text: 'Sleep Log', text_size: 16, color: 0xFFFFFF,
      click_func: () => {
        mainWidgets.forEach(w => w.setProperty(prop.VISIBLE, false));
        historyWidgets.forEach(w => w.setProperty(prop.VISIBLE, true));
      }
    });
    mainWidgets.push(historyBtn);

    const debugBtn = createWidget(widget.BUTTON, {
      x: 75, y: 312, w: 170, h: 34, radius: 17,
      normal_color: 0x1c1c1e, press_color: 0x3a3a3c,
      text: 'Debug Log', text_size: 14, color: 0x888888,
      click_func: () => {
        mainWidgets.forEach(w => w.setProperty(prop.VISIBLE, false));
        debugWidgets.forEach(w => w.setProperty(prop.VISIBLE, true));
      }
    });
    mainWidgets.push(debugBtn);
  }
});