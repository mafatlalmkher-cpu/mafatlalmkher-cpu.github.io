'use strict';
document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');
toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  header.classList.toggle('menu-open', !expanded);
});
document.querySelectorAll('#main-nav a').forEach(link => link.addEventListener('click', () => {
  header.classList.remove('menu-open');
  toggle.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && header.classList.contains('menu-open')) {
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }
});
function openLinkedDisclosure(hash) {
  if (!hash || hash === '#') return;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (target?.tagName === 'DETAILS') target.open = true;
  let parent = target?.parentElement;
  while (parent) {
    if (parent.tagName === 'DETAILS') parent.open = true;
    parent = parent.parentElement;
  }
}
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => openLinkedDisclosure(link.hash)));
window.addEventListener('hashchange', () => openLinkedDisclosure(location.hash));
openLinkedDisclosure(location.hash);

const search = document.getElementById('publication-search');
const type = document.getElementById('publication-type');
const year = document.getElementById('publication-year');
const list = [...document.querySelectorAll('.publication')];
const more = document.getElementById('show-publications');
const reset = document.getElementById('reset-publications');
const status = document.getElementById('publication-status');
const empty = document.getElementById('publication-empty');
let expanded = false;
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const texts = list.map(item => normalize(item.textContent));
function filterPublications() {
  const query = normalize(search.value.trim());
  const filtering = Boolean(query || type.value || year.value);
  const matches = list.filter((item, index) => {
    const match = (!query || query.split(/\s+/).every(word => texts[index].includes(word))) && (!type.value || item.dataset.type === type.value) && (!year.value || item.dataset.year === year.value);
    item.hidden = !match;
    return match;
  });
  if (!filtering && !expanded) matches.slice(6).forEach(item => item.hidden = true);
  more.hidden = filtering || matches.length <= 6;
  more.innerHTML = expanded ? 'Show fewer publications <span aria-hidden="true">↑</span>' : `Show all ${list.length} publications <span aria-hidden="true">↓</span>`;
  more.setAttribute('aria-expanded', String(expanded));
  more.setAttribute('aria-controls', 'publication-list');
  reset.hidden = !filtering;
  empty.hidden = matches.length !== 0;
  status.textContent = filtering ? `${matches.length} of ${list.length} publications` : expanded ? `${list.length} publications · newest first` : `Showing 6 of ${list.length} publications · newest first`;
}
document.getElementById('publication-filters').addEventListener('submit', event => event.preventDefault());
search.addEventListener('input', filterPublications);
type.addEventListener('change', filterPublications);
year.addEventListener('change', filterPublications);
more.addEventListener('click', () => { expanded = !expanded; filterPublications(); if (!expanded) document.getElementById('publications').scrollIntoView({behavior:'auto'}); });
reset.addEventListener('click', () => { search.value = ''; type.value = ''; year.value = ''; expanded = false; filterPublications(); search.focus(); });
filterPublications();
