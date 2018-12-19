import { GameObjectParser } from './GameObjectParser';
import { expect } from 'chai';
import * as fs from 'fs';
import { Rectangle } from './model/Rectangle';
import { GameObject } from './GameObject';


describe('GameObjectParser', () => {
    describe('parse', () => {
        it('creates GameObjects from a GameMap string', () => {
            const file = fs.readFileSync(__dirname + '/../assets/test/test1.gwm', 'utf8');
            const gameObjectParser = new GameObjectParser();

            const gameObjects = gameObjectParser.parse(file)
            expect(gameObjects.length).to.equal(7);
            expect(gameObjects[0]).to.eql(new GameObject('W', new Rectangle(1, 1, 1, 3), 'wall'), 'gameObject[0] is not correct');
            expect(gameObjects[1]).to.eql(new GameObject('W', new Rectangle(8, 1, 1, 3), 'wall'), 'gameObject[1] is not correct');
            expect(gameObjects[2]).to.eql(new GameObject('W', new Rectangle(2, 1, 2, 1), 'wall'), 'gameObject[2] is not correct');
            expect(gameObjects[3]).to.eql(new GameObject('W', new Rectangle(2, 3, 6, 1), 'wall'), 'gameObject[3] is not correct');
            expect(gameObjects[4]).to.eql(new GameObject('W', new Rectangle(6, 1, 2, 1), 'wall'), 'gameObject[4] is not correct');
            expect(gameObjects[5]).to.eql(new GameObject('I', new Rectangle(4, 1, 2, 1), 'window'), 'gameObject[5] is not correct');
        });
    });
});
