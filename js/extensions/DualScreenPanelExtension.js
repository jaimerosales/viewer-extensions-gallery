// *******************************************
// DualScreen Panel Extension
// *******************************************
function DualScreenPanelExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.panel = null; // create the panel variable
}

DualScreenPanelExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
DualScreenPanelExtension.prototype.constructor = DualScreenPanelExtension;

DualScreenPanelExtension.prototype.load = function () {
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

DualScreenPanelExtension.prototype.onToolbarCreated = function () {
    this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
};

DualScreenPanelExtension.prototype.createUI = function () {
    var _this = this;

    // prepare to execute the button action
    var DualScreenPanelToolbarButton = new Autodesk.Viewing.UI.Button('runDualScreenPanelCode');
    DualScreenPanelToolbarButton.onClick = function (e) {

       

        alert("open 2D dock and testing new deployment pipeline")

    };
    // DualScreenPanelToolbarButton CSS class should be defined on your .css file
    // you may include icons, below is a sample class:
    DualScreenPanelToolbarButton.addClass('DualScreenToolbarButton');
    DualScreenPanelToolbarButton.setToolTip('Dual Screen Summary');

    // SubToolbar
    this.subToolbar = (this.viewer.toolbar.getControl("MyAppToolbar") ?
        this.viewer.toolbar.getControl("MyAppToolbar") :
        new Autodesk.Viewing.UI.ControlGroup('MyAppToolbar'));
    this.subToolbar.addControl(DualScreenPanelToolbarButton);

    this.viewer.toolbar.addControl(this.subToolbar);
};



DualScreenPanelExtension.prototype.unload = function () {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('DualScreenPanelExtension', DualScreenPanelExtension);
