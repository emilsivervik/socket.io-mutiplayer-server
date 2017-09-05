'use strict'

import Player from './Player';

import { arrayObjectIndexOf } from './Globals/Globals';

class Server{
	constructor(_io){
		this.clientList = [];
		this.io = _io;

		this.localTime = 0.016;
		this._dt = Date.now();
		this._dte = Date.now();

		this.initIO();
		this.initLoops();
	}

	initLoops(){
		setInterval(this.update.bind(this), 1000 / 45);
		setInterval(this.updatePhysics.bind(this), 1000 / 15);
		setInterval(function(){
			this._dt = Date.now() - this._dte;
			this._dte = Date.now();
			this.localTime += this._dt/1000.0;
		}.bind(this), 4);
	}

	update(){
		if(this.clientList.length){
			const clientArr = this.clientList.map((element) => {
				return {
					id: element.id,
					position: element.position,
					seq: element.lastInputSequence,
					time: this.localTime
				};
			})
			this.io.sockets.emit('tcUpdateClient', {
				serverTime: this.localTime, 
				clients: clientArr
			})
		}
	}

	updatePhysics(){
		for(let client of this.clientList){
			client.update();
		}
	};

	initIO(){
		this.io.on('connection', (client) => {	
			this.addClient(client);
			
			client.on('disconnect', () =>{
				this.removeClient(client)
			});	
		});
	}

	addClient(client){
		// Welcome new client.
		client.emit('tcWelcome', client.id);

		if(this.clientList.length > 0){
			// Filter out only Client ID's of current clients.
			const clientIdList = this.clientList.map((element) => {
				return element.id;
			})			
			// Send connected clients ID's to new client if there are any clients.			
			client.emit('tcSendCurClients', clientIdList)
		}
		
		// Create a new instance of player in the clientList.
		this.clientList.push(new Player(client));
		
		// Broadcast to all clients that a new client has connected.
		client.broadcast.emit('tcClientCon', client.id)

		client.on('tsSendMovementUpdate', (data) => {
			let index = arrayObjectIndexOf(this.clientList, client.id, "id");
			//this.clientList[index].setPosition(data.position);
			//this.clientList[index].setSequanceInput(data.seq);
			this.clientList[index].addInput(data);
		});
	}

	removeClient(client){
		// Find and remove client.

		let index = arrayObjectIndexOf(this.clientList, client.id, "id");
		this.clientList.splice(index, 1);

		// Broadcast to all clients that a client has left.
		client.broadcast.emit('tcClientDisc', client.id)
	}
}

export default Server;