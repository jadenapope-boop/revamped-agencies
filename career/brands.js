// Career form white-label layer. One form, many storefronts.
//
// Brand resolution order: ?brand= param (testing / pre-DNS preview) > hostname >
// default (Revamped — the pages ship Revamped-branded, so the default is a no-op).
//
// Adding an agency = one entry in BRANDS + a logo in /career/brands/ + an nginx
// server block on the VPS pointing the agency's domain at this same site + setting
// agencies.career_form_domain in Paragon so the bot builds links on that domain.
//
// This file is loaded synchronously in <head> so the CSS variables land before
// first paint (no purple flash on a blue brand). DOM swaps (logo, title) wait
// for DOMContentLoaded.
(function () {
  var BRANDS = {
    based: {
      name: 'Based Financial',
      // topbar logo: B mark image + styled wordmark (reuses .logo typography)
      logoMark: '/career/brands/based-mark.png',
      logoText: 'BASED',
      logoAccent: 'FINANCIAL',
      titles: {
        index: 'Based Financial — Career',
        new: 'Based Financial — New Agent Application',
        licensed: 'Based Financial — Licensed Agent Application'
      },
      descriptions: {
        index: 'Start your career with Based Financial. Choose your path: licensed agent or new to insurance.',
        new: 'No experience needed. Get licensed, trained, and handed warm leads. Start your 90-day road to financial freedom with Based Financial.',
        licensed: 'Licensed life insurance agent? Apply to join Based Financial. 80-100% starting contracts, vested renewals Day 1, no fees.'
      },
      hosts: [], // Jeremi's domain goes here once DNS is pointed
      vars: {
        '--purple': '#2361d8',
        '--purple-light': '#4d9bff',
        '--purple-dark': '#1a4fb8',
        '--purple-glow': 'rgba(77,155,255,0.5)',
        '--border': 'rgba(59,130,246,0.18)',
        '--border-strong': 'rgba(77,155,255,0.4)',
        '--accent-rgb': '77,155,255',
        '--accent-deep-rgb': '36,97,216',
        '--accent-mid-rgb': '59,130,246',
        '--accent-bright': '#7cc0ff'
      }
    }
  };

  function resolve() {
    var param = new URLSearchParams(location.search).get('brand');
    if (param && BRANDS[param]) return BRANDS[param];
    var host = location.hostname.replace(/^www\./, '');
    for (var key in BRANDS) {
      if (BRANDS[key].hosts.indexOf(host) !== -1) return BRANDS[key];
    }
    return null;
  }

  var brand = resolve();
  if (!brand) return;

  // pre-paint: recolor via CSS variables
  for (var v in brand.vars) document.documentElement.style.setProperty(v, brand.vars[v]);

  // page key from path: /career -> index, /career/new(.html) -> new, etc.
  var page = /licensed/.test(location.pathname) ? 'licensed' : /new/.test(location.pathname) ? 'new' : 'index';

  document.addEventListener('DOMContentLoaded', function () {
    document.title = brand.titles[page] || brand.titles.index;
    var meta = document.querySelector('meta[name="description"]');
    if (meta && brand.descriptions[page]) meta.setAttribute('content', brand.descriptions[page]);

    var logo = document.querySelector('.logo');
    if (logo) {
      logo.textContent = '';
      var img = document.createElement('img');
      img.src = brand.logoMark;
      img.alt = brand.name;
      img.style.cssText = 'height:26px;width:auto;display:inline-block;vertical-align:middle;margin-right:9px;';
      logo.appendChild(img);
      logo.appendChild(document.createTextNode(brand.logoText + ' '));
      var span = document.createElement('span');
      span.textContent = brand.logoAccent;
      logo.appendChild(span);
      logo.style.display = 'flex';
      logo.style.alignItems = 'center';
    }
  });
})();
