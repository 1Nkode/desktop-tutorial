/* Renders a user's avatar — a photo (data: URL) if set, otherwise an emoji. */
export function Avatar({ user, size = 40, className = '', style = {}, onClick }) {
  const av = user?.avatar || '😄';
  const isPhoto = typeof av === 'string' && av.startsWith('data:');
  const base = {
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.5, overflow: 'hidden', cursor: onClick ? 'pointer' : undefined,
    ...style,
  };
  if (isPhoto) {
    return (
      <div className={`avatar ${className}`} style={base} onClick={onClick}>
        <img src={av} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }
  return <div className={`avatar ${className}`} style={base} onClick={onClick}>{av}</div>;
}
