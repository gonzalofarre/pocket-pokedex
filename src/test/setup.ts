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
