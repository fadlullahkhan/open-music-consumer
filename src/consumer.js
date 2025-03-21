import 'dotenv/config';
import amqp from 'amqplib';
import PlaylistsServices from './PlaylistsServices.js';
import MailSender from './MailSender.js';
import Listener from './listener.js';

const init = async () => {
  const playlistsServices = new PlaylistsServices();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsServices, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlists', {
    durable: true,
  });

  channel.consume('export:playlists', listener.listen, { noAck: true });
};

init();
