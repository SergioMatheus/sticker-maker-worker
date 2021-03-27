const sharp = require("sharp");
const replaceColor = require("replace-color");
const Jimp = require("jimp");

async function stickerTransparentWithoutUrl({ decryptFile, message }) {
  sharp.cache(false);
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
    .toBuffer()
    .then(async (info) => {
      return await replaceColor({
        image: info,
        colors: {
          type: "hex",
          targetColor: "#FFFFFF",
          replaceColor: "#00000000",
        },
        deltaE: 10,
      }).then(async (jimpObject) => {
        let base64;
        await jimpObject.getBase64(Jimp.MIME_PNG, (err, res) => {
          base64 = res;
        });
        console.log("Foto Transparente Enviada para: " + message.chat.id);
        return { message_from: message.chat.id, image64: base64 };
      });
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
exports.stickerTransparentWithoutUrl = stickerTransparentWithoutUrl;
