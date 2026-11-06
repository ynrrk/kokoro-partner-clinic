/* 予約ボタンのリンク先（全ページ共通）
   予約URLを変えるときは、この1行だけを書き換えてください。
   data-reserve の付いたリンク（ヘッダー・本文・スマホ下部の予約ボタン）すべてに反映されます。 */
var RESERVE_URL = "https://gmo-clinic-map.com/hospital/LaxGhQtRe6/treatment";

(function () {
  var n = document.querySelectorAll('a[data-reserve]');
  for (var i = 0; i < n.length; i++) n[i].setAttribute('href', RESERVE_URL);
})();

/* スマホ・タブレットのメニュー（ヘッダー右上のMENUボタンで開閉） */
(function () {
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('site-menu');
  if (!btn || !menu) return;
  var set = function (open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  };
  btn.addEventListener('click', function () {
    set(btn.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.key === 'Esc') && !menu.hidden) { set(false); btn.focus(); }
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) set(false);
  });
  var pc = window.matchMedia('(min-width:1024px)');
  var onChange = function () { if (pc.matches) set(false); };
  if (pc.addEventListener) pc.addEventListener('change', onChange); else pc.addListener(onChange);
})();
