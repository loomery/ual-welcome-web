/**
 * FigmaTitleBlock — eyebrow + headline pattern used on survey, welcome
 * and detail screens (node 11:13).
 *
 * Presentational. Pass `eyebrow` as undefined / empty to omit the
 * uppercase label; the headline reflows to the top automatically.
 *
 * @param {Object} props
 * @param {string} [props.eyebrow]
 * @param {string} props.headline
 */
export function FigmaTitleBlock({ eyebrow, headline }) {
  return (
    <div className="flex w-79.75 max-w-full flex-col items-start gap-1.5">
      {eyebrow && (
        <p className="w-full text-[13px] leading-[1.2] font-medium tracking-[1.2px] text-[#525252] uppercase">
          {eyebrow}
        </p>
      )}
      <p className="w-full text-[32px] leading-[1.1] font-bold text-black">
        {headline}
      </p>
    </div>
  );
}
