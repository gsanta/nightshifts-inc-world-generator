Feature: Rotate node

    Scenario: Rotate mesh with keys
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          |
            | mesh-view  | 50:50,60:60     |
        When change canvas to 'node-editor' 
        And hover over canvas 'node-editor'
        And drop node 'keyboard-node-obj' at '100:100'
        And drop node 'rotate-node-obj' at '400:100'
        And drop node 'rotate-node-obj' at '400:400'
        And change param to 'a' in controller 'key1' of view 'node-view-1'
        And change param to 'd' in controller 'key2' of view 'node-view-1'
        And change param to 'mesh-obj-1' in controller 'mesh' of view 'node-view-2'
        And change param to 'mesh-obj-1' in controller 'mesh' of view 'node-view-3'
        And change param to 'right' in controller 'rotate' of view 'node-view-3'
        And mouse drags from view 'node-view-1.key1' to view 'node-view-2.input'
        And mouse drags from view 'node-view-1.key2' to view 'node-view-3.input'
        Then canvas contains:
            | Id                     | Bounds            |
            | node-view-1            | 100:65,300:220    |
            | node-view-2            | 400:100,600:240   |
            | node-view-3            | 400:400,600:540   |
            | node-connection-view-1 | 300:122.5,400:140 |
            | node-connection-view-2 | 300:157.5,400:440 |
        Then obj properties are:
            | Id          | Rotation  |
            | mesh-obj-1  | 0:0:0     |
        When hover over canvas 'game-viewer'
        And press key 'a' on canvas 'game-viewer'
        Then obj properties are:
            | Id          | Rotation  |
            | mesh-obj-1  | 0:-6:0    |
        And press key 'd' on canvas 'game-viewer'
        And press key 'd' on canvas 'game-viewer'
        Then obj properties are:
            | Id          | Rotation  |
            | mesh-obj-1  | 0:6:0     |
        
