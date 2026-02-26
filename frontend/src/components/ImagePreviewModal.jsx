const ImagePreviewModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl p-4 max-w-lg w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-sm bg-black text-white w-7 h-7 rounded-full"
        >
          ✕
        </button>

        <div className="w-full h-[400px] flex items-center justify-center">
          <img
            src={image}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
