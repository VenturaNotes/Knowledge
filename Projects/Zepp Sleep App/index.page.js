import { createWidget, widget, align, deleteWidget } from '@zos/ui';
import { Sleep, Time } from '@zos/sensor';
import { LocalStorage } from '@zos/storage';
import * as appService from '@zos/app-service';

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
    const todayStr = `${now.getMonth() + 1}/${now.getDate()}`;

    // 2. Read live sensor for today
    let liveWakeMinutes = null;
    let sleepDurationMins = 0;

    try {
      const sleep = new Sleep();
      sleep.updateInfo();

      const sleepInfo = sleep.getInfo();
      if (sleepInfo && typeof sleepInfo.endTime === 'number' && sleepInfo.endTime > 0) {
        liveWakeMinutes = sleepInfo.endTime;
        sleepDurationMins = sleepInfo.totalTime || 0;
      }

      const naps = sleep.getNap();
      if (Array.isArray(naps) && naps.length > 0) {
        const latestNap = naps[naps.length - 1];
        if (latestNap && typeof latestNap.stop === 'number' && latestNap.stop > (liveWakeMinutes || 0)) {
          liveWakeMinutes = latestNap.stop;
          sleepDurationMins = latestNap.length || (latestNap.stop - latestNap.start) || 0;
        }
      }
    } catch (err) {
      console.log('Sleep sensor error:', err);
    }

    // 3. Load and update rolling 7-day history (Seeded with 9/10: 8h 16m / 496 mins)
    let sleepHistory = storage.getItem('savedSleepHistory', [
      { date: '9/10', durationMins: 496 }
    ]);

    if (liveWakeMinutes !== null) {
      const wakeDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        Math.floor(liveWakeMinutes / 60),
        liveWakeMinutes % 60,
        0
      );
      const wakeMs = Math.min(wakeDate.getTime(), nowMs);
      storage.setItem('savedWakeTimestamp', wakeMs);

      if (sleepDurationMins > 0) {
        storage.setItem('savedSleepDuration', sleepDurationMins);

        const existingIdx = sleepHistory.findIndex(item => item.date === todayStr);
        if (existingIdx !== -1) {
          sleepHistory[existingIdx].durationMins = sleepDurationMins;
        } else {
          sleepHistory.unshift({ date: todayStr, durationMins: sleepDurationMins });
        }
        sleepHistory = sleepHistory.slice(0, 7);
        storage.setItem('savedSleepHistory', sleepHistory);
      }
    }

    // 4. Retrieve stored values
    const yesterday521PM = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 17, 21, 0).getTime();
    const lastWakeTimestamp = storage.getItem('savedWakeTimestamp', yesterday521PM);
    const lastSleepDuration = storage.getItem('savedSleepDuration', 496);

    // 5. Calculate 17-Hour Wake Budget
    const AWAKE_BUDGET_MS = 17 * 60 * 60 * 1000;
    const msAwake = Math.max(0, nowMs - lastWakeTimestamp);
    const msRemaining = AWAKE_BUDGET_MS - msAwake;

    // 6. Calculate Target Bedtime
    const bedDate = new Date(lastWakeTimestamp + AWAKE_BUDGET_MS);
    const bedTimeFormatted = bedDate.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });

    // Format Wake Time
    const wakeDateObj = new Date(lastWakeTimestamp);
    const wakeFormatted = wakeDateObj.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });

    // Format Sleep Duration (Hours & Minutes)
    const sleepHours = Math.floor(lastSleepDuration / 60);
    const sleepMins = lastSleepDuration % 60;

    let sleepColor = 0x00FF88; // Green (>= 7h)
    if (lastSleepDuration < 300) {
      sleepColor = 0xFF4444;   // Red (< 5h)
    } else if (lastSleepDuration < 420) {
      sleepColor = 0xFFCC00;   // Yellow (5 - 7h)
    }

    // --- MAIN DASHBOARD UI ---

    createWidget(widget.TEXT, {
      x: 0,
      y: 40,
      w: 320,
      h: 22,
      text: 'AWAKE BUDGET',
      color: 0x888888,
      text_size: 14,
      align_h: align.CENTER_H
    });

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

    createWidget(widget.TEXT, {
      x: 0,
      y: 65,
      w: 320,
      h: 55,
      text: statusText,
      text_size: 44,
      color: mainColor,
      align_h: align.CENTER_H
    });

    createWidget(widget.TEXT, {
      x: 0,
      y: 125,
      w: 320,
      h: 20,
      text: msRemaining > 0 ? 'time remaining' : 'overdue',
      text_size: 13,
      color: 0x777777,
      align_h: align.CENTER_H
    });

    // Bedtime Card
    createWidget(widget.TEXT, {
      x: 0,
      y: 160,
      w: 320,
      h: 28,
      text: `Bed latest: ${bedTimeFormatted}`,
      text_size: 20,
      color: 0xFFFFFF,
      align_h: align.CENTER_H
    });

    // Time Awake & Wake Time
    const totalMinsAwake = Math.floor(msAwake / (60 * 1000));
    const awakeHours = Math.floor(totalMinsAwake / 60);
    const awakeMins = totalMinsAwake % 60;

    createWidget(widget.TEXT, {
      x: 0,
      y: 195,
      w: 320,
      h: 22,
      text: `Awake ${awakeHours}h ${awakeMins}m (Woke ${wakeFormatted})`,
      text_size: 13,
      color: 0xAAAAAA,
      align_h: align.CENTER_H
    });

    // 24h Sleep Duration Indicator
    createWidget(widget.TEXT, {
      x: 0,
      y: 225,
      w: 320,
      h: 22,
      text: `Latest Sleep: ${sleepHours}h ${sleepMins}m`,
      text_size: 14,
      color: sleepColor,
      align_h: align.CENTER_H
    });

    // --- SLEEP HISTORY MODAL OVERLAY ---
    let historyWidgets = [];

    const closeHistory = () => {
      historyWidgets.forEach(w => deleteWidget(w));
      historyWidgets = [];
    };

    const openHistory = () => {
      if (historyWidgets.length > 0) return;

      historyWidgets.push(createWidget(widget.FILL_RECT, {
        x: 0,
        y: 0,
        w: 320,
        h: 380,
        color: 0x000000
      }));

      historyWidgets.push(createWidget(widget.TEXT, {
        x: 0,
        y: 45,
        w: 320,
        h: 25,
        text: 'SLEEP LOG',
        color: 0x888888,
        text_size: 15,
        align_h: align.CENTER_H
      }));

      const list = sleepHistory.slice(0, 5);
      const startY = 85;

      list.forEach((item, index) => {
        const itemH = Math.floor(item.durationMins / 60);
        const itemM = item.durationMins % 60;
        const formattedDuration = `${itemH}h ${itemM > 0 ? itemM + 'm' : ''}`.trim();

        let itemColor = 0x00FF88;
        if (item.durationMins < 300) itemColor = 0xFF4444;
        else if (item.durationMins < 420) itemColor = 0xFFCC00;

        historyWidgets.push(createWidget(widget.TEXT, {
          x: 45,
          y: startY + (index * 36),
          w: 230,
          h: 30,
          text: `${item.date} :   ${formattedDuration}`,
          text_size: 19,
          color: itemColor,
          align_h: align.LEFT
        }));
      });

      historyWidgets.push(createWidget(widget.BUTTON, {
        x: 80,
        y: 285,
        w: 160,
        h: 38,
        radius: 19,
        normal_color: 0x222222,
        press_color: 0x444444,
        text: '✕ Back',
        text_size: 15,
        click_func: closeHistory
      }));
    };

    // --- BUTTON: Open Sleep History ---
    createWidget(widget.BUTTON, {
      x: 70,
      y: 265,
      w: 180,
      h: 36,
      radius: 18,
      normal_color: 0x1c1c1e,
      press_color: 0x3a3a3c,
      text: '📊 Sleep Log',
      text_size: 14,
      click_func: openHistory
    });
  }
});