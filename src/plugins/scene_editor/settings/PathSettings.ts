import { AbstractSettings } from "./AbstractSettings";
import { PathView } from "../../../core/models/views/PathView";

export enum PathPropType {
    NAME = 'name'
}

export class PathSettings extends AbstractSettings<PathPropType> {
    static type = 'path-settings';
    getName() { return PathSettings.type; }
    path: PathView;

    protected getProp(prop: PathPropType) {
        switch (prop) {
            case PathPropType.NAME:
                return this.path.id;
        }
    }

    protected setProp(val: any, prop: PathPropType) {
        switch (prop) {
            case PathPropType.NAME:
                this.path.id = val;
                break;
        }
    }
}