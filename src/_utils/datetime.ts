import getUnixTime from 'date-fns/getUnixTime';
import fromUnixTime from 'date-fns/fromUnixTime';

const dateToUnix = (date: Date | number) => date && getUnixTime(date);

const unixTimeToDate = (timestamp: number) => timestamp && fromUnixTime(timestamp);

export { dateToUnix, unixTimeToDate };
