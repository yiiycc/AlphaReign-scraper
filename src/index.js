import crawl from './crawl';
import { createID } from './utils';
import dgram from 'dgram';
import log from 'fancy-log';
import persist from './persist';
import processMessage from './process/message';

const id = createID();
const socket = dgram.createSocket('udp4');
const data = {
	nodes: {},
	torrents: {},
};

socket.on('error', (error) => log(error));

socket.on('message', (message, rinfo) => processMessage({ id, message, rinfo }, socket, data));

socket.on('listening', () => {
	const address = socket.address();

	log(`client listening ${address.address}:${address.port}`);
	crawl(id, socket, data);
	persist(data);
});

socket.bind(6881);
