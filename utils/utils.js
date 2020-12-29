/* eslint-disable no-continue */
import _ from 'lodash';

// merge overlap datetime, input: array of object {start: moment, end: moment}
function mergeDateTime(dates) {
  if (dates.length < 0) {
    return dates;
  }

  dates.sort((date1, date2) => {
    if (date1.start.isBefore(date2.start)) {
      return -1;
    } else {
      return 1;
    }
  });

  const mergedDates = [];
  let top = null;

  mergedDates.push(dates[0]);

  for (let i = 1; i < dates.length; i++) {
    // get top element
    top = mergedDates[mergedDates.length - 1];

    // if not overlap
    if (top.end.isBefore(dates[i].start)) {
      mergedDates.push(dates[i]);
    } else if (top.end.isBefore(dates[i].end)) {
      // if overlap then replace top element's end with new end
      top.end = dates[i].end;
      mergedDates.pop();
      mergedDates.push(top);
    }
  }

  return mergedDates;
}

// get spare time between periods, input: array of object {start: moment, end: moment}
function getSpareTimes(usedTime) {
  if (usedTime.length < 0) {
    return;
  }

  usedTime.sort((date1, date2) => {
    if (date1.start.isBefore(date2.end)) {
      return -1;
    } else {
      return 1;
    }
  });

  let spareTimes = [];
  let tempTimeFrom = 0;
  for (let i = 0; i < usedTime.length; i++) {
    if (tempTimeFrom === 0) {
      // if current end is > next start so tempTimeFrom = next end
      if (usedTime[i + 1] && usedTime[i].end.isAfter(usedTime[i + 1].start)) {
        if (usedTime[i].end.isAfter(usedTime[i + 1].end)) {
          tempTimeFrom = usedTime[i].end;
        } else {
          tempTimeFrom = usedTime[i + 1].end;
        }
        continue;
      } else {
        tempTimeFrom = 0;
        if (i !== usedTime.length - 1) {
          // available time block from current end to next start
          spareTimes.push({
            start: usedTime[i].end,
            end: usedTime[i + 1].start
          });
        }
      }
    } else {
      if (
        // if current usedTime has end larger than tempTimeFrom, then assign that end to tempTimeFrom
        usedTime[i].end.isAfter(tempTimeFrom)
      ) {
        tempTimeFrom = usedTime[i].end;
        continue;
      } else {
        let j = i;
        while (
          // check if whether tempTimeFrom is larger than next usedTime's start
          usedTime[j + 1] &&
          usedTime[j + 1].start.isBefore(tempTimeFrom)
        ) {
          j++;
        }
        if (j !== usedTime.length - 1) {
          spareTimes.push({
            start: tempTimeFrom,
            end: usedTime[j + 1].start
          });
          tempTimeFrom = 0;
        }
        i = j;
      }
    }

    spareTimes = spareTimes.filter((at) => {
      return !at.start.isSame(at.end);
    });
  }

  return spareTimes;
}

export { mergeDateTime, getSpareTimes };
