function addBanner() {
  const banner = toDOM(`
    <div class="dedistract-banner">
      De-distract is active. Click to disable.
    </div>
  `)
  document.body.appendChild(banner)
  banner.addEventListener("click", () => {
    let delayInSeconds = 10

    // TODO(jlfwong): At the moment, the data from the "why" and "need" fields
    // aren't actually captured anywhere, nor are they blocking at all.
    //
    // I'm going to play around with this for a while and see if their mere
    // presence is enough to be useful, or if having them as a requirement,
    // or logging the results would be interesting.
    const dialog = toDOM(`
      <div class="dedistract-dialog">
        <div>
          Breathe<br/>
          <div id="breath-circle"></div>
          <br/>
          Why are you here right now?<br/>
          <input type="text" id="why"><br/>
          <br/>
          What do you need? <br/>
          <input type="text" id="need"><br/>
          <br/>
          To unblock, click and hold for <span class="dedistract-countdown">${delayInSeconds}</span> seconds. <br/>
        </div>
      </div>
    `)
    document.body.appendChild(dialog)
    requestAnimationFrame(() => {
      document.getElementById("why").focus()
    })

    let interval = null
    dialog.addEventListener("mousedown", () => {
      let start = +new Date()
      interval = setInterval(() => {
        const remaining = delayInSeconds - (+new Date() - start) / 1000
        if (remaining < 0) {
          setEnabled(false)
          document.body.removeChild(dialog)
          clearInterval(interval)
        } else {
          document.querySelector(".dedistract-countdown").textContent = remaining.toFixed(0)
        }
      }, 1000)
    })
    dialog.addEventListener("mouseup", () => {
      clearInterval(interval)
    })
  })
}

addBanner()

// Lots of sites are now single-page apps which use pushState. This makes it
// difficult to make URL-based rules in manifest.json, and there's no API for
// observing history changes due to pushstate (you can observe popstate but not
// pushstate). This file contains the hacks necessary to make it work anyway.
function addPathChangeListener(callback) {
  let lastPathName = null
  function checkURL() {
    let pathName = window.location.pathname
    if (pathName === lastPathName) {
      return
    }
    lastPathName = window.location.pathname
    callback(lastPathName)
  }

  checkURL()

  // We could just poll in a requestAnimationFrame on every frame forever,
  // but that's a lot of unnecessary battery drain. Instead, whenever the
  // user clicks, we'll poll for up to 2 seconds afterwards.
  let frameRequest = null
  function beginPolling() {
    const start = +new Date()

    if (frameRequest != null) {
      // already polling, don't need to do anything.
      return
    }

    ;(function poll() {
      checkURL()
      if ((+new Date()) - start < 2 * 1000) {
        frameRequest = requestAnimationFrame(poll)
      } else {
        frameRequest = null
      }
    })()
  }

  // Whenever the user places their mouse down or hits a key, start polling for
  // URL changes.
  window.addEventListener("mousedown", beginPolling, /* capture = */ true)
  window.addEventListener("keydown", beginPolling, /* capture = */ true)
  window.addEventListener("popstate", beginPolling, /* capture = */ true)
}

const disableClassName = "disable-dedistract"

function setEnabled(enabled) {
  if (enabled) {
    document.body.classList.remove(disableClassName)
  } else {
    document.body.classList.add(disableClassName)
  }
}

function enableFeedOnPathsOtherThan(blockedPaths) {
  addPathChangeListener((path) => {
    if (blockedPaths.includes(path)) {
      console.log("[dedistract] blocking feed for", path)
      setEnabled(true)
    } else {
      console.log("[dedistract] unblocking feed for", path)
      setEnabled(false)
    }
  })
}

function toDOM(str) {
  const container = document.createElement("div")
  container.innerHTML = str
  return container.firstElementChild
}