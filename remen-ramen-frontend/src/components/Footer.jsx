function Footer({ onPindahHalaman }) {
  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <div className="container text-center">
        <h3 className="h5 fw-bold text-danger mb-2">Remen Ramen Sragen</h3>
        <p className="text-white-50 small mb-2">
          Buka Setiap Hari: 10.00 - 20.00 WIB | Alamat: Jl. Raya Sragen, Sragen, Jawa Tengah
        </p>
        <p className="text-white-50 small mb-4">Instagram: @remenramenn</p>

        <div className="pt-3 border-top border-secondary border-opacity-25">
          <button
            type="button"
            onClick={() => onPindahHalaman('admin')}
            className="btn btn-link text-secondary text-decoration-none small p-0"
          >
            <i className="bi bi-shield-lock me-1"></i>Akses Khusus Staf: Panel Kasir &amp; Dapur
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
