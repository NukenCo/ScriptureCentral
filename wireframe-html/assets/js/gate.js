(function () {
  var UNLOCK_KEY = 'sc_unlocked';
  var isPasswordPage = /password\.html$/.test(location.pathname);
  if (isPasswordPage) return;

  var unlocked = false;
  try {
    unlocked = localStorage.getItem(UNLOCK_KEY) === '1';
  } catch (e) {}
  if (unlocked) return;

  var next = encodeURIComponent(location.pathname + location.search);
  location.replace('password.html?next=' + next);
})();
