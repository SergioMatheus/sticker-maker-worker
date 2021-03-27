const sharp = require("sharp");

async function stickerQuadrado({ decryptFile, message }) {
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
    .webp({ quality: 80 })
    .toBuffer()
    .then(async (info) => {
      console.log("Foto Quadrada enviada para: " + message.chat.id);
      return {
        message_from: message.chat.id,
        image64: info.toString("base64"),
      };
    })
    .catch(async (err) => {
      return {
        message_from: message.from,
        message_to_user:
          "💀 *A imagem ou video ou gif enviada nao foi possivel converter em sticker, tente novamente* 💀",
        id_message: message.id.toString(),
      };
    });
}
exports.stickerQuadrado = stickerQuadrado;
