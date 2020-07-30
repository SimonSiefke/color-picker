const hue2rgb = (p, q, t) => {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

const toRgb = (h, s, l) => {
  let r, g, b
  if (s == 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(
    b * 255,
  )})`
}

let left = 0
let percent = 0

const $ColorPickerSliderThumb = document.createElement('div')
$ColorPickerSliderThumb.className = 'ColorPickerSliderThumb'

const updateWithPercent = () => {
  const hue = percent * 360
  const offsetX = percent * 400
  $ColorPicker.style.setProperty('--color', `hsl(${hue}, 100%, 50%)`)
  $ColorPickerSliderThumb.style.transform = `translateX(${offsetX}px)`
}

const update = (event) => {
  let offsetX = event.clientX - left - 100 - 10 - 10
  if (offsetX < 0) {
    offsetX = 0
  }
  if (offsetX > 400) {
    offsetX = 400
  }
  percent = offsetX / 400
  updateWithPercent()
}

const handlePointerUp = () => {
  window.removeEventListener('mousemove', update)
  window.addEventListener('pointerup', handlePointerUp)
}

$ColorPickerSliderThumb.addEventListener('pointerdown', () => {
  window.addEventListener('mousemove', update, { passive: true })
  window.addEventListener('pointerup', handlePointerUp)
})

const $ColorPickerSlider = document.createElement('div')
$ColorPickerSlider.className = 'ColorPickerSlider'
$ColorPickerSlider.tabIndex = -1
$ColorPickerSlider.append($ColorPickerSliderThumb)
$ColorPickerSlider.addEventListener('mousedown', update)
$ColorPickerSlider.addEventListener('keydown', (event) => {
  event.preventDefault()
  switch (event.key) {
    case 'Home':
      percent = 0
      updateWithPercent()
      break
    case 'End':
      percent = 1
      updateWithPercent()
      break
    case 'ArrowLeft':
      percent = Math.max(percent - 0.01, 0)
      updateWithPercent()
      break
    case 'ArrowRight':
      percent = Math.min(percent + 0.01, 1)
      updateWithPercent()
      break
  }
})

const $ColorPickerPreview = document.createElement('div')
$ColorPickerPreview.className = 'ColorPickerPreview'

const $ColorPicker = document.createElement('div')
$ColorPicker.className = 'ColorPicker'
$ColorPicker.append($ColorPickerPreview, $ColorPickerSlider)

document.body.append($ColorPicker)
left = $ColorPickerSlider.offsetLeft - 20
