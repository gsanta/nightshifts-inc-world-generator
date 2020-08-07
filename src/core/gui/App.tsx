import 'bootstrap/dist/css/bootstrap.min.css';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import * as React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import Split from 'split.js';
import 'tippy.js/dist/tippy.css';
import { GameViewerPluginId } from '../../plugins/game_viewer/GameViewerPlugin';
import './App.scss';
import { AppContext, AppContextType } from './Context';
import { DialogManagerComponent } from './dialogs/DialogManagerComponent';
import { HotkeyInputComponent } from './HotkeyInputComponent';
import { SpinnerOverlayComponent } from './misc/SpinnerOverlayComponent';
import { SidePanelComponent } from './SidePanelComponent';
import { MainPanelComp } from './regions/MainPanelComp';
import { SceneEditorPerspectiveName } from '../services/UI_PerspectiveService';
import { UI_Region } from '../UI_Plugin';
import { AbstractPlugin } from '../AbstractPlugin';

export interface AppState {
    isDialogOpen: boolean;
    isHowToIntegrateDialogOpen: boolean;
    isAboutDialogOpen: boolean;
    isEditorOpen: boolean;
}

export class App extends React.Component<{}, AppState> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: {}) {
        super(props);

        this.state = {
            isDialogOpen: false,
            isHowToIntegrateDialogOpen: false,
            isAboutDialogOpen: false,
            isEditorOpen: true
        }
    }

    componentDidMount() {
        this.context.registry.services.render.setFullRepainter(() => this.forceUpdate());
        this.context.controllers.setRenderer(() => this.forceUpdate());
        if (this.context.registry.plugins.visibilityDirty) {
            this.context.registry.services.uiPerspective.layoutHandler.buildLayout();
            this.context.registry.plugins.visibilityDirty = false;
        }

        // TODO: find a better place
        window.addEventListener('resize', () => {
            this.context.registry.services.uiPerspective.layoutHandler.resizePlugins();
        });


        setTimeout(() => this.context.controllers.setup(document.querySelector(`#${GameViewerPluginId}`)), 100);

        document.getElementsByTagName('body')[0].addEventListener('onfocus', () => {
            console.log('body focus')
        });

        // TODO: find a better place
        this.context.registry.services.uiPerspective.activatePerspective(SceneEditorPerspectiveName);
    }

    componentDidUpdate() {
        if (this.context.registry.plugins.visibilityDirty) {
            this.context.registry.services.uiPerspective.layoutHandler.buildLayout();
            this.context.registry.services.uiPerspective.layoutHandler.resizePlugins();
            this.context.registry.plugins.visibilityDirty = false;
        }
    }
    
    render() {
        return (
            <div className="style-nightshifs">
                <DndProvider backend={Backend}>
                    <div className="main-content" key="main-content">
                        <div id="sidepanel" >
                            <SidePanelComponent isEditorOpen={this.state.isEditorOpen} toggleEditorOpen={() => this.setState({isEditorOpen: !this.state.isEditorOpen})}/>
                        </div>
                        <MainPanelComp region={UI_Region.Canvas1}/>
                        <MainPanelComp region={UI_Region.Canvas2}/>
                    </div>
                    {this.context.controllers.isLoading ? <SpinnerOverlayComponent key="spinner"/> : null}
                    <DialogManagerComponent/>
                    <HotkeyInputComponent key="hotkey-input" registry={this.context.registry}/>
                </DndProvider>
            </div>
        );
    }
}