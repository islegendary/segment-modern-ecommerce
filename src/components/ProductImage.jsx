export default function ProductImage({ src, alt, className, fallback }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        event.target.onerror = null;
        event.target.src = fallback;
      }}
    />
  );
}
