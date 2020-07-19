import * as React from 'react';
import styled from 'styled-components';
import { RedoIconComponent } from '../../../plugins/common/toolbar/icons/RedoIconComponent';
import { UndoIconComponent } from '../../../plugins/common/toolbar/icons/UndoIconComponent';
import { ToolbarComponent } from '../../../plugins/common/toolbar/ToolbarComponent';
import { ToolType } from '../../../plugins/common/tools/Tool';
import { MeshViewContainerComponent } from '../../../plugins/scene_editor/components/MeshViewComponent';
import { PathViewContainerComponent } from '../../../plugins/scene_editor/components/PathViewComponent';
import { SceneEditorPlugin, SceneEditorPluginId } from '../../../plugins/scene_editor/SceneEditorPlugin';
import { AbstractPlugin } from '../../AbstractPlugin';
import { View } from '../../models/views/View';
import { PathMarkersComponent } from '../../services/export/PathMarkersComponent';
import { WheelListener } from '../../services/WheelListener';
import { AppContext, AppContextType } from '../Context';
import { colors } from '../styles';

const EditorComponentStyled = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

const SceneEditorComponentStyled = styled.svg`
    width: 100%;
    height: 100%;
    background: ${colors.panelBackgroundMedium};
`;

const SelectionComponentStyled = styled.rect`
    stroke: red;
    stroke-width: 1px;
    fill: transparent;
`;

export class SvgCanvasComp extends React.Component<{plugin: AbstractPlugin}> {
    static contextType = AppContext;
    context: AppContextType;
    protected ref: React.RefObject<HTMLDivElement>;
    protected noRegisterKeyEvents = false;
    private wheelListener: WheelListener;

    componentDidMount() {
        this.wheelListener = new WheelListener(this.context.registry);

        setTimeout(() => {
            this.props.plugin.componentMounted(this.ref.current);
            this.props.plugin.resize();
        }, 0);
    }

    render(): JSX.Element {
        const hover = (item: View) => this.context.registry.services.mouse.hover(item);
        const unhover = (canvasItem: View) => this.context.registry.services.mouse.unhover(canvasItem);
        
        const plugin = this.context.registry.plugins.getViewById<SceneEditorPlugin>(SceneEditorPluginId);
        const history = this.context.registry.services.history;

        return (
            <EditorComponentStyled ref={this.ref} id={plugin.id} style={{cursor: plugin.getActiveTool().getCursor()}}>
                <ToolbarComponent
                    tools={[ToolType.Rectangle, ToolType.Path, ToolType.Select, ToolType.Delete, ToolType.Camera]}
                    view={plugin}
                    renderFullScreenIcon={true}
                >
                    <UndoIconComponent key={'undo-icon'} isActive={false} disabled={!history.hasUndoHistory()} onClick={() => history.undo()} format="short"/>
                    <RedoIconComponent key={'redo-icon'} isActive={false} disabled={!history.hasRedoHistory()} onClick={() => history.redo()} format="short"/>

                </ToolbarComponent>
                <SceneEditorComponentStyled
                    tabIndex={0}
                    viewBox={plugin.getCamera().getViewBoxAsString()}
                    id={this.context.controllers.svgCanvasId}
                    onMouseDown={(e) => this.context.registry.services.mouse.onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => this.context.registry.services.mouse.onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => this.context.registry.services.mouse.onMouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => this.context.registry.services.mouse.onMouseOut(e.nativeEvent)}
                    onKeyDown={e => this.context.registry.services.keyboard.onKeyDown(e.nativeEvent)}
                    onKeyUp={e => this.context.registry.services.keyboard.onKeyUp(e.nativeEvent)}
                    onMouseOver={() => plugin.over()}
                    onMouseOut={() => plugin.out()}
                    onWheel={(e) => this.wheelListener.onWheel(e.nativeEvent)}
                >
                    <defs>
                        <PathMarkersComponent/>
                    </defs>
                    {this.props.children}
                    <MeshViewContainerComponent hover={hover} unhover={unhover} registry={this.context.registry} renderWithSettings={false}/>
                    <PathViewContainerComponent hover={hover} unhover={unhover} registry={this.context.registry} renderWithSettings={false}/>
                    {this.renderFeedbacks()}
                </SceneEditorComponentStyled>
            </EditorComponentStyled>
        );
    }

    private renderFeedbacks(): JSX.Element {
        const feedback = this.context.registry.stores.feedback.rectSelectFeedback;

        if (feedback && feedback.isVisible) {
            const rect = this.context.registry.stores.feedback.rectSelectFeedback.rect;
            return (
                <SelectionComponentStyled 
                    x={rect.topLeft.x}
                    y={rect.topLeft.y}
                    width={rect.getWidth()}
                    height={rect.getHeight()}
                />
            );
        }

        return null;
    }
}