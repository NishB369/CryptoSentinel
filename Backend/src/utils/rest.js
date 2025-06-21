import moment from 'moment';

export default function rest(awakeTimeMs, workTimeMs) {
  const now = moment();
  const start = moment().startOf('day').add(awakeTimeMs, 'ms');
  const end = moment(start).add(workTimeMs, 'ms');

  if (now.isBefore(start)) return start.diff(now, 'ms');

  if (now.isAfter(end)) {
    const midnight = moment(start).add(1, 'day').startOf('day');
    const next = moment(midnight).add(awakeTimeMs, 'ms');
    return next.diff(now);
  }

  return 0;
}
