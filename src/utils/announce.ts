let politeEl: HTMLElement | null = null;
let assertiveEl: HTMLElement | null = null;

export function initAnnouncer(polite: HTMLElement, assertive: HTMLElement) {
  politeEl = polite;
  assertiveEl = assertive;
}

export function announcePolite(message: string) {
  if (!politeEl) return;
  politeEl.textContent = '';
  requestAnimationFrame(() => { if (politeEl) politeEl.textContent = message; });
}

export function announceAssertive(message: string) {
  if (!assertiveEl) return;
  assertiveEl.textContent = '';
  requestAnimationFrame(() => { if (assertiveEl) assertiveEl.textContent = message; });
}
