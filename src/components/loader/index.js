import SyncLoader from 'react-spinners/SyncLoader'

export default function Loader({ loading = true, position = 'fixed' }) {
  const style = {
    position,
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    opacity: 1,
    zIndex: 999,
  }

  return loading ? (
    <div style={style}>
      <SyncLoader color={'#1852DB'} style={{ opacity: 1 }} />
    </div>
  ) : null
}
