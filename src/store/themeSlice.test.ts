import { describe, expect, it } from 'vitest'
import themeReducer, { setTheme, toggleTheme } from './themeSlice'

describe('themeSlice', () => {
  it('toggles between light and dark', () => {
    expect(themeReducer({ value: 'light' }, toggleTheme()).value).toBe('dark')
    expect(themeReducer({ value: 'dark' }, toggleTheme()).value).toBe('light')
  })

  it('sets an explicit theme', () => {
    expect(themeReducer({ value: 'light' }, setTheme('dark')).value).toBe('dark')
  })
})
