// LinkedIn's feed tabs use nested routes such as /feed/foryou/.
addPathChangeListener((path) => {
  setEnabled(path === "/" || /^\/feed(?:\/|$)/.test(path))
})
