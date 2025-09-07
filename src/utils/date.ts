/**
 * UTCの日時をJST（日本標準時）の'YYYY-MM-DD HH:mm:ss'形式の文字列に変換します。
 * @param {Date | string | number} utcDate - 変換したいUTCの日時（Dateオブジェクト、ISO文字列、タイムスタンプなど）。
 * @returns {string} - JSTに変換された日時文字列。
 */
export const convertUtcToJst = (utcDate: string) => {
  // Dateオブジェクトに変換
  const date = new Date(utcDate);

  // 日本のロケールとタイムゾーンを指定してフォーマット
  // hour12: false で24時間表記に
  const formatter = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // YYYY/MM/DD HH:mm:ss 形式で取得されるので、/ を - に置換
  return new Date(formatter.format(date).replace(/\//g, "-"));
};
