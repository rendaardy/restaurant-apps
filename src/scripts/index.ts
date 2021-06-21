import 'reflect-metadata';
import 'router-slot';

import '../styles/main.css';

import './shared/container';

import './pages/app';
import './pages/homepage';
import './pages/detailpage';
import './pages/favoritepage';
import './pages/not-found';

async function registerSW(): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('service worker registered');
    } catch (err) {
      console.log('service worker registration failed', err);
    }
  } else {
    console.log('Your browser does not support service worker');
  }
}

async function main(): Promise<void> {
  const toggle = document.querySelector('.navbar__toggle');
  const drawer = document.querySelector('.navbar__nav');

  toggle?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    drawer?.classList.toggle('open');
  });

  const scrollToTop = document.querySelector('.footer__scroll-to-top');
  scrollToTop?.addEventListener('click', (event) => {
    event.preventDefault();

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  });

  window.addEventListener('navigationend', () => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  });

  await registerSW();
}

window.addEventListener('DOMContentLoaded', main);
