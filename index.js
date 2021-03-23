var amqp = require('amqplib/callback_api');
const { squaredSticker } = require('./utils/squaredSticker');
const { translucentStickerWithoutUrl } = require('./utils/translucentStickerWithoutUrl');
const {circleSticker} = require('./utils/circleSticker');

const connection = 'amqps://famkfurb:QM2wh1r-STWKRNCq9nV_dda_OFjDiyUI@fox.rmq.cloudamqp.com/famkfurb';

amqp.connect(connection, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    console.log("Worker Iniciado")

    channel.consume('square_image', async function (msg) {
      const response = JSON.parse(msg.content.toString());
      const responseMessage = await squaredSticker(response);
      await channel.sendToQueue('response_queue', new Buffer.from(JSON.stringify(responseMessage)));
    }, {
      noAck: true
    });
    channel.consume('translucent_image', async function (msg) {
      const response = JSON.parse(msg.content.toString());
      const responseMessage = await translucentStickerWithoutUrl(response);
      await channel.sendToQueue('response_queue', new Buffer.from(JSON.stringify(responseMessage)));
    }, {
      noAck: true
    });
    channel.consume('circular_image', async function (msg) {
      const response = JSON.parse(msg.content.toString());
      const responseMessage = await circleSticker(response);
      await channel.sendToQueue('response_queue', new Buffer.from(JSON.stringify(responseMessage)));
    }, {
      noAck: true
    });
  });
});