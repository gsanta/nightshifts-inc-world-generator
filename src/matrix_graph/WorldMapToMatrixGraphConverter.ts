import { WorldMapLineListener, WorldMapReader } from '../matrix_graph/WorldMapReader';
import { LinesToGraphConverter } from './LinesToGraphConverter';
import { DetailsLineToObjectConverter, DetailsLineDataTypes } from './DetailsLineToObjectConverter';
import { MatrixGraph } from './MatrixGraph';

interface DetailsJsonSchema {
    attributes: {
        pos: {
            x: number;
            y: number;
        }
    }[];
}

export class WorldMapToMatrixGraphConverter implements WorldMapLineListener {
    private linesToGraphConverter: LinesToGraphConverter;
    private worldMapReader: WorldMapReader;

    private worldMapLines: string[];
    private detailsLines: string[] = [];
    private charachterToNameMap: {[key: string]: string};
    private detailsSectionStr: string = '';
    private vertexAdditinalData: {[key: number]: any} = {};
    private detailsLineToObjectConverter: DetailsLineToObjectConverter;

    private static DEFINITION_SECTION_LINE_TEST = /^\s*(\S)\s*\=\s*(\S*)\s*$/;

    constructor() {
        this.worldMapReader = new WorldMapReader(this);
    }

    public convert(worldmap: string): MatrixGraph {
        this.worldMapLines = [];
        this.charachterToNameMap = {};

        this.linesToGraphConverter = new LinesToGraphConverter();
        this.detailsLineToObjectConverter = new DetailsLineToObjectConverter({
            pos: DetailsLineDataTypes.COORDINATE,
            axis: DetailsLineDataTypes.COORDINATE,
            axis1: DetailsLineDataTypes.COORDINATE,
            axis2: DetailsLineDataTypes.COORDINATE,
            angle: DetailsLineDataTypes.NUMBER
        });
        return this.stringToGraph(worldmap);
    }

    private stringToGraph(worldmap: string): MatrixGraph {
        this.worldMapReader.read(worldmap);

        let attributes = (<DetailsJsonSchema> JSON.parse(`{${this.detailsSectionStr}}`)).attributes || [];

        const newAttributes = this.detailsLines.map(line => this.convertDetailsLineToAdditionalData(line));

        attributes = [...attributes, ...newAttributes ]

        attributes.forEach(attribute => {
            const vertex = this.worldMapLines[0].length * attribute.pos.y + attribute.pos.x;
            this.vertexAdditinalData[vertex] = attribute
        });

        return this.linesToGraphConverter.parse(this.worldMapLines, this.charachterToNameMap, this.vertexAdditinalData);
    }

    private convertDetailsLineToAdditionalData(line: string): any {
        return this.detailsLineToObjectConverter.convert(line);
    }

    public addMapSectionLine(line: string) {
        this.worldMapLines.push(line.trim())
    }

    public addDefinitionSectionLine(line: string) {
        const match = line.match(WorldMapToMatrixGraphConverter.DEFINITION_SECTION_LINE_TEST);
        this.charachterToNameMap[match[1]] = match[2];    }

    public addDetailsSectionLine(line: string) {
        this.detailsSectionStr += line;
    }

    public addSeparator() {}
}