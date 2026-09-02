import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement matchMedia; themeSlice reads it for the initial
// light/dark default, so tests need at least a stub.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

// jsdom doesn't implement ResizeObserver; TypeFilterBar uses one to detect
// whether the type chips wrapped onto more than one line. jsdom has no real
// layout either, so this stub just needs to exist — it never has to fire.
if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
