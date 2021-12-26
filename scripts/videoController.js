import fastSeek from './fastSeek.js'

const startVideoController = () => {
  const $ = param => document.querySelector(param)

  const bottomControls = $('#bottomControls')
  const muteButton = $('#muteButton')

  const video = $('#video')
  const videoTitle = $('#videoTitle')
  const progressBar = $('#progressBar')
  progressBar.addEventListener('click', handleProgressBarClick)

  function handleProgressBarClick(e) {
    const progressBarWidth = e.target.clientWidth

    const clickTargetPercentage = (e.layerX * 100) / progressBarWidth === 0 ? 0.01 : (e.layerX * 100) / progressBarWidth
    const newTime = (clickTargetPercentage * video.duration) / 100

    fastSeek({ video, time: newTime })
  }

  const parsedVideoTitle = video.firstElementChild.attributes[0].value.replace('./assets/', '').replace('.mp4', '')

  video.title = parsedVideoTitle

  videoTitle.innerText = parsedVideoTitle

  const progressBarValue = $('#progressBarValue')

  const currentTime = $('#currentTime')

  video.addEventListener('timeupdate', () => {
    const currentMinutes = Math.floor(video.currentTime / 60)
    const currentSeconds = Math.floor(video.currentTime - currentMinutes * 60)
    const currentParsedSeconds = currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds

    const durationMinutes = Math.floor(video.duration / 60)
    const durationSeconds = Math.floor(video.duration - durationMinutes * 60)
    const parsedDurationSeconds = durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds

    const videoDuration = `${durationMinutes}:${parsedDurationSeconds}`

    progressBarValue.style.width = `${(video.currentTime * 100) / video.duration}%`
    currentTime.innerText = `${currentMinutes}:${currentParsedSeconds} / ${videoDuration}`
  })

  const screenReproductionControls = $('#screenReproductionControls')

  screenReproductionControls.addEventListener('click', handleReproductionButtonClick)
  screenReproductionControls.addEventListener('dblclick', handleFullscreenButtonClick)
  window.addEventListener('keyup', handleFullscreenKeyUp)
  window.addEventListener('keydown', e => e.preventDefault())

  const reproductionButton = $('#reproductionButton')
  reproductionButton.addEventListener('click', handleReproductionButtonClick)

  function handleReproductionButtonClick() {
    if (video.paused) {
      video.play()
      reproductionButton.innerHTML = `
          <svg class="pauseIcon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`
    } else {
      video.pause()
      showControls()
      reproductionButton.innerHTML = `
      <svg class="playIcon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      `
    }
  }

  const fullscreenButton = $('#fullscreenButton')
  fullscreenButton.addEventListener('click', handleFullscreenButtonClick)

  function handleFullscreenButtonClick() {
    if (!document.fullscreenElement && videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen()
      fullscreenButton.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>`
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
      fullscreenButton.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`
    }
  }

  function handleFullscreenKeyUp(e) {
    if (e.keyCode === 70) {
      handleFullscreenButtonClick()
    } else if (e.keyCode === 32) {
      handleReproductionButtonClick()
      hideControlsSecuence()
    } else if (e.keyCode === 39) {
      showControlsSecuence()
      video.currentTime += 5
    } else if (e.keyCode === 37) {
      showControlsSecuence()
      video.currentTime -= 5
    } else if (e.keyCode === 77) {
      handleMuteButtonClick()
    } else if (e.keyCode === 76) {
      showControlsSecuence()
      video.currentTime += 10
    } else if (e.keyCode === 74) {
      showControlsSecuence()
      video.currentTime -= 10
    } else if (e.keyCode === 75) {
      handleReproductionButtonClick()
      hideControlsSecuence()
    }
  }

  const videoContainer = $('#videoContainer')

  videoContainer.addEventListener('mousemove', handleMouseMove)

  const timeouts = []

  function handleMouseMove() {
    if (video.paused) {
      showControls()
    } else if (!video.paused) {
      showControls()

      timeouts.forEach(timeout => clearTimeout(timeout))

      const timeout = setTimeout(() => {
        if (!video.paused) {
          hideControls()
        }
      }, 3000)

      timeouts.push(timeout)
    }
  }

  video.addEventListener('ended', handleVideoEnded)

  function handleVideoEnded() {
    showControls()
    reproductionButton.innerHTML = `<svg class="replayIcon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`
  }

  muteButton.addEventListener('click', handleMuteButtonClick)

  function handleMuteButtonClick() {
    if (video.muted) {
      video.muted = false
      muteButton.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
    } else {
      video.muted = true
      muteButton.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`
    }
  }

  function hideControls() {
    bottomControls.style.opacity = 0
    videoContainer.style.cursor = 'none'
  }

  function showControls() {
    bottomControls.style.opacity = 1
    videoContainer.style.cursor = 'default'
  }

  function showControlsSecuence() {
    if (video.paused) {
      showControls()
    } else if (!video.paused) {
      showControls()

      timeouts.forEach(timeout => clearTimeout(timeout))

      const timeout = setTimeout(() => {
        if (!video.paused) {
          hideControls()
        }
      }, 3000)

      timeouts.push(timeout)
    }
  }

  function hideControlsSecuence() {
    if (video.paused) {
      showControls()
    } else if (!video.paused) {
      timeouts.forEach(timeout => clearTimeout(timeout))

      const timeout = setTimeout(() => {
        if (!video.paused) {
          hideControls()
        }
      }, 3000)

      timeouts.push(timeout)
    }
  }
}

export default startVideoController
