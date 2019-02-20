// *******************************************
// My ScreenShot Extension
// *******************************************
function ScreenShotExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
  }
  
  ScreenShotExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
  ScreenShotExtension.prototype.constructor = ScreenShotExtension;
  
  ScreenShotExtension.prototype.load = function () {
    if (this.viewer.toolbar) {
      // Toolbar is already available, create the UI
      this.createUI();
    } else {
      // Toolbar hasn't been created yet, wait until we get notification of its creation
      this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
      this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    }
    return true;
  };
  
  ScreenShotExtension.prototype.onToolbarCreated = function () {
    this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
  };
  
  ScreenShotExtension.prototype.createUI = function () {
    var _this = this;
  
    // prepare to execute the button action
    var ScreenShotToolbarButton = new Autodesk.Viewing.UI.Button('runScreenShotCode');
    ScreenShotToolbarButton.onClick = function (e) {

        simulateDownload = function (blobUrl) {
            let a = document.createElement("a");
            a.style = "display: none";
            a.href = blobUrl;
            a.download = "fileName.png";
            a.click();
        }

        // Get the full image
        _this.viewer.getScreenShot(viewer.container.clientWidth, viewer.container.clientHeight, function (blobURL) {
            simulateDownload(blobURL);
        });
     
    };
    // ScreenShotToolbarButton CSS class should be defined on your .css file
    // you may include icons, below is a sample class:
    ScreenShotToolbarButton.addClass('ScreenShotToolbarButton');
    ScreenShotToolbarButton.setToolTip('My ScreenShot extension');
  
    // SubToolbar
    this.subToolbar = (this.viewer.toolbar.getControl("MyAppToolbar") ?
      this.viewer.toolbar.getControl("MyAppToolbar") :
      new Autodesk.Viewing.UI.ControlGroup('MyAppToolbar'));
    this.subToolbar.addControl(ScreenShotToolbarButton);
  
    this.viewer.toolbar.addControl(this.subToolbar);
  };
  
  ScreenShotExtension.prototype.unload = function () {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
  };
  
  Autodesk.Viewing.theExtensionManager.registerExtension('ScreenShotExtension', ScreenShotExtension);
  