const sharp = require("sharp");

async function stickerCircular({ decryptFile, message }) {
  const width = 460,
    r = width / 2,
    circleShape = Buffer.from(
      `<svg><circle cx="${r}" cy="${r}" r="${r}" /></svg>`
    );
  return sharp(new Buffer.from(decryptFile.data))
    .resize({
      width: 512,
      height: 512,
      fit: "contain",
      background: {
        r: 255,
        g: 255,
        b: 255,
        alpha: 0,
      },
    })
    .composite([
      {
        input: circleShape,
        blend: "dest-in",
      },
    ])
    .webp({ quality: 80 })
    .toBuffer()
    .then(async (info) => {
      console.log("Foto Circular enviada para: " + message.chat.id);
      return { message_from: message.chat.id, image64: info.toString('base64') }
    })
    .catch(async (err) => {
      return {
        message_from: message.from,
        message_to_user: "💀 *A imagem ou video ou gif enviada nao foi possivel converter em sticker, tente novamente* 💀",
        id_message: message.id.toString()
      }
    });
}
exports.stickerCircular = stickerCircular;