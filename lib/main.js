const {Disposable, CompositeDisposable} = require("atom")

module.exports = {
  activate() {
    const submodeNameByCommand = {}
    this.disposables = new CompositeDisposable(
      atom.config.observe("submode.submode", (submodeSpec) => {
        for (const name of Object.keys(submodeSpec)) {
          for (const command of submodeSpec[name].commands) {
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
    // console.log("will activate", submodeName);
    const submodeConfig = atom.config.get("submode.submode")
    const {target} = submodeConfig[submodeName]

    let targetModel
    if (target === "atom-workspace") {
      targetModel = atom.workspace
    } else if (target === "atom-text-editor") {
      targetModel = atom.workspace.getActiveTextEditor()
    } else if (target === "atom-pane") {
      targetModel = atom.workspace.getActivePane()
    }
    if (!targetModel) return

    const element = targetModel.getElement()
    const classNames = submodeName.split(".")
    element.classList.add(...classNames)
    if (atom.config.get("submode.debug")) {
      console.log(`activated "${submodeName}"`, element, Array.from(element.classList))
    }

    this.activeSubmode = submodeName
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
