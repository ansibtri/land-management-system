// async function useFileUpload(fileName, ){
//     const URI = `https://api.imgbb.com/1/upload?key=e5b138c5fb36a3c0a17ca2ca427237b4`;
//     const formData = new FormData();
//     formData.append("image", addProductPhoto.files[0]);

//     try {
//       const response = await fetch(URI, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();
//       return data.data.image.url;
//     } catch (err) {
//       console.log(err);
//     }
// }

// export {useFileUpload}