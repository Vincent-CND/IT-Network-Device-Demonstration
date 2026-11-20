import { Link } from 'react-router-dom'
import Modal from './Modal.jsx'

export default function MessageDialog({ message, onClose }) {
  return <Modal open={Boolean(message)} onClose={onClose} label={message?.title || 'Message'}>
    <h2>{message?.title}</h2>
    <p role="status">{message?.text}</p>
    {message?.to
      ? <Link className="button primary" to={message.to}>{message.action || 'Continue'}</Link>
      : <button type="button" className="button primary" onClick={onClose}>Got it</button>}
  </Modal>
}
