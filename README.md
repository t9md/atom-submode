# atom-submode

activate granular keymap by trigger command

# Development status

alpha

# What's this?

- This package provides basic mechanism so that you can easily define submode.
- By adding predefined CSS class name to target element when trigger command was executed.
- When non-trigger command was executed, remove added CSS class name from target element.
- Currently target must be one of `atom-workspace`, `atom-text-editor` or `atom-pane`.

# How to use

#### 1. Set configuration in your `config.cson`

- Unlike normal atom packages, you must **directly edit** `config.cson` to add configuration.
- define each submode spec under `submode.submode` object.
  - key is submode name, `after-save`, `after.move`, value must have `target`(String) and `commands`(Array).
  - `target` must be one of `atom-wokspace`, `atom-text-editor` or `atom-pane`.
  - set trigger commands to activate submode.
- when submode is split by `.` and each segment classname is added to target element.
  - E.g. For `after-save` submode, `atom.workspace.getElement().classList.add("after-save")`
  - E.g. For `after.move` submode, `atom.workspace.getActiveTextEditor().element.classList("after", "move")`

```coffeescript
  submode:
    submode:
      "after-save":
        target: "atom-workspace",
        commands: [
          "core:save"
        ],
      "after.move":
        target: "atom-text-editor",
        commands: [
          "core:move-up"
          "core:move-down"
          "core:move-right"
          "core:move-left"
        ]
```

#### 2. Define keymap to use defined submode in your `keymap.cson`

```coffeescript
# after you invoke `core:save`, you can invoke `some:command` by keystroke `a`
'atom-workspace.after-save':
  "a": "some:command"

# after you invoke `core:move-up/down/right/left`, you can invoke `some:command` by keystroke `a`
'atom-text-editor.after.move':
  "a": "some:command"
```

# Practical example

- If you are [vim-mode-plus](https://atom.io/packages/vim-mode-plus) user
- And you want to select next tabs by `g t t t t`...(each `t` select `next-tab`).
- And you want to select previous tabs by `g T T T T`...(each `T` select `previous-tab`).
- You can do that with following `config.cson` and `keymap.cson`.

`config.cson`

```coffeescript
  submode:
    submode:
      "gt-mode":
        target: "atom-pane"
        commands: [
          "vim-mode-plus:next-tab" # `g t`
          "vim-mode-plus:previous-tab" # `g T`
        ]
```

`keymap.cson`

```coffeescript
'atom-pane.gt-mode':
  't': 'vim-mode-plus:next-tab'
  'T': 'vim-mode-plus:previous-tab'

# To win over default `t` in text-editor scope.
'atom-pane.gt-mode atom-text-editor.vim-mode-plus':
  't': 'vim-mode-plus:next-tab'
  'T': 'vim-mode-plus:previous-tab'
```
