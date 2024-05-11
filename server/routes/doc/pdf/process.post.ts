export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event);

  console.log(body);

  return { status: "success" };
});
