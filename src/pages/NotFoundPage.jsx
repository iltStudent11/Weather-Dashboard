import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="page-section">
      <h1>Page Not Found</h1>
      <p>The page you requested does not exist.</p>
      <p>
        <Link to="/">Go back to locations</Link>
      </p>
    </section>
  )
}

export default NotFoundPage