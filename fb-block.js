let lastPath = null
addPathChangeListener((path) => {
  if (path === "/") {
    if (document.querySelector(".disable-dedistract") && lastPath && lastPath.indexOf("photo") !== -1) {
      // Special case: when you're looking through the feed and click on a photo, it changes
      // the path to something like "/photos?id=..." or "/groupname/photos/..."
      //
      // When you close the photo it reverts back to "/". It's annoying to bring
      // back the block immediately when you do this, so we'll just do nothing
      // in this case.
    } else {
      console.log("[dedistract] blocking feed for", path)
      setEnabled(true)
    }
  } else {
    console.log("[dedistract] unblocking feed for", path)
    setEnabled(false)
  }
  lastPath = path
})