import * as React from 'react';
import './RendererComponent.scss'
import { AppContext, AppContextType } from '../../../gui/Context';
import styled from 'styled-components';
import { RendererView } from '../RendererView';
import { WindowToolbarStyled } from '../../../gui/windows/WindowToolbar';
import { RendererToolbarComponent } from './RendererToolbarComponent';

const RendererStyled = styled.div`
    background: #33334C;
    height: 100%;
    color: white;
    position: relative;
`;

const CanvasStyled = styled.canvas`
    display: ${(props: {isEmpty: boolean}) => props.isEmpty ? 'none' : 'block'};
`;

const CanvasOverlayStyled = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
`;

export class RendererComponent extends React.Component {
    static contextType = AppContext;
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    context: AppContextType;

    constructor() {
        super(null);

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.context.getStores().viewStore.getViewById<RendererView>(RendererView.id).setCanvasRenderer(() => this.forceUpdate());

        setTimeout(() => {
            this.context.controllers.setup(this.canvasRef.current);
            this.context.controllers.getWindowControllerByName('renderer').update();
        }, 1000);

    }

    componentDidUpdate() {
        this.context.controllers.getWindowControllerByName('renderer').resize();
    }

    render() {
        const view = this.context.getStores().viewStore.getViewById<RendererView>(RendererView.id);

        return (
                <RendererStyled>
                    <WindowToolbarStyled><RendererToolbarComponent/></WindowToolbarStyled>
                    <CanvasStyled
                        isEmpty={false}
                        id="canvas"
                        ref={this.canvasRef}
                    />
                    <CanvasOverlayStyled
                        onMouseDown={(e) => this.context.getServices().mouseService().onMouseDown(e.nativeEvent)}
                        onMouseMove={(e) => this.context.getServices().mouseService().onMouseMove(e.nativeEvent)}
                        onMouseUp={(e) => this.context.getServices().mouseService().onMouseUp(e.nativeEvent)}
                        onMouseLeave={(e) => this.context.getServices().mouseService().onMouseOut(e.nativeEvent)}
                        onMouseOver={() => view.over()}
                        onMouseOut={() => view.out()}
                    />
                </RendererStyled>
        );
    }

}