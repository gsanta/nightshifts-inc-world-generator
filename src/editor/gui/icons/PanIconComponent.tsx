import { IconProps, IconStyled, IconImageStyled, IconBackgroundStyled } from "./Icon";
import * as React from 'react';

export function MoveIconComponent(props: IconProps) {

    return (
        <IconStyled viewBox="0 0 24 24" onClick={props.onClick}>
            <IconBackgroundStyled isActive={props.isActive} d="M0 0h24v24H0z" fill="none"/>
            <IconImageStyled isActive={props.isActive} d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/>
        </IconStyled>   
    );
}