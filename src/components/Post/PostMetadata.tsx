import { differenceInDays, format, parseISO } from 'date-fns';
import cx from '../../lib/cx.tsx';

const getReadingTime = (
  words: number | undefined,
  minutes: number | undefined,
) => {
  if (minutes && words) {
    return ` ${Math.round(minutes)} minutes reading time, ${Math.round(words / 100) * 100} words`;
  }
};

export default function PostMetadata({
  center,
  date,
  lastUpdateDate,
  minutes,
  withDay,
  words,
}: {
  center?: boolean;
  date: string;
  lastUpdateDate?: string | null;
  minutes?: number;
  withDay?: boolean;
  words?: number;
}) {
  const dateFormat = `LLLL ${withDay ? 'd, ' : ''}yyyy`;
  const publishDate = parseISO(date);
  const lastUpdate = lastUpdateDate && parseISO(lastUpdateDate);
  const difference = lastUpdate
    ? Math.abs(differenceInDays(publishDate, lastUpdate)) > 7
    : false;

  return (
    <div
      className={cx(
        'void-blog-post-metadata mt-2 mb-4 block text-sm text-gray-500 italic dark:text-gray-400',
        {
          'px-6 text-center': center,
        },
      )}
    >
      <time dateTime={date}>
        {difference ? 'First published' : 'Published'} {withDay ? 'on ' : ' '}
        {format(publishDate, dateFormat)}
        {difference && lastUpdate
          ? `, updated on ${format(lastUpdate, dateFormat)}`
          : ''}
      </time>
      <div>{getReadingTime(words, minutes)}</div>
    </div>
  );
}
