import sharp from "sharp";

/**
 * @openapi
 * /img/png/compress:
 *  post:
 *    summary: Compress and optionally resize an image
 *    description: Receives an image URL, fetches the image, checks its width, and resizes it if necessary before converting it to a PNG of specified quality.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              img:
 *                type: string
 *                format: uri
 *                description: The URL of the image to be processed.
 *    responses:
 *      200:
 *        description: The image processed and returned in PNG format.
 *        content:
 *          image/png:
 *            schema:
 *              type: string
 *              format: binary
 *      400:
 *        description: Invalid input data provided.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Invalid URL provided."
 *      500:
 *        description: Error processing the image or internal server error.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Failed to process the image."
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const imgRes = await fetch(body.img);
  const buffer = await imgRes.arrayBuffer();

  event.node.res.setHeader("Content-Type", "image/png");

  const sharped = await sharp(buffer);
  const { width } = await sharped.metadata();

  if (width > 1024) {
    return await sharped
      .resize({ width: 1024 })
      .png({
        quality: 70,
        compressionLevel: 7,
      })
      .toBuffer();
  } else {
    return await sharped
      .png({
        quality: 70,
        compressionLevel: 7,
      })
      .toBuffer();
  }
});
