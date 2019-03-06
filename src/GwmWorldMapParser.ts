import { GwmWorldItem } from './model/GwmWorldItem';
import _ = require('lodash');
import { GwmWorldItemGenerator } from './parsing/GwmWorldItemGenerator';
import { CombinedWorldItemGenerator } from './parsing/decorators/CombinedWorldItemGenerator';
import { AdditionalDataConverter, AdditionalDataConvertingWorldItemDecorator } from './parsing/decorators/AdditionalDataConvertingWorldItemDecorator';
import { ScalingWorldItemGeneratorDecorator } from './parsing/decorators/ScalingWorldItemGeneratorDecorator';
import { HierarchyBuildingWorldItemGeneratorDecorator } from './parsing/decorators/HierarchyBuildingWorldItemGeneratorDecorator';
import { FurnitureInfoGenerator } from './parsing/furniture_parsing/FurnitureInfoGenerator';
import { RoomInfoGenerator } from './parsing/room_parsing/RoomInfoGenerator';
import { RootWorldItemGenerator } from './parsing/RootWorldItemGenerator';
import { WorldMapToMatrixGraphConverter } from './matrix_graph/conversion/WorldMapToMatrixGraphConverter';

export interface ParseOptions<T> {
    xScale: number;
    yScale: number;
    additionalDataConverter: AdditionalDataConverter<T>;
    charactersToInclude?: string[];
    charactersToExclude?: string[];
}

export const defaultParseOptions: ParseOptions<any> = {
    xScale: 1,
    yScale: 1,
    additionalDataConverter: _.identity
}

/**
 * Generates a list of `GwmWorldItem` objects, which describe your world, based on a `gwm (game world map)` format
 * string.
 */
export class GwmWorldMapParser {
    private worldItemGenerator: GwmWorldItemGenerator;

    private constructor(worldItemGenerator: GwmWorldItemGenerator =
            new AdditionalDataConvertingWorldItemDecorator(
                new HierarchyBuildingWorldItemGeneratorDecorator(
                    new ScalingWorldItemGeneratorDecorator(
                        new CombinedWorldItemGenerator()
                    ),
                    ['room'],
                    ['bed', 'cupboard']
                ),
            )
        ) {
        this.worldItemGenerator = worldItemGenerator;
    }

    public parse(worldMap: string): GwmWorldItem[] {
        return this.worldItemGenerator.generateFromStringMap(worldMap);
    }

    public static createWithOptions<T>(options: ParseOptions<T> = defaultParseOptions): GwmWorldMapParser {
        return new GwmWorldMapParser(
            new AdditionalDataConvertingWorldItemDecorator<T>(
                new HierarchyBuildingWorldItemGeneratorDecorator(
                    new ScalingWorldItemGeneratorDecorator(
                        new CombinedWorldItemGenerator(
                            [
                                new FurnitureInfoGenerator(new WorldMapToMatrixGraphConverter(), options.charactersToInclude),
                                new RoomInfoGenerator(),
                                new RootWorldItemGenerator()
                            ]
                        ),
                        { x: options.xScale, y: options.yScale }
                    ),
                    ['room', 'root'],
                    ['bed', 'cupboard', 'room', 'wall']
                ),
                options.additionalDataConverter
            )
        )
    }

    public static createWithCustomWorldItemGenerator(worldItemGenerator: GwmWorldItemGenerator): GwmWorldMapParser {
        return new GwmWorldMapParser(worldItemGenerator);
    }
}