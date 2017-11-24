const {Disposable, CompositeDisposable} = require("atom")

module.exports = {
  activate() {
    const submodeNameByCommand = {}
    this.disposables = new CompositeDisposable(
      atom.config.observe("submode.submode", submodeConfig => {
        for (const name of Object.keys(submodeConfig)) {
          for (const command of submodeConfig[name].commands) {
            submodeNameByCommand[command] = name
          }
        }
      }),
      atom.commands.onDidDispatch(event => {
        const submodeName = submodeNameByCommand[event.type]
        if (submodeName) {
          if (submodeName === this.activeSubmode) return // stay in submode

          this.deactivateSubmode()
          this.activateSubmode(submodeName)
        } else {
          this.deactivateSubmode()
        }
      })
    )
  },

  deactivateSubmode() {
    if (this.submodeDisposable) {
      this.submodeDisposable.dispose()
      this.submodeDisposable = null
    }
  },

  activateSubmode(submodeName) {
    const submodeConfig = atom.config.get("submode.submode")
    const {target} = submodeConfig[submodeName]

    let model
    if (target === "atom-workspace") model = atom.workspace
    else if (target === "atom-text-editor") model = atom.workspace.getActiveTextEditor()
    else if (target === "atom-pane") model = atom.workspace.getActivePane()
    if (!model) return

    const element = model.getElement()
    const classNames = submodeName.split(".")
    element.classList.add(...classNames)
    this.activeSubmode = submodeName

    if (atom.config.get("submode.debug")) {
      console.log(`activated "${submodeName}"`, element, Array.from(element.classList))
    }

    this.submodeDisposable = new Disposable(() => {
      this.activeSubmode = null
      element.classList.remove(...classNames)
      if (atom.config.get("submode.debug")) {
        console.log(`deactivated "${submodeName}"`, element, Array.from(element.classList))
      }
    })
  },

  deactivate() {
    this.deactivateSubmode()
  },
}
