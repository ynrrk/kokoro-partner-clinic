/* 予約ボタンのリンク先（このLPで1か所だけ）
   変えるときはこの1行を書き換えてください。data-reserve の付いたリンクすべてに反映されます。
   HTMLの href にも同じURLを書いてあるので、JSが動かなくても予約ページへ移動できます。 */
var RESERVE_URL = "https://gmo-clinic-map.com/hospital/LaxGhQtRe6/treatment";

(function () {
  var links = document.querySelectorAll('a[data-reserve]');
  for (var i = 0; i < links.length; i++) links[i].setAttribute('href', RESERVE_URL);

  /* ボタンの文言：日本時間で 月〜金 かつ 22:00 より前のときだけ「今夜の空き枠を見る」にする。
     祝日の判定はしない（祝日は広告の配信スケジュール側で止める）。 */
  try {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Tokyo', weekday: 'short', hour: 'numeric', hourCycle: 'h23'
    }).formatToParts(new Date());
    var wd = '', hour = 99;
    for (var j = 0; j < parts.length; j++) {
      if (parts[j].type === 'weekday') wd = parts[j].value;
      if (parts[j].type === 'hour') hour = parseInt(parts[j].value, 10);
    }
    if (['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(wd) >= 0 && hour < 22) {
      document.documentElement.classList.add('is-tonight');
    }
  } catch (e) { /* 判定できないときは「空き枠を見る」のまま */ }

  /* 予約ボタンのクリック計測：どのボタンか（fv / band1 / band2 / sticky / header）を送る。
     【要確認】計測ツールとIDが決まったら、index.html の <head> にタグを入れる。
     GTM なら dataLayer の reserve_click イベント、GA4 を直接入れるなら gtag のイベントとして受け取れる。 */
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-reserve]');
    if (!a) return;
    var pos = a.getAttribute('data-reserve');
    window.dataLayer.push({ event: 'reserve_click', reserve_position: pos });
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'reserve_click', { reserve_position: pos, transport_type: 'beacon' });
    }
  });

  /* スマホ：ファーストビューの予約ボタンが画面の上に消えたら、画面下の予約バーを出す */
  var bar = document.getElementById('sticky');
  var fv = document.getElementById('fv-reserve');
  if (!bar || !fv || !('IntersectionObserver' in window)) return;
  var barLink = bar.querySelector('a');
  new IntersectionObserver(function (entries) {
    var en = entries[0];
    var show = !en.isIntersecting && en.boundingClientRect.top < 0;
    bar.classList.toggle('is-show', show);
    bar.setAttribute('aria-hidden', show ? 'false' : 'true');
    if (barLink) barLink.tabIndex = show ? 0 : -1;
    document.body.classList.toggle('has-sticky', show);
  }).observe(fv);
})();
