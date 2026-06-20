module.exports = async function({ app, obsidian }) {
    // 1. Locate the parent ScriptRunner plugin instance
    const plugin = Object.values(app.plugins.plugins).find(
        p => p.manifest.id === "script-runner" || p.constructor.name === "ScriptRunner"
    );
    if (!plugin) return;

    // 2. Settings - Adapted directly from your data.json (Configure as you like!)
    const settings = {
        limitHeadingFrom: 2,
        overrideTab: true,
        styleToRemove: {
            beginning: { ul: true, ol: true, userDefined: [] },
            surrounding: { bold: false, italic: false, userDefined: [] }
        },
        list: { childrenBehavior: "outdent to zero" },
        editor: { tabSize: 4 }
    };

    // 3. Custom SVG Paths for visual UI icons
    const icon_increase_heading = `<path d="M100 50L81.25 68.1865L81.25 31.8135L100 50Z" fill="currentColor" /><line x1="5" y1="37" x2="73" y2="37" stroke="currentColor" stroke-width="10" stroke-linecap="round" /><line x1="52" y1="8" x2="52" y2="92" stroke="currentColor" stroke-width="10" stroke-linecap="round" /><line x1="5" y1="62" x2="73" y2="62" stroke="currentColor" stroke-width="10" stroke-linecap="round" /><line x1="27" y1="8" x2="27" y2="92" stroke="currentColor" stroke-width="10" stroke-linecap="round" />`;
    const icon_decrease_heading = `<path d="M2.50422e-07 50L18.75 31.8135L18.75 68.1865L2.50422e-07 50Z" fill="currentColor" /><line x1="27" y1="37" x2="95" y2="37" stroke="currentColor" stroke-width="10" stroke-linecap="round" /><line x1="74" y1="8" x2="74" y2="92" stroke="currentColor" stroke-width="10" stroke-linecap="round" /><line x1="27" y1="62" x2="95" y2="62" stroke="currentColor" stroke-width="10" stroke-linecap="round" /><line x1="49" y1="8" x2="49" y2="92" stroke="currentColor" stroke-width="10" stroke-linecap="round" />`;
    const icon_heading_0 = `<path d="M12 22H88" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><line x1="71" y1="8" x2="71" y2="92" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M48.9929 65.7955C46.3509 65.786 44.0687 65.1752 42.1463 63.9631C40.224 62.7509 38.742 61.0038 37.7003 58.7216C36.6586 56.4394 36.1425 53.7027 36.152 50.5114C36.1615 47.3106 36.6823 44.5928 37.7145 42.358C38.7562 40.1231 40.2334 38.4233 42.1463 37.2585C44.0687 36.0937 46.3509 35.5114 48.9929 35.5114C51.6349 35.5114 53.9171 36.0985 55.8395 37.2727C57.7618 38.4375 59.2438 40.1373 60.2855 42.3722C61.3272 44.607 61.8433 47.3201 61.8338 50.5114C61.8338 53.7216 61.313 56.4678 60.2713 58.75C59.2296 61.0322 57.7476 62.7794 55.8253 63.9915C53.9124 65.1941 51.6349 65.7955 48.9929 65.7955ZM48.9929 59.375C50.3565 59.375 51.474 58.6648 52.3452 57.2443C53.2259 55.8144 53.6615 53.5701 53.652 50.5114C53.652 48.5133 53.4531 46.8797 53.0554 45.6108C52.6577 44.3419 52.1084 43.4044 51.4077 42.7983C50.7069 42.1828 49.902 41.875 48.9929 41.875C47.6293 41.875 46.5166 42.5663 45.6548 43.9489C44.7931 45.3314 44.3527 47.5189 44.3338 50.5114C44.3243 52.5473 44.5185 54.2235 44.9162 55.5398C45.3139 56.8466 45.8632 57.8125 46.5639 58.4375C47.2741 59.0625 48.0838 59.375 48.9929 59.375Z" fill="currentColor"/><line x1="11" y1="78" x2="89" y2="78" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M28 8L28 92" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>`;
    const icon_heading_1 = `<path d="M12 22H88" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><line x1="71" y1="8" x2="71" y2="92" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M55.576 35.9091V65H47.6783V43.1818H47.5078L41.1442 46.9886V40.2841L48.3033 35.9091H55.576Z" fill="currentColor"/><line x1="11" y1="78" x2="89" y2="78" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M28 8L28 92" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>`;
    const icon_heading_2 = `<path d="M12 22H88" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><line x1="71" y1="8" x2="71" y2="92" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M38.0021 65V59.3182L48.8544 50.3409C49.5741 49.7443 50.1896 49.1856 50.701 48.6648C51.2218 48.1345 51.6196 47.59 51.8942 47.0312C52.1783 46.4725 52.3203 45.8523 52.3203 45.1705C52.3203 44.4223 52.1593 43.7831 51.8374 43.2528C51.5249 42.7225 51.0893 42.3153 50.5305 42.0312C49.9718 41.7377 49.3279 41.5909 48.5987 41.5909C47.8696 41.5909 47.2256 41.7377 46.6669 42.0312C46.1177 42.3248 45.6915 42.7557 45.3885 43.3239C45.0855 43.892 44.9339 44.5833 44.9339 45.3977H37.4339C37.4339 43.3523 37.8932 41.5909 38.8118 40.1136C39.7304 38.6364 41.0277 37.5 42.7038 36.7045C44.38 35.9091 46.3449 35.5114 48.5987 35.5114C50.9283 35.5114 52.9453 35.8854 54.6499 36.6335C56.3639 37.3722 57.6849 38.4138 58.6129 39.7585C59.5504 41.1032 60.0192 42.6799 60.0192 44.4886C60.0192 45.6061 59.7872 46.7187 59.3232 47.8267C58.8591 48.9252 58.0258 50.142 56.8232 51.4773C55.6205 52.8125 53.9112 54.4034 51.6953 56.25L48.968 58.5227V58.6932H60.3317V65H38.0021Z" fill="currentColor"/><line x1="11" y1="78" x2="89" y2="78" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M28 8L28 92" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>`;
    const icon_heading_3 = `<path d="M12 22H88" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><line x1="71" y1="8" x2="71" y2="92" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M49.2994 65.3977C47.0077 65.3977 44.9717 65.0047 43.1914 64.2188C41.4206 63.4233 40.0285 62.3295 39.0153 60.9375C38.002 59.5455 37.4906 57.9451 37.4812 56.1364H45.4357C45.4452 56.6951 45.6156 57.2443 45.4357 57.2443C45.4357 57.2443 45.4357 57.2443 45.4357 57.2443Z" fill="currentColor"/><line x1="11" y1="78" x2="89" y2="78" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M28 8L28 92" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>`;
    const icon_heading_4 = `<path d="M12 22H88" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><line x1="71" y1="8" x2="71" y2="92" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M37.1048 60.4545V54.3182L48.8093 35.9091H54.3775V44.0909H51.1957L44.8888 54.0909V54.3182H62.1616V60.4545H37.1048ZM51.2525 65V58.5795L51.4229 55.9091V35.9091H58.8093V65H51.2525Z" fill="currentColor"/><line x1="11" y1="78" x2="89" y2="78" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M28 8L28 92" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>`;
    const icon_heading_5 = `<path d="M12 22H88" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><line x1="71" y1="8" x2="71" y2="92" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M49.7006 65.3977C47.4658 65.3977 45.4819 65.0047 43.7489 64.2188C42.0254 63.4233 40.6665 62.3295 39.6722 60.9375C38.6874 59.5455 38.1855 57.9451 38.1665 56.1364H45.837C45.8654 57.1402 46.2537 57.9403 47.0018 58.5369C47.7594 59.1335 48.659 59.4318 49.7006 59.4318C50.5056 59.4318 51.2158 59.2614 51.8313 58.9205C52.4469 58.5701 52.9298 58.0777 53.2802 57.4432C53.6306 56.8087 53.801 56.0701 53.7915 55.2273C53.801 54.375 53.6306 53.6364 53.2802 53.0114C52.9298 52.3769 52.4469 51.8892 51.8313 51.5483C51.2158 51.1979 50.5056 51.0227 49.7006 51.0227C48.8673 51.0227 48.0955 51.2263 47.3853 51.6335C46.6845 52.0312 46.1684 52.5852 45.837 53.2955L38.9052 51.9318L40.0415 35.9091H59.587V42.2159H46.5188L45.9506 48.6364H46.1211C46.5756 47.7557 47.3616 47.0265 48.479 46.4489C49.5965 45.8617 50.8938 45.5682 52.3711 45.5682C54.104 45.5682 55.6476 45.9706 57.0018 46.7756C58.3654 47.5805 59.4402 48.6932 60.2262 50.1136C61.0217 51.5246 61.4147 53.1534 61.4052 55C61.4147 57.0265 60.9317 58.8258 59.9563 60.3977C58.9904 61.9602 57.6315 63.1866 55.8796 64.0767C54.1277 64.9574 52.0681 65.3977 49.7006 65.3977Z" fill="currentColor"/><line x1="11" y1="78" x2="89" y2="78" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M28 8L28 92" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>`;
    const icon_heading_6 = `<path d="M12 22H88" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><line x1="71" y1="8" x2="71" y2="92" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M49.3995 65.3977C47.7044 65.3977 46.0946 65.1326 44.57 64.6023C43.0548 64.0625 41.7101 63.215 40.5359 62.0597C39.3616 60.9044 38.4383 59.3987 37.766 57.5426C37.1031 55.6866 36.7764 53.4375 36.7859 50.7955C36.7953 48.4375 37.0984 46.3163 37.695 44.4318C38.301 42.5473 39.158 40.9422 40.266 39.6165C41.3834 38.2907 42.7186 37.2775 44.2717 36.5767C45.8247 35.8665 47.5529 35.5114 49.4563 35.5114C51.5965 35.5114 53.4809 35.9233 55.1097 36.7472C56.7385 37.571 58.0359 38.6742 59.0018 40.0568C59.9772 41.4299 60.5453 42.9451 60.7063 44.6023H52.9222C52.7423 43.7784 52.3256 43.1771 51.6722 42.7983C51.0283 42.41 50.2897 42.2159 49.4563 42.2159C47.7991 42.2159 46.5823 42.9356 45.8058 44.375C45.0387 45.8144 44.6457 47.7083 44.6268 50.0568H44.7972C45.1665 49.1667 45.7253 48.4044 46.4734 47.7699C47.2215 47.1354 48.0927 46.6477 49.087 46.3068C50.0813 45.9659 51.1325 45.7955 52.2404 45.7955C54.0018 45.7955 55.5406 46.1932 56.8569 46.9886C58.1826 47.7841 59.2148 48.8731 59.9535 50.2557C60.6921 51.6383 61.0567 53.2197 61.0472 55C61.0567 57.0833 60.5643 58.9062 59.57 60.4688C58.5851 62.0312 57.2167 63.2434 55.4648 64.1051C53.713 64.9669 51.6912 65.3977 49.3995 65.3977ZM49.3427 59.4318C50.1287 59.4318 50.8247 59.2519 51.4308 58.892C52.0463 58.5322 52.5245 58.0398 52.8654 57.4148C53.2158 56.7898 53.3862 56.0795 53.3768 55.2841C53.3862 54.4792 53.2158 53.7689 52.8654 53.1534C52.5245 52.5284 52.0463 52.036 51.4308 51.6761C50.8247 51.3163 50.1287 51.1364 49.3427 51.1364C48.765 51.1364 48.23 51.2405 47.7376 51.4489C47.2546 51.6477 46.8332 51.9366 46.4734 52.3153C46.1135 52.6847 45.8294 53.125 45.6211 53.6364C45.4222 54.1383 45.3181 54.6875 45.3086 55.2841C45.3181 56.0795 45.498 56.7898 45.8484 57.4148C46.1987 58.0398 46.677 58.5322 47.283 58.892C47.8891 59.2519 48.5756 59.4318 49.3427 59.375Z" fill="currentColor"/><line x1="11" y1="78" x2="89" y2="78" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><path d="M28 8L28 92" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>`;

    if (!window.headingShifterIconsRegistered) {
        obsidian.addIcon("headingShifter_increaseIcon", icon_increase_heading);
        obsidian.addIcon("headingShifter_decreaseIcon", icon_decrease_heading);
        obsidian.addIcon("headingShifter_heading0", icon_heading_0);
        obsidian.addIcon("headingShifter_heading1", icon_heading_1);
        obsidian.addIcon("headingShifter_heading2", icon_heading_2);
        obsidian.addIcon("headingShifter_heading3", icon_heading_3);
        obsidian.addIcon("headingShifter_heading4", icon_heading_4);
        obsidian.addIcon("headingShifter_heading5", icon_heading_5);
        obsidian.addIcon("headingShifter_heading6", icon_heading_6);
        window.headingShifterIconsRegistered = true;
    }

    // 4. Pure Parsing and Style Removal logic
    const checkHeading = (content) => {
        const match = content.match(/^(#+) /);
        if (!match || !match[1]) return 0;
        return match[1].length;
    };

    const checkFence = (content) => {
        const backticks = content.match(/^(`{3,})/);
        if (backticks && backticks[1]) return { fenceType: "`", fenceNum: backticks[1].length };
        const tildes = content.match(/^(~{3,})/);
        if (tildes && tildes[1]) return { fenceType: "~", fenceNum: tildes[1].length };
        return null;
    };

    const getFenceStatus = (prev, current) => {
        if (!current) return prev;
        if (!prev) return current;
        if (current.fenceType === prev.fenceType && current.fenceNum >= prev.fenceNum) {
            return null;
        }
        return prev;
    };

    const setMin = (prev, cur) => {
        if (prev === undefined || (prev !== undefined && cur < prev)) return cur;
        return prev;
    };

    const setMax = (prev, cur) => {
        if (prev === undefined || (prev !== undefined && cur > prev)) return cur;
        return prev;
    };

    const getHeadingLines = (editor, from, to, options) => {
        const headingLines = [];
        let minHeading;
        let maxHeading;
        let fence = null;
        for (let line = Math.min(from, to); line <= Math.max(from, to); line++) {
            fence = getFenceStatus(fence, checkFence(editor.getLine(line)));
            if (fence) continue;
            const heading = checkHeading(editor.getLine(line));
            if ((options && options.includesNoHeadingsLine) || heading > 0) {
                headingLines.push(line);
                minHeading = setMin(minHeading, heading);
                maxHeading = setMax(maxHeading, heading);
            }
        }
        return { headingLines, minHeading, maxHeading };
    };

    const getPreviousHeading = (editor, from) => {
        let fence = null;
        const start = from > 0 ? from - 1 : 0;
        for (let line = start; line >= 0; line--) {
            fence = getFenceStatus(fence, checkFence(editor.getLine(line)));
            if (fence) continue;
            if (checkHeading(editor.getLine(line)) > 0) return line;
        }
        return undefined;
    };

    const replaceFunc = (str, regExp) => {
        try {
            const replaced = str.replace(regExp, "$1");
            if (replaced !== str) return replaced;
        } catch (error) {
            console.error(error);
        }
        return undefined;
    };

    const RegExpExample = {
        beginning: {
            ol: String.raw`\d+\. `,
            ul: String.raw`(?:\-|\*) `
        },
        surrounding: {
            italic: String.raw`(?:(?<!\*)\*(?!\*)|(?<!_)_(?!_))`,
            bold: String.raw`(?:(?<!\*)\*\*(?!\*)|(?<!_)__(?!_))`
        }
    };

    const removeUsingRegexpStrings = (str, regExpStrings) => {
        let removed = str;
        for (const regExpStr of (regExpStrings.beginning || [])) {
            const regExp = new RegExp(`^\\s*${regExpStr}(.*)`);
            const result = replaceFunc(removed, regExp);
            if (result !== undefined) {
                removed = result;
                break;
            }
        }
        for (const regExpStr of (regExpStrings.surrounding || [])) {
            const regExp = new RegExp(`${regExpStr}(.*)${regExpStr}`);
            const result = replaceFunc(removed, regExp);
            if (result !== undefined) {
                removed = result;
                break;
            }
        }
        return removed;
    };

    const countIndentLevel = (line, tabSize = 4) => {
        const leadingContent = line.match(/^(\s*)/)?.[0];
        if (!leadingContent) return 0;
        const tabCount = (leadingContent.match(/\t/g) || []).length;
        const spaceCount = (leadingContent.match(/ /g) || []).length;
        return tabCount + Math.floor(spaceCount / tabSize);
    };

    const getListChildrenLines = (editor, parentLineNumber, tabSize) => {
        const lineNumbers = [];
        const startLine = editor.getLine(parentLineNumber);
        const prevParentIndentLevel = countIndentLevel(startLine, tabSize);
        for (let lineN = parentLineNumber + 1; lineN < editor.lineCount(); lineN++) {
            const line = editor.getLine(lineN);
            const indentLevel = countIndentLevel(line, tabSize);
            const isBulleted = /^\s*[-*]\s+/.test(line);
            const isNumbered = /^\s*\d+\.\s+/.test(line);
            if (!isBulleted && !isNumbered) break;
            if (indentLevel <= prevParentIndentLevel) break;
            lineNumbers.push(lineN);
        }
        return lineNumbers;
    };

    // --- Shift Heading Engine ---
    const composeLineChanges = (editor, lineNumbers, changeCallback) => {
        const editorChange = [];
        for (const line of lineNumbers) {
            const shifted = changeCallback(editor.getLine(line), settings);
            editorChange.push({
                text: shifted,
                from: { line, ch: 0 },
                to: { line, ch: editor.getLine(line).length }
            });
        }
        return editorChange;
    };

    const createListIndentChanges = (editor, { parentLineNumber, parentIndentLevel, tabSize = 4, changeHeadingLevel }) => {
        const parentLine = editor.getLine(parentLineNumber);
        const prevParentIndentLevel = countIndentLevel(parentLine, tabSize);
        const childrenNumbers = getListChildrenLines(editor, parentLineNumber, tabSize);
        const indentDelta = parentIndentLevel - prevParentIndentLevel;
        const changes = [];
        
        childrenNumbers.forEach((lineNumber) => {
            const line = editor.getLine(lineNumber);
            const newIndentLevel = Math.max(countIndentLevel(line, tabSize) + indentDelta, 0);
            const matchResult = line.match(
                new RegExp("^(?<whitespace>\\s*)(?<bullet>[-*]\\s*|(?<numbered>\\d+\\.\\s*))(?<heading>#+\\s*)?(?<content>.*)$")
            );
            
            const tabsMarkers = "\t".repeat(newIndentLevel);
            const bulletMarkers = matchResult?.groups?.bullet || "";
            const numberedMarkers = matchResult?.groups?.numbered || "";
            const listMarker = bulletMarkers || numberedMarkers;
            
            let headingMarkers = "";
            if (matchResult?.groups?.heading) {
                if (changeHeadingLevel) {
                    headingMarkers = `${"#".repeat(Math.min(newIndentLevel + 1, 6))} `;
                } else {
                    headingMarkers = matchResult.groups.heading;
                }
            }
            
            const content = matchResult?.groups?.content || "";
            const newLine = `${tabsMarkers}${listMarker}${headingMarkers}${content}`;
            changes.push({
                text: newLine,
                from: { line: lineNumber, ch: 0 },
                to: { line: lineNumber, ch: line.length }
            });
        });
        return changes;
    };

    const applyHeading = (chunk, headingSize, settings) => {
        const extractRegExp = (settingObj, regExpObj) => {
            return Object.entries(settingObj ?? {}).flatMap(([k, v]) => {
                if (Array.isArray(v)) return v;
                if (k in regExpObj && v === true) return regExpObj[k] ?? [];
                return [];
            });
        };
        
        const bulletRegExp = /\s*(- \[.+\]|-|\*|[0-9]+)\s+/;
        const headingRegExp = /#+\s+/;
        const isBullet = settings?.list?.childrenBehavior === "sync with headings" && bulletRegExp.test(chunk);
        let removed = chunk;
        
        if (!checkHeading(chunk)) {
            removed = settings?.styleToRemove ? removeUsingRegexpStrings(chunk, {
                beginning: extractRegExp(
                    {
                        ...settings.styleToRemove.beginning,
                        ul: !isBullet && settings.styleToRemove.beginning.ul
                    },
                    RegExpExample.beginning
                ),
                surrounding: extractRegExp(
                    settings.styleToRemove.surrounding,
                    RegExpExample.surrounding
                )
            }) : chunk;
        }
        
        const leadingMarkersRegExp = isBullet ? new RegExp(
            `^(?:${bulletRegExp.source}${headingRegExp.source}|${bulletRegExp.source})`
        ) : new RegExp(`^${headingRegExp.source}`);
        
        let capturedBullet = "-";
        const principleText = removed.replace(leadingMarkersRegExp, (match, p1) => {
            if (isBullet && p1) {
                capturedBullet = p1;
            }
            return "";
        });
        
        const bulletMarkers = `${"\t".repeat(Math.max(headingSize - 1, 0))}${capturedBullet} `;
        const headingMarkers = "#".repeat(Math.max(headingSize, 0)) + (headingSize > 0 ? " " : "");
        const leadingMarkers = isBullet ? `${bulletMarkers}${headingMarkers}` : headingMarkers;
        return leadingMarkers + principleText;
    };

    const createListIndentChangesByListBehavior = (editor, { listBehavior, tabSize = 4, parentIndentLevel, parentLineNumber }) => {
        if (listBehavior === "noting") return [];
        
        let parentIndentLevelByBehavior = 0;
        if (listBehavior === "sync with headings") {
            parentIndentLevelByBehavior = Math.max(0, parentIndentLevel);
        } else if (listBehavior === "outdent to zero") {
            parentIndentLevelByBehavior = -countIndentLevel(editor.getLine(parentLineNumber + 1), tabSize) + countIndentLevel(editor.getLine(parentLineNumber), tabSize);
        }
        
        return createListIndentChanges(editor, {
            parentLineNumber,
            parentIndentLevel: parentIndentLevelByBehavior,
            tabSize,
            changeHeadingLevel: listBehavior === "sync with headings"
        });
    };

    const shiftHeading = (chunk, dir, settings) => {
        const heading = checkHeading(chunk);
        return applyHeading(chunk, heading + dir, settings);
    };

    const increaseHeading = (chunk, settings) => shiftHeading(chunk, 1, settings);
    const decreaseHeading = (chunk, settings) => shiftHeading(chunk, -1, settings);

    // --- Command Callback Generators ---
    const runApplyHeading = (editor, headingSize) => {
        const lines = Array.from(
            { length: editor.getCursor("to").line - editor.getCursor("from").line + 1 },
            (_, i) => editor.getCursor("from").line + i
        );
        const isOneLine = editor.getCursor("from").line === editor.getCursor("to").line;
        const lastHeaderLineNumber = lines[lines.length - 1] ?? 0;
        
        const headingsChanges = composeLineChanges(
            editor,
            lines,
            (chunk) => applyHeading(chunk, headingSize, settings)
        );
        
        const indentChanges = createListIndentChangesByListBehavior(editor, {
            parentIndentLevel: headingSize - 1,
            tabSize: settings.editor.tabSize,
            listBehavior: settings.list.childrenBehavior,
            parentLineNumber: lastHeaderLineNumber
        });
        
        editor.transaction({
            changes: [...headingsChanges, ...indentChanges]
        });
        
        if (isOneLine) {
            editor.setCursor(editor.getCursor("anchor").line);
        }
    };

    const runIncreaseHeading = (editor, includesNoHeadingsLine) => {
        const { headingLines, maxHeading } = getHeadingLines(
            editor,
            editor.getCursor("from").line,
            editor.getCursor("to").line,
            { includesNoHeadingsLine }
        );
        
        if (maxHeading !== undefined && maxHeading >= 6) {
            new obsidian.Notice("Cannot Increase (contains more than Heading 6)");
            return true;
        }
        
        const isOneLine = editor.getCursor("from").line === editor.getCursor("to").line;
        const editorChange = composeLineChanges(
            editor,
            headingLines,
            increaseHeading,
            settings
        );
        
        editor.transaction({
            changes: editorChange
        });
        
        if (isOneLine) {
            editor.setCursor(editor.getCursor("anchor").line);
        }
        return editorChange.length ? true : false;
    };

    const runDecreaseHeading = (editor) => {
        const { headingLines, minHeading } = getHeadingLines(
            editor,
            editor.getCursor("from").line,
            editor.getCursor("to").line
        );
        
        if (minHeading !== undefined && minHeading <= Number(settings.limitHeadingFrom)) {
            new obsidian.Notice(`Cannot Decrease (contains less than Heading ${Number(settings.limitHeadingFrom)})`);
            return true;
        }
        
        const isOneLine = editor.getCursor("from").line === editor.getCursor("to").line;
        const editorChange = composeLineChanges(
            editor,
            headingLines,
            decreaseHeading,
            settings
        );
        
        editor.transaction({
            changes: editorChange
        });
        
        if (isOneLine) {
            editor.setCursor(editor.getCursor("anchor").line);
        }
        return editorChange.length ? true : false;
    };

    const runInsertHeadingAtCurrentLevel = (editor) => {
        const cursorLine = editor.getCursor("from").line;
        const lastHeadingLine = getPreviousHeading(editor, cursorLine);
        const headingLevel = lastHeadingLine !== undefined ? checkHeading(editor.getLine(lastHeadingLine)) : 0;
        
        const headingChanges = composeLineChanges(
            editor,
            [cursorLine],
            (chunk) => applyHeading(chunk, headingLevel, settings)
        );
        
        const indentChanges = createListIndentChangesByListBehavior(editor, {
            parentIndentLevel: headingLevel - 1,
            tabSize: settings.editor.tabSize,
            listBehavior: settings.list.childrenBehavior,
            parentLineNumber: cursorLine
        });
        
        editor.transaction({
            changes: [...headingChanges, ...indentChanges]
        });
        editor.setCursor(editor.getCursor().line);
    };

    const runInsertHeadingAtDeeperLevel = (editor) => {
        const cursorLine = editor.getCursor("from").line;
        const lastHeadingLine = getPreviousHeading(editor, cursorLine);
        const headingLevel = lastHeadingLine ? checkHeading(editor.getLine(lastHeadingLine)) : 0;
        
        if (headingLevel + 1 > 6) {
            new obsidian.Notice("Cannot Increase (contains more than Heading 6)");
            return;
        }
        
        const targetHeadingLevel = headingLevel + 1;
        const headingChanges = composeLineChanges(
            editor,
            [cursorLine],
            (chunk) => applyHeading(chunk, targetHeadingLevel, settings)
        );
        
        const indentChanges = createListIndentChangesByListBehavior(editor, {
            parentIndentLevel: targetHeadingLevel - 1,
            tabSize: this.settings.editor.tabSize,
            listBehavior: this.settings.list.childrenBehavior,
            parentLineNumber: cursorLine
        });
        editor.transaction({
            changes: [...headingChanges, ...indentChanges]
        });
        editor.setCursor(editor.getCursor().line);
    };

    const InsertHeadingAtHigherLevel = (editor) => {
        const cursorLine = editor.getCursor("from").line;
        const lastHeadingLine = getPreviousHeading(editor, cursorLine);
        const headingLevel = lastHeadingLine ? checkHeading(editor.getLine(lastHeadingLine)) : 0;
        
        const targetHeadingLevel = headingLevel - 1;
        const headingChanges = composeLineChanges(
            editor,
            [cursorLine],
            (chunk) => applyHeading(chunk, targetHeadingLevel, settings)
        );
        
        const indentChanges = createListIndentChangesByListBehavior(editor, {
            parentIndentLevel: targetHeadingLevel,
            tabSize: settings.editor.tabSize,
            listBehavior: settings.list.childrenBehavior,
            parentLineNumber: cursorLine
        });
        
        editor.transaction({
            changes: [...headingChanges, ...indentChanges]
        });
        editor.setCursor(editor.getCursor().line);
    };

    // --- Command Registration Helper ---
    const registerCommandHelper = (id, name, callback, icon) => {
        plugin.addCommand({
            id,
            name: `Heading Shifter: ${name}`,
            icon,
            editorCallback: callback
        });
        // Push ID to registeredCommandIds for reactive cleanup during ScriptRunner reloads
        plugin.registeredCommandIds.push(id);
    };

    // --- Register commands globally ---
    [0, 1, 2, 3, 4, 5, 6].forEach((heading) => {
        registerCommandHelper(
            `apply-heading${heading}`,
            `Apply Heading ${heading}`,
            (editor) => runApplyHeading(editor, heading),
            `headingShifter_heading${heading}`
        );
    });

    registerCommandHelper("increase-heading", "Increase Headings", (editor) => runIncreaseHeading(editor, false), "headingShifter_increaseIcon");
    registerCommandHelper("increase-heading-forced", "Increase Headings (forced)", (editor) => runIncreaseHeading(editor, true), "headingShifter_increaseIcon");
    registerCommandHelper("decrease-heading", "Decrease Headings", (editor) => runDecreaseHeading(editor), "headingShifter_decreaseIcon");
    registerCommandHelper("insert-heading-current", "Insert Heading at current level", (editor) => runInsertHeadingAtCurrentLevel(editor), "headingShifter_heading");
    registerCommandHelper("insert-heading-deeper", "Insert Heading at one level deeper", (editor) => runInsertHeadingAtDeeperLevel(editor), "headingShifter_heading");
    registerCommandHelper("insert-heading-higher", "Insert Heading at one level higher", (editor) => InsertHeadingAtHigherLevel(editor), "headingShifter_heading");

    // --- Tab and Shift-Tab keymaps Integration via CodeMirror ---
    const { Prec } = require("@codemirror/state");
    const { keymap } = require("@codemirror/view");
    const { editorInfoField } = obsidian;

    const createKeyMapRunCallback = (checkFunc, runFunc) => {
        return (view) => {
            const editor = view.state.field(editorInfoField).editor;
            if (!editor) return false;
            if (!checkFunc(editor)) return false;
            const shouldStopPropagation = runFunc(editor);
            return !!shouldStopPropagation;
        };
    };

    const checkIncrease = (editor) => {
        const { maxHeading } = getHeadingLines(
            editor,
            editor.getCursor("from").line,
            editor.getCursor("to").line
        );
        if (maxHeading === undefined) return false;
        return settings.overrideTab;
    };

    const checkDecrease = (editor) => {
        const { maxHeading } = getHeadingLines(
            editor,
            editor.getCursor("from").line,
            editor.getCursor("to").line
        );
        if (maxHeading === undefined) return false;
        return settings.overrideTab;
    };

    // Prevent double-binding on reloads by keeping a registration marker
    if (!plugin.headingShifterExtensionRegistered) {
        plugin.registerEditorExtension(
            Prec.highest(
                keymap.of([
                    {
                        key: "Tab",
                        run: createKeyMapRunCallback(checkIncrease, (editor) => runIncreaseHeading(editor, false))
                    },
                    {
                        key: "Shift-Tab",
                        run: createKeyMapRunCallback(checkDecrease, (editor) => runDecreaseHeading(editor))
                    }
                ])
            )
        );
        plugin.headingShifterExtensionRegistered = true;
    }
};