'use babel';

import { CompositeDisposable } from 'atom'

export default {
  disposables: new CompositeDisposable(),
  visible: null,
  dispatch: true,

  activate () {
    const command = 'tree-view:reveal-active-file'
    const pkg = atom.packages.getLoadedPackage('tree-view')
    const item = pkg.mainModule.treeView
    const dock = atom.workspace.paneContainerForItem(item)

    this.visible = (dock !== undefined && dock.isVisible())

    const revealActiveFile = () => {
      if (!this.dispatch || !this.visible) return

      this.dispatch = false

      let pane = atom.workspace.getActivePane()
      let view = atom.views.getView(atom.workspace)

      atom.commands.dispatch(view, command)
        .then(done => {
          pane.activate()
          this.dispatch = true
        })
    }

    const dockVisible = visible => {
      this.visible = visible
      revealActiveFile()
    }
    
    if (dock !== undefined) this.disposables.add(dock.onDidChangeVisible(dockVisible))
    this.disposables.add(atom.workspace.onDidChangeActivePaneItem(revealActiveFile))

    revealActiveFile()
  },

  deactivate () {
    this.disposables.dispose()
  }
}
