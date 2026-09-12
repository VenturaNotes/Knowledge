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

    // 2. Default Seed Segment: Friday night sleep 8:25 PM - 3:13 AM (6h 48m = 408 mins)
    const seedStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20, 25, 0).getTime();
    const seedEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 13, 0).getTime();

    let segments = storage.getItem('savedSegments', [
      { startMs: seedStart, endMs: seedEnd, durationMins: 408 }
    ]);

    // 3. INSTANT WAKE CHECK: If opened while a sleep segment was active, finalize it immediately!
    const currentSleepStart = storage.getItem('currentSleepStart', 0);
    if (currentSleepStart > 0) {
      const durationMins = Math.round((nowMs - currentSleepStart) / (60 * 1000));
      if (durationMins > 0) {
        segments.unshift({
          startMs: currentSleepStart,
          endMs: nowMs,
          durationMins: durationMins
        });
        const cutoff7Days = nowMs - (7 * 24 * 60 * 60 * 1000);
        segments = segments.filter(s => s.endMs >= cutoff7Days);
        storage.setItem('savedSegments', segments);
      }
      storage.setItem('currentSleepStart', 0);
    }

    // 4. LATEST WAKE TIME & TIME AWAKE
    const latestSegment = segments.length > 0 ? segments[0] : null;
    const latestWakeMs = latestSegment ? latestSegment.endMs : seedEnd;

    const AWAKE_BUDGET_MS = 17 * 60 * 60 * 1000;
    const msAwake = Math.max(0, nowMs - latestWakeMs);
    const msRemaining = AWAKE_BUDGET_MS - msAwake;

    // Bedtime (Latest Wake + 17 Hours)
    const bedDate = new Date(latestWakeMs + AWAKE_BUDGET_MS);
    const bedTimeFormatted = formatTime12(bedDate);

    const wakeDateObj = new Date(latestWakeMs);
    const wakeFormatted = formatTime12(wakeDateObj);

    // 5. TRUE ROLLING 24-HOUR TOTAL SLEEP (Main Screen)
    // Sums all segments whose endMs falls within [latestWakeMs - 24h, latestWakeMs]
    const cutoff24h = latestWakeMs - (24 * 60 * 60 * 1000);
    const rollingSleepMins = segments
      .filter(s => s.endMs >= cutoff24h && s.endMs <= latestWakeMs)
      .reduce((sum, s) => sum + s.durationMins, 0);

    const sleepHours = Math.floor(rollingSleepMins / 60);
    const sleepMins = rollingSleepMins % 60;

    let sleepColor = 0x00FF88; // Green (>= 7h)
    if (rollingSleepMins < 300) {
      sleepColor = 0xFF4444;   // Red (< 5h)
    } else if (rollingSleepMins < 420) {
      sleepColor = 0xFFCC00;   // Yellow (5 - 7h)
    }

    // 6. DAILY SLEEP LOG BY WAKE DATE (Second Screen)
    // Groups all segments by the date string of when you woke up (endMs)
    const dailyMap = {};
    segments.forEach(s => {
      const d = new Date(s.endMs);
      const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + s.durationMins;
    });

    // Convert map to array of dates
    const dailyLogList = Object.keys(dailyMap).map(dateStr => ({
      date: dateStr,
      durationMins: dailyMap[dateStr]
    }));

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

    // 24h Rolling Total Sleep (Sums all segments in past 24h)
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
    const list = dailyLogList.slice(0, 5);
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