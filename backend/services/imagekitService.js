const { getImageKit } = require('../config/imagekit');

const FOLDERS = {
  products: 'hexacarb/products',
  productSheets: 'hexacarb/product-sheets',
};

// const uploadFile = async (buffer, fileName, folder) => {
//   const imagekit = getImageKit();
//   const result = await imagekit.upload({
//     file: buffer,
//     fileName,
//     folder,
//     useUniqueFileName: true,
//   });
//   return {
//     fileId: result.fileId,
//     url: result.url,
//     name: result.name,
//   };
// };



const uploadFile = async (buffer, fileName, folder) => {
  try {
    const imagekit = getImageKit();

    console.log("===== IMAGEKIT DEBUG =====");
    console.log("Buffer Length:", buffer?.length);
    console.log("File Name:", fileName);
    console.log("Folder:", folder);

    const result = await imagekit.upload({
      file: buffer.toString("base64"),
      fileName,
      folder,
      useUniqueFileName: true,
    });

    console.log("Upload Success:", result);

    return {
      fileId: result.fileId,
      url: result.url,
      name: result.name,
    };
  } catch (err) {
    console.log("===== IMAGEKIT ERROR =====");
    console.dir(err, { depth: null });
    console.log("Message:", err.message);
    console.log("Status:", err.statusCode);
    console.log("Stack:", err.stack);

    throw err;
  }
};

const uploadImage = (buffer, fileName) =>
  uploadFile(buffer, fileName, FOLDERS.products);

const uploadPdf = (buffer, fileName) =>
  uploadFile(buffer, fileName, FOLDERS.productSheets);

const deleteFile = async (fileId) => {
  if (!fileId) return;
  try {
    const imagekit = getImageKit();
    await imagekit.deleteFile(fileId);
  } catch {
    // ignore if already deleted or ImageKit not configured
  }
};

const deleteImage = (asset) => deleteFile(asset && asset.fileId);

const deletePdf = (asset) => deleteFile(asset && asset.fileId);

module.exports = {
  uploadImage,
  uploadPdf,
  deleteFile,
  deleteImage,
  deletePdf,
  FOLDERS,
};