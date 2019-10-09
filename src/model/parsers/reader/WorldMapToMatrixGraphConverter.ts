import { LinesToGraphConverter } from './LinesToGraphConverter';
import { CharGraph } from '../CharGraph';
import { DetailsLineToObjectConverter, DetailsLineDataTypes } from './DetailsLineToObjectConverter';
import { WorldMapLineListener, WorldMapReader } from './WorldMapReader';
import { ServiceFacade } from '../../services/ServiceFacade';


export class WorldMapToMatrixGraphConverter extends WorldMapLineListener {
    private linesToGraphConverter: LinesToGraphConverter;
    private worldMapReader: WorldMapReader;

    private worldMapLines: string[];
    private detailsLines: string[] = [];
    private charachterToNameMap: {[key: string]: string};
    private vertexAdditinalData: {[key: number]: any} = {};
    private detailsLineToObjectConverter: DetailsLineToObjectConverter;
    private services: ServiceFacade<any, any, any>

    private static DEFINITION_SECTION_LINE_TEST = /^\s*(\S)\s*\=\s*(\S*)\s*$/;

    constructor(services: ServiceFacade<any, any, any>) {
        super();
        this.services = services;
        this.worldMapReader = new WorldMapReader(this);
    }

    public convert(worldmap: string): CharGraph {
        this.worldMapLines = [];
        this.charachterToNameMap = {};

        this.linesToGraphConverter = new LinesToGraphConverter(this.services);
        this.detailsLineToObjectConverter = new DetailsLineToObjectConverter({
            pos: DetailsLineDataTypes.COORDINATE,
            axis: DetailsLineDataTypes.COORDINATE,
            axis1: DetailsLineDataTypes.COORDINATE,
            axis2: DetailsLineDataTypes.COORDINATE,
            angle: DetailsLineDataTypes.NUMBER
        });
        return this.stringToGraph(worldmap);
    }

    private stringToGraph(worldmap: string): CharGraph {
        this.worldMapReader.read(worldmap);

        const attributes = this.detailsLines.map(line => this.convertDetailsLineToAdditionalData(line));

        attributes.forEach(attribute => {
            const vertex = this.worldMapLines[0].length * attribute.pos.y + attribute.pos.x;
            this.vertexAdditinalData[vertex] = attribute
        });

        return this.linesToGraphConverter.parse(this.worldMapLines, this.charachterToNameMap);
    }

    private convertDetailsLineToAdditionalData(line: string): any {
        return this.detailsLineToObjectConverter.convert(line);
    }

    public addMapSectionLine(line: string) {
        this.worldMapLines.push(line.trim())
    }

    public addDefinitionSectionLine(line: string) {
        const match = line.match(WorldMapToMatrixGraphConverter.DEFINITION_SECTION_LINE_TEST);
        this.charachterToNameMap[match[1]] = match[2];
    }

    public addDetailsSectionLine(line: string) {
        this.detailsLines.push(line);
    }

    public addSeparator() {}
}