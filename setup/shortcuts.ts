import type { ShortcutsSetup } from '@slidev/types'

export default ((nav, base) => {
  return [
    ...base, // keep the existing shortcuts
    {
      key: 'enter',
      fn: () => nav.next(),
      autoRepeat: true,
    },
    {
      key: 'backspace',
      fn: () => nav.prev(),
      autoRepeat: true,
    },
  ]
}) satisfies ShortcutsSetup
