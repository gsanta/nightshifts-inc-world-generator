import * as React from 'react';
import styled from 'styled-components';
import { UI_Toolbar } from '../../../elements/toolbar/UI_Toolbar';
import { AppContext, AppContextType } from '../../Context';
import { colors } from '../../styles';
import { UI_ComponentProps } from '../../UI_ComponentProps';
const undoIcon = require('../../../../../../assets/images/icons/undo.svg');
const redoIcon = require('../../../../../../assets/images/icons/redo.svg');
const brushIcon = require('../../../../../../assets/images/icons/brush.svg');
const pathIcon = require('../../../../../../assets/images/icons/path.svg');
const panIcon = require('../../../../../../assets/images/icons/pan.svg');
const selectIcon = require('../../../../../../assets/images/icons/select.svg');
const deleteIcon = require('../../../../../../assets/images/icons/delete.svg');
const zoomOutIcon = require('../../../../../../assets/images/icons/zoom_out.svg');
const gamesIcon = require('../../../../../../assets/images/icons/games.svg');
const zoomInIcon = require('../../../../../../assets/images/icons/zoom_in.svg');
const fullScreenIcon = require('../../../../../../assets/images/icons/fullscreen.svg');
const fullScreenExitIcon = require('../../../../../../assets/images/icons/fullscreen_exit.svg');
const insertPhotoIcon = require('../../../../../../assets/images/icons/insert_photo.svg');
const videogameAssetIcon = require('../../../../../../assets/images/icons/videogame_asset.svg');
const meshIcon = require('../../../../../../assets/images/icons/mesh.svg');
const spriteIcon = require('../../../../../../assets/images/icons/sprite.svg');
const bIcon = require('../../../../../../assets/images/icons/b.svg');
const playIcon = require('../../../../../../assets/images/icons/play.svg');
const stopIcon = require('../../../../../../assets/images/icons/stop.svg');
const cubeIcon = require('../../../../../../assets/images/icons/cube.png');
const sphereIcon = require('../../../../../../assets/images/icons/sphere.png');
const scaleIcon = require('../../../../../../assets/images/icons/scale.png');
const moveIcon = require('../../../../../../assets/images/icons/move.svg');
const expandMoreIcon = require('../../../../../../assets/images/icons/expand_more.svg');
const lightIcon = require('../../../../../../assets/images/icons/light.svg');
const gridIcon = require('../../../../../../assets/images/icons/grid.svg');
const rotateIcon = require('../../../../../../assets/images/icons/rotate.svg');
const editModeIcon = require('../../../../../../assets/images/icons/edit_mode.svg');

const ToolbarStyled = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    height: 40px;
    padding: 5px 10px;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    background-color: transparent;

    > *:not(:last-child) {
        margin-right: 1px;
    }

    .ce-icon-separator {
        height: 100%;
        width: 10px;
    }

    .ce-tool-section {
        display: flex;
        height: 26px;
    }

    .ce-tool {
        width: 24px;
        height: 24px;
        cursor: pointer;
        margin-right: 3px;

        background: ${colors.grey3};
        background-size: cover;
        background-repeat: no-repeat;

        &:hover, &.ce-tool-active {
            background: ${colors.hoverBackground};
            background-size: cover;
            background-repeat: no-repeat;
        }

        &.undo-icon {
            background-image: url(${undoIcon});
        }

        &.redo-icon {
            background-image: url(${redoIcon});
        }

        &.brush-icon {
            background-image: url(${brushIcon});
        }

        &.path-icon {
            background-image: url(${pathIcon});
        }

        &.pan-icon {
            background-image: url(${panIcon});
        }

        &.select-icon {
            background-image: url(${selectIcon});
        }

        &.delete-icon {
            background-image: url(${deleteIcon});
        }

        &.zoom-in-icon {
            background-image: url(${zoomInIcon});
        }

        &.zoom-out-icon {
            background-image: url(${zoomOutIcon});
        }

        &.fullscreen-icon {
            background-image: url(${fullScreenIcon});
        }

        &.fullscreen-exit-icon {
            background-image: url(${fullScreenExitIcon});
        }

        &.insert-photo-icon {
            background-image: url(${insertPhotoIcon});
        }

        &.videogame-asset-icon {
            background-image: url(${videogameAssetIcon});
        }
        
        &.mesh-icon {
            background-image: url(${meshIcon});
        }

        &.sprite-icon {
            background-image: url(${spriteIcon});
        }

        &.b-icon {
            background-image: url(${bIcon});
        }
        
        &.games-icon {
            background-image: url(${gamesIcon});
        }

        &.play-icon {
            background-image: url(${playIcon});
        }

        &.stop-icon {
            background-image: url(${stopIcon});
        }

        &.cube-icon {
            background-image: url(${cubeIcon});
        }

        &.sphere-icon {
            background-image: url(${sphereIcon});
        }

        &.expand-more-icon {
            background-image: url(${expandMoreIcon});
        }

        &.scale-icon {
            background-image: url(${scaleIcon});
        }

        &.move-icon {
            background-image: url(${moveIcon});
        }

        &.light-icon {
            background-image: url(${lightIcon});
        }

        &.grid-icon {
            background-image: url(${gridIcon});
        }

        &.rotate-icon {
            background-image: url(${rotateIcon});
        }

        &.edit-mode-icon {
            background-image: url(${editModeIcon});
        }
    }

    .ce-toolbar-dropdown {
        display: flex;
        flex-direction: column;

        .ce-toolbar-dropdown-header {
            cursor: pointer;
            background: ${colors.grey3};
            display: flex;
            .ce-menu-expand {
                width: 20px;
                height: 100%;
                background-position: center;
                background-image: url(${expandMoreIcon});
            }
        }

        .ce-toolbar-dropdown-tools {
            background: ${colors.grey4};
            width: 24px;

            .ce-tool {
                margin-bottom: 2px;
            }
        }
    }
`;

export interface ToolbarCompProps extends UI_ComponentProps<UI_Toolbar> {
    toolsLeft: JSX.Element[];
    toolsMiddle: JSX.Element[];
    toolsRight: JSX.Element[];
}

export class ToolbarComp extends React.Component<ToolbarCompProps> {
    static contextType = AppContext;
    context: AppContextType;

    render(): JSX.Element {
        return (
            <ToolbarStyled {...this.props}>
                <div className="ce-tool-section" key="left-section">
                    {this.props.toolsLeft}                    
                </div>
                <div className="ce-tool-section" key="middle-section">
                    {this.props.toolsMiddle}
                </div>
                <div className="ce-tool-section" key="right-section">
                    {this.props.toolsRight}
                </div>
            </ToolbarStyled>
        )
    }
}
