'use client'

export type ExportFormat = 'svg' | 'png' | 'jpg'
export type ExportBackground = 'transparent' | 'white' | 'dark' | 'preview' | string

export interface ExportOptions {
  format: ExportFormat
  scale?: 1 | 2 | 3
  background?: ExportBackground
  filename?: string
  currentCanvasBg?: 'dark' | 'light'
}

/** Resolve background value into concrete CSS color */
export function resolveBackgroundColor(
  bg: ExportBackground,
  currentCanvasBg: 'dark' | 'light' = 'dark'
): string {
  if (bg === 'transparent') return 'transparent'
  if (bg === 'white') return '#ffffff'
  if (bg === 'dark') return '#121214'
  if (bg === 'preview') return currentCanvasBg === 'dark' ? '#121214' : '#ffffff'
  return bg
}

/** Serialize SVG element to a string, ensuring required namespaces and optional background */
function serializeSvg(svgElement: SVGSVGElement, background = 'transparent'): string {
  const cloned = svgElement.cloneNode(true) as SVGSVGElement
  if (!cloned.getAttribute('xmlns')) {
    cloned.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  }
  if (!cloned.getAttribute('xmlns:xlink')) {
    cloned.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  }

  // Insert background rect if non-transparent
  if (background && background !== 'transparent') {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('width', '100%')
    rect.setAttribute('height', '100%')
    rect.setAttribute('fill', background)
    cloned.insertBefore(rect, cloned.firstChild)
  }

  const serializer = new XMLSerializer()
  return serializer.serializeToString(cloned)
}

/** Trigger browser file download from a Blob URL */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** Convert an SVG element to a PNG or JPG via canvas */
async function svgToRaster(
  svgElement: SVGSVGElement,
  format: 'png' | 'jpg',
  scale: 1 | 2 | 3 = 1,
  background: ExportBackground = 'transparent',
  currentCanvasBg: 'dark' | 'light' = 'dark'
): Promise<Blob> {
  const resolvedBg = resolveBackgroundColor(background, currentCanvasBg)
  const isTransparent = resolvedBg === 'transparent' && format !== 'jpg'

  const svgString = serializeSvg(svgElement, isTransparent ? 'transparent' : resolvedBg)
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  const bbox = svgElement.getBoundingClientRect()
  const rawWidth =
    svgElement.viewBox?.baseVal?.width || bbox.width || svgElement.clientWidth || 800
  const rawHeight =
    svgElement.viewBox?.baseVal?.height || bbox.height || svgElement.clientHeight || 600

  const width = Math.max(Math.round(rawWidth * scale), 10)
  const height = Math.max(Math.round(rawHeight * scale), 10)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          URL.revokeObjectURL(url)
          reject(new Error('Canvas 2D context unavailable'))
          return
        }

        // Fill background
        if (format === 'jpg' || !isTransparent) {
          ctx.fillStyle = isTransparent ? '#ffffff' : resolvedBg
          ctx.fillRect(0, 0, width, height)
        }

        ctx.drawImage(img, 0, 0, width, height)
        URL.revokeObjectURL(url)

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Canvas rasterization failed'))
          },
          format === 'jpg' ? 'image/jpeg' : 'image/png',
          0.95
        )
      } catch (err) {
        URL.revokeObjectURL(url)
        reject(err)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load SVG for export'))
    }

    img.src = url
  })
}

/** Export a rendered SVG element in the requested format */
export async function exportDiagram(
  svgElement: SVGSVGElement,
  options: ExportOptions
): Promise<void> {
  const {
    format,
    scale = 1,
    background = 'transparent',
    filename = 'diagram',
    currentCanvasBg = 'dark',
  } = options
  const safeFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_') || 'diagram'
  const resolvedBg = resolveBackgroundColor(background, currentCanvasBg)

  if (format === 'svg') {
    const svgString = serializeSvg(svgElement, resolvedBg)
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    downloadBlob(blob, `${safeFilename}.svg`)
    return
  }

  const blob = await svgToRaster(svgElement, format, scale, background, currentCanvasBg)
  downloadBlob(blob, `${safeFilename}.${format}`)
}

/** Copy diagram to clipboard as PNG (where supported) */
export async function copyToClipboard(
  svgElement: SVGSVGElement,
  currentCanvasBg: 'dark' | 'light' = 'dark'
): Promise<void> {
  if (!navigator.clipboard?.write) {
    throw new Error('Clipboard image copying is not supported in this browser')
  }
  const bg = currentCanvasBg === 'dark' ? '#121214' : '#ffffff'
  const blob = await svgToRaster(svgElement, 'png', 2, bg, currentCanvasBg)
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
}
