import { createWidget, widget, align, prop } from '@zos/ui';
import { Sleep } from '@zos/sensor';
import { LocalStorage } from '@zos/storage';
import * as appService from '@zos/app-service';

// Clean 12-hour time formatter without seconds (e.g. "10:21 AM")
function formatTime12(dateObj) {
  const h24 = dateObj.getHours();
  const m = dateObj.getMinutes();
  const isPM = h24 >= 12;
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
}

Page({
  build() {
    // 1. Ensure background monitoring service is running
    try {
      if (appService && typeof appService.start === 'function') {
        appService.start({
          url: 'service/index.service',
          autoExit: false
        });
      }
    } catch (e) {
      console.log('AppService start error:', e);
    }

    const storage = new LocalStorage();
    const now = new Date();
    const nowMs = now.getTime();

    // 2. INSTANT ON-OPEN CHECK (If you wake up & check watch before 5-min daemon ticks)
    try {
      const sleep = new Sleep();
      const currentStatus = typeof sleep.getSleepingStatus === 'function' ? sleep.getSleepingStatus() : 0;
      const wasSleeping = storage.getItem('bgWasSleeping', false);

      if (wasSleeping && currentStatus === 0) {
        storage.setItem('bgWasSleeping', false);
        storage.setItem('savedWakeTimestamp', nowMs);

        const startMs = storage.getItem('sleepStartTimestamp', 0);
        if (startMs > 0 && nowMs > startMs) {
          const durationMins = Math.round((nowMs - startMs) / (60 * 1000));
          if (durationMins > 0) {
            // A. Update Sessions List for Rolling 24h
            const yesterday521PM = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 17, 21, 0).getTime();
            let sessions = storage.getItem('savedSleepSessions', [
              { wakeTimestamp: yesterday521PM, durationMins: 496 }
            ]);

            sessions.unshift({ wakeTimestamp: nowMs, durationMins: durationMins });
            const cutoff48h = nowMs - (48 * 60 * 60 * 1000);
            sessions = sessions.filter(s => s.wakeTimestamp >= cutoff48h).slice(0, 15);
            storage.setItem('savedSleepSessions', sessions);

            // B. Calculate True Rolling 24h
            const cutoff24h = nowMs - (24 * 60 * 60 * 1000);
            const rolling24hMins = sessions
              .filter(s => s.wakeTimestamp >= cutoff24h && s.wakeTimestamp <= nowMs)
              .reduce((sum, s) => sum + s.durationMins, 0);

            storage.setItem('savedRollingSleepDuration', rolling24hMins);

            // C. Update Calendar Date Log (Second Screen)
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
      } else if (currentStatus === 1) {
        storage.setItem('bgWasSleeping', true);
        if (!storage.getItem('sleepStartTimestamp', 0)) {
          storage.setItem('sleepStartTimestamp', nowMs);
        }
      }
    } catch (err) {
      console.log('Instant wake check error:', err);
    }

    // 3. Retrieve stored values
    const yesterday521PM = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 17, 21, 0).getTime();
    const lastWakeTimestamp = storage.getItem('savedWakeTimestamp', yesterday521PM);
    const rollingSleepMins = storage.getItem('savedRollingSleepDuration', 496); // True 24h rolling total
    const sleepHistory = storage.getItem('savedSleepHistory', [
      { date: '9/10', durationMins: 496 }
    ]);

    // 4. Calculate 17-Hour Wake Budget
    const AWAKE_BUDGET_MS = 17 * 60 * 60 * 1000;
    const msAwake = Math.max(0, nowMs - lastWakeTimestamp);
    const msRemaining = AWAKE_BUDGET_MS - msAwake;

    // 5. Target Bedtime & Wake Time formatted without seconds
    const bedDate = new Date(lastWakeTimestamp + AWAKE_BUDGET_MS);
    const bedTimeFormatted = formatTime12(bedDate);

    const wakeDateObj = new Date(lastWakeTimestamp);
    const wakeFormatted = formatTime12(wakeDateObj);

    // Format Rolling 24-Hour Sleep
    const sleepHours = Math.floor(rollingSleepMins / 60);
    const sleepMins = rollingSleepMins % 60;

    let sleepColor = 0x00FF88; // Green (>= 7h)
    if (rollingSleepMins < 300) {
      sleepColor = 0xFF4444;   // Red (< 5h)
    } else if (rollingSleepMins < 420) {
      sleepColor = 0xFFCC00;   // Yellow (5 - 7h)
    }

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

    // Time Awake & Wake Time (Font size 16)
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

    // TRUE Rolling 24h Sleep Indicator (Font size 18)
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
      x: 0,
      y: 0,
      w: 320,
      h: 380,
      color: 0x000000
    });
    historyBg.setProperty(prop.VISIBLE, false);
    historyWidgets.push(historyBg);

    const historyTitle = createWidget(widget.TEXT, {
      x: 0,
      y: 45,
      w: 320,
      h: 25,
      text: 'SLEEP LOG',
      color: 0x888888,
      text_size: 16,
      align_h: align.CENTER_H
    });
    historyTitle.setProperty(prop.VISIBLE, false);
    historyWidgets.push(historyTitle);

    // Render Calendar Date Breakdown (Top 5 Days)
    const list = sleepHistory.slice(0, 5);
    const startY = 85;

    list.forEach((item, index) => {
      const itemH = Math.floor(item.durationMins / 60);
      const itemM = item.durationMins % 60;
      const formattedDuration = `${itemH}h ${itemM > 0 ? itemM + 'm' : ''}`.trim();

      let itemColor = 0x00FF88; // Green
      if (item.durationMins < 300) itemColor = 0xFF4444; // Red
      else if (item.durationMins < 420) itemColor = 0xFFCC00; // Yellow

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

    // Back Button
    const backBtn = createWidget(widget.BUTTON, {
      x: 75,
      y: 285,
      w: 170,
      h: 42,
      radius: 21,
      normal_color: 0x222222,
      press_color: 0x444444,
      text: 'Back',
      text_size: 17,
      color: 0xFFFFFF,
      click_func: () => {
        historyWidgets.forEach(w => w.setProperty(prop.VISIBLE, false));
        mainWidgets.forEach(w => w.setProperty(prop.VISIBLE, true));
      }
    });
    backBtn.setProperty(prop.VISIBLE, false);
    historyWidgets.push(backBtn);

    // Main Screen Button: Open Sleep Log
    const historyBtn = createWidget(widget.BUTTON, {
      x: 75,
      y: 275,
      w: 170,
      h: 40,
      radius: 20,
      normal_color: 0x1c1c1e,
      press_color: 0x3a3a3c,
      text: 'Sleep Log',
      text_size: 16,
      color: 0xFFFFFF,
      click_func: () => {
        mainWidgets.forEach(w => w.setProperty(prop.VISIBLE, false));
        historyWidgets.forEach(w => w.setProperty(prop.VISIBLE, true));
      }
    });
    mainWidgets.push(historyBtn);
  }
});