import * as React from "react";
import { AppContext, AppContextType } from "../gui/Context";
import { FullScreenExitIconComponent } from "../gui/icons/FullScreenExitIconComponent";
import { FullScreenIconComponent } from "../gui/icons/FullScreenIconComponent";
import { UpdateTask } from "../services/UpdateServices";
import styled from 'styled-components';
import { colors } from '../gui/styles';

const ToolbarStyled = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;

    > *:not(:last-child) {
        margin-right: 1px;
    }
`;

const ToolGroupStyled = styled.div`
    display: flex;
    border: 1px solid ${colors.panelBackgroundLight};
`;

export abstract class AbstractToolbarComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;
    protected viewId: string;

    constructor(viewId: string, props: {}) {
        super(props);

        this.viewId = viewId;
    }
    
    componentDidMount() {
        this.context.getServices().update.addSettingsRepainter(() => this.forceUpdate());
    }

    render(): JSX.Element {

        return (
            <ToolbarStyled>
                <ToolGroupStyled>
                    {this.renderLeftToolGroup()}
                </ToolGroupStyled>
                <ToolGroupStyled>
                    {this.renderRightToolGroup()}
                </ToolGroupStyled>
            </ToolbarStyled>
        );
    }

    protected abstract renderLeftToolGroup(): JSX.Element;
    protected abstract renderRightToolGroup(): JSX.Element;
    
    renderFullScreenIcon(): JSX.Element {
        const viewStore = this.context.getStores().viewStore;
        const view = this.context.getStores().viewStore.getViewById(this.viewId);

        return viewStore.getFullScreen() === view ? 
            <FullScreenExitIconComponent isActive={false} onClick={() => this.exitFullScreen()} format="short"/> :
            <FullScreenIconComponent isActive={false} onClick={() => this.enterFullScreen()} format="short"/>;
    }
    
    private enterFullScreen() {
        const view = this.context.getStores().viewStore.getViewById(this.viewId);

        this.context.getStores().viewStore.setFullScreen(view);
        this.context.getServices().update.runImmediately(UpdateTask.Full);
    }

    private exitFullScreen() {
        this.context.getStores().viewStore.setFullScreen(undefined);
        this.context.getServices().update.runImmediately(UpdateTask.Full);
    }
}