import { useRef } from "react";

function ImageUpload({
  image,
  preview,
  setImage,
  setPreview,
}) {
  const inputRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="upload-box">

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleImage}
      />

      {!preview ? (
        <button
          onClick={() =>
            inputRef.current.click()
          }
        >
          Select Image
        </button>
      ) : (
        <>
          <img
            src={preview}
            alt="Preview"
            className="preview-image"
          />

          <br />

          <button
            onClick={() =>
              inputRef.current.click()
            }
          >
            Change Image
          </button>
        </>
      )}

      {image && (
        <p>{image.name}</p>
      )}
    </div>
  );
}

export default ImageUpload;