const sharp = require("sharp");
var text2png = require("text2png");
const { default: PQueue } = require("p-queue");
const queue = new PQueue({ concurrency: 1 });

async function stickerText({ message }) {
  let textoPng;
  if (message.body.includes("text")) {
    textoPng = message.body.replace("text ", "");
  } else {
    textoPng = message.body.replace("Text ", "");
  }
  if (message.isGroupMsg) {
    textoPng = textoPng.replace("@557184003585", "");
  }
  let bufferTextImg = await text2png(textoPng.replace("//n", "/n"), {
    font: "80px sans-serif",
    color: "black",
    bgColor: "alterado na lib",
    textAlign: "center",
    lineSpacing: 20,
    padding: 35,
  });
  return sharp(bufferTextImg)
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
      console.log("Mensagem de Texto enviada para: " + message.chat.id);
      return {
        message_from: message.chat.id,
        image64: info.toString("base64"),
      };
    })
    .catch(async (err) => {
      return {
        message_from: message.chat.id,
        message_to_user:
          "💀 *A imagem ou video ou gif enviada nao foi possivel converter em sticker, tente novamente* 💀",
        id_message: message.id.toString(),
      };
    });
}
exports.stickerText = stickerText;
