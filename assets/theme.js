/* Tema condiviso: eseguito nel <head> per evitare cambi di palette al caricamento. */
(function () {
  'use strict';
  var key = 'dream-studio-theme';
  var valid = ['black', 'blue', 'blue-harmonized'];
  var selected = 'blue';
  try {
    var saved = window.localStorage.getItem(key);
    if (valid.indexOf(saved) !== -1) selected = saved;
  } catch (error) {
    // La selezione funziona anche se il browser blocca localStorage.
  }
  document.documentElement.setAttribute('data-theme', selected);

  function setBrowserColor() {
    var color = selected === 'black' ? '#171715' : '#1D2664';
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = color;
    var icon = 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" rx="10" fill="' + color + '"/>' +
      '<text x="32" y="41" text-anchor="middle" font-family="Georgia,serif" font-size="35" fill="#f6f3ed">D</text>' +
      '</svg>'
    );
    var links = document.querySelectorAll('link[rel="icon"]');
    if (!links.length) {
      var link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
      links = [link];
    }
    Array.prototype.forEach.call(links, function (link) {
      link.type = 'image/svg+xml';
      link.href = icon;
    });
  }

  function initPicker() {
    var nav = document.querySelector('.site-header .nav');
    var picker = document.createElement('div');
    picker.className = 'theme-picker' + (nav ? '' : ' theme-picker--standalone');
    picker.innerHTML =
      '<button class="theme-trigger" type="button" aria-label="Scegli tema colore" aria-haspopup="menu" aria-expanded="false">' +
      '<span class="theme-symbol" aria-hidden="true">◐</span>' +
      '<span class="theme-label">Tema</span>' +
      '<span class="theme-chevron" aria-hidden="true">⌄</span></button>' +
      '<div class="theme-menu" role="menu" aria-label="Tema del sito" hidden>' +
      '<button class="theme-option" type="button" role="menuitemradio" data-theme-option="black" aria-checked="false">' +
      '<span class="theme-swatch theme-swatch--black" aria-hidden="true"></span>Nero classico</button>' +
      '<button class="theme-option" type="button" role="menuitemradio" data-theme-option="blue" aria-checked="false">' +
      '<span class="theme-swatch theme-swatch--blue" aria-hidden="true"></span>Blu aziendale</button>' +
      '<button class="theme-option" type="button" role="menuitemradio" data-theme-option="blue-harmonized" aria-checked="false">' +
      '<span class="theme-swatch theme-swatch--harmonized" aria-hidden="true"></span>Blu armonizzato</button></div>';
    if (nav) nav.appendChild(picker);
    else document.body.insertBefore(picker, document.body.firstChild);

    var trigger = picker.querySelector('.theme-trigger');
    var menu = picker.querySelector('.theme-menu');
    var options = Array.prototype.slice.call(picker.querySelectorAll('[data-theme-option]'));

    function syncSelection() {
      options.forEach(function (option) {
        option.setAttribute('aria-checked', String(option.getAttribute('data-theme-option') === selected));
      });
      trigger.title = 'Tema attuale: ' + (
        selected === 'black' ? 'Nero classico' :
        selected === 'blue' ? 'Blu aziendale' : 'Blu armonizzato'
      );
    }
    function closeMenu(focusTrigger) {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (focusTrigger) trigger.focus();
    }
    trigger.addEventListener('click', function () {
      var opening = menu.hidden;
      menu.hidden = !opening;
      trigger.setAttribute('aria-expanded', String(opening));
      if (opening) {
        var active = options.find(function (option) {
          return option.getAttribute('data-theme-option') === selected;
        });
        (active || options[0]).focus();
      }
    });
    options.forEach(function (option) {
      option.addEventListener('click', function () {
        selected = option.getAttribute('data-theme-option');
        document.documentElement.setAttribute('data-theme', selected);
        try { window.localStorage.setItem(key, selected); } catch (error) {}
        syncSelection();
        setBrowserColor();
        closeMenu(true);
      });
    });
    menu.addEventListener('keydown', function (event) {
      var index = options.indexOf(document.activeElement);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        options[(index + (event.key === 'ArrowDown' ? 1 : options.length - 1)) % options.length].focus();
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        options[event.key === 'Home' ? 0 : options.length - 1].focus();
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !menu.hidden) closeMenu(true);
    });
    document.addEventListener('pointerdown', function (event) {
      if (!picker.contains(event.target) && !menu.hidden) closeMenu(false);
    });
    syncSelection();
    setBrowserColor();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPicker, { once: true });
  } else {
    initPicker();
  }
})();
