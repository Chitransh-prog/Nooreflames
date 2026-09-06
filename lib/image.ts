export function urlForImage(source: any) {
  const urlString =
    typeof source === 'string'
      ? source
      : source?.asset?.url || source?.url || source?.src || '/images/hero/hero-candle.jpg';

  return {
    url: () => urlString,
  };
}
