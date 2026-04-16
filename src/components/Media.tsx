import { ReactNode } from 'react';

export default function Media({
  youtube,
}: {
  youtube?: string | null;
}): ReactNode | null {
  if (!youtube) {
    return null;
  }

  const actions = [];
  if (youtube) {
    actions.push('watching');
  }
  return (
    <>
      <div className="mt-4 italic">Prefer watching on YouTube?</div>
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="mx-auto mt-4 mb-4 h-[250px] w-full rounded-[32px] [corner-shape:squircle] md:mr-4 md:inline md:h-[400px] md:w-full"
        frameBorder="0"
        loading="lazy"
        src={youtube}
        title="Embedded YouTube video"
      ></iframe>
    </>
  );
}
