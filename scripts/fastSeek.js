export default function fastSeek({ video, time }) {
  const hasVideoSeek = typeof video.fastSeek === 'function'

  if (hasVideoSeek) video.fastSeek(time)
  else video.currentTime = time
}
