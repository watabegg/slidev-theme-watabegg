import type { MermaidSetup } from '@slidev/types'

export default (() => ({
  look: 'classic',
  fontFamily: '"M PLUS 2", sans-serif',
  themeVariables: { fontSize: '16px' },
  flowchart: {
    padding: 8,
    nodeSpacing: 24,
    rankSpacing: 30,
  },
  sequence: {
    width: 320,
    height: 32,
    actorMargin: 28,
    messageMargin: 16,
    noteMargin: 8,
    boxMargin: 4,
    boxTextMargin: 4,
    mirrorActors: false,
    diagramMarginX: 12,
    // Autonumber markers extend below the last message; keep room inside the SVG.
    diagramMarginY: 24,
    actorFontSize: 16,
    messageFontSize: 16,
    noteFontSize: 14,
  },
})) satisfies MermaidSetup
