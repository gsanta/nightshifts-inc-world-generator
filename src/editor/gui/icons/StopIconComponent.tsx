import * as React from 'react';
import { colors } from '../styles';
import { IconStyled, IconForgroundStyled, IconBackgroundStyled, IconProps } from './Icon';


export function StopIconComponent(props: IconProps) {
    return (
        <IconStyled  height="24" viewBox="0 0 24 24" width="24" onClick={props.onClick} disabled={props.disabled}>
            <IconForgroundStyled color={colors.textColor} disabled={props.disabled} d="M6 6h12v12H6z"/>
            <IconBackgroundStyled d="M0 0h24v24H0z" fill="none"/>
        </IconStyled>
    );
}