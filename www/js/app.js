let my_viewerApp = null;

function setupViewer(divId, documentId, tokenFetchingUrl, exrtensionArray) {

    let viewerApp = new Autodesk.Viewing.ViewingApplication(divId);
    my_viewerApp = viewerApp;

    let options = {
        env: 'AutodeskProduction',
        getAccessToken: (onGetAccessToken) => {
            fetch(tokenFetchingUrl)
                .then(response => response.json())
                .then(data => {

                    let accessToken = data["access_token"];
                    let expireTimeSeconds = data["expires_in"];
                    onGetAccessToken(accessToken, expireTimeSeconds);
                })


        },
        useADP: false,
    };

    let config3d = {
        extensions: extensionArray
    };


    Autodesk.Viewing.Initializer(options, function onInitialized() {
        viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D, config3d);
        viewerApp.loadDocument(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
    });

    // Init after the viewer is ready
    function onDocumentLoadSuccess() {
        let viewables = viewerApp.bubble.search({
            'type': 'geometry'
        });
        if (viewables.length === 0) {
            console.error('Document contains no viewables.');
            return;
        }
        // Choose any of the available viewables
        viewerApp.selectItem(viewables[0].data, onItemLoadSuccess, onItemLoadFail);

    }

    function onDocumentLoadFailure(viewerErrorCode) {
        console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
    }

    function onItemLoadSuccess(active_viewer, item) {
        console.log('Document loaded successfully');
        viewer = active_viewer;
        // add grid
        let grid = new THREE.GridHelper(200, 10);
        // grid.position.y = -29;
        grid.position.y = 3;
        grid.material.opacity = 0.5;
        grid.material.transparent = true;
        viewer.impl.scene.add(grid);
        viewer.impl.sceneUpdated(true);
    
        viewer.prefs.tag('ignore-producer');
    }
    function onItemLoadFail(errorCode) {
        console.error('onItemLoadFail() - errorCode:' + errorCode);
    }


    return viewerApp.getCurrentViewer();
}