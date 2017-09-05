'use strict'

const BUFFERSIZE = 120;

import { pos, v_add, NETOFFSIZE } from './Globals/Globals';

class Player{
    constructor(socket){
        this._socket = socket;
        this._id = socket.id;
        this._inputSequence = 0;
        this._lastInputSequence;
        this._inputArray = [];
        this._movementSpeed = 120;
        this._currentState = {
            x: 0, 
            y: 0
        }
        this._lastState = {
            x: 0, 
            y: 0
        }
        this._position = {
            x: 0, 
            y: 0
        }
        this._lastPosition = {
            x: 0, 
            y: 0
        }
        this._size = {
            x: 32, 
            y: 32
        } 
    }

    update(){
        this.updatePhysics();
    }

    updatePhysics(){
        this._lastState = pos(this._position)
        let newDir = this.processInput();
        this._position = v_add(this._lastState, newDir);
        this._inputArray = [];
    }

    processInput(){
        let _x = 0;
        let _y = 0;

        if(this._inputArray.length){        
            for(let item of this._inputArray){            
                if(item.seq <= this._lastInputSequence) continue;            
                for(let m of item.move){
                    if(m === 'R'){                    
                        _x += 1;
                    }
                    if(m === 'L'){                    
                        _x -= 1;
                    }
                    if(m === 'U'){                    
                        _y -= 1;
                    }
                    if(m === 'D'){                    
                        _y += 1;
                    }
                }
            }
            this._lastInputSequence = this._inputArray[this._inputArray.length - 1].seq;
        }
        return this.vectorFromDirection(_x, _y);
        
        // Should check for collisions afterwards
    }

    addInput(data){
        this._inputArray.push(data);
    }

    vectorFromDirection(_x,_y) {
        return {
            x : (_x * (this._movementSpeed * NETOFFSIZE)).fixed(3),
            y : (_y * (this._movementSpeed * NETOFFSIZE)).fixed(3),
        }
    }

    set id(id){this._id = id;}
    get id(){return this._id;}
    set position(position){this._position = position;}
    get position(){return this._position;}
    get lastInputSequence(){return this._lastInputSequence;}    
}
export default Player;

