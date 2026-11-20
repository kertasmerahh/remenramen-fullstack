import { useState } from 'react'

function Header({ halamanAktif, onPindahHalaman }) {
  const [tampilBukuMenu, setTampilBukuMenu] = useState(true)

  // Jika sedang di halaman Admin (Kitchen Hub), tampilkan Navbar Admin gelap
  if (halamanAktif === 'admin') {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark admin-navbar sticky-top py-3">
        <div className="container-fluid px-lg-4">
          <a
            className="navbar-brand d-flex align-items-center gap-2"
            href="#admin"
            onClick={(e) => {
              e.preventDefault()
              onPindahHalaman('admin')
            }}
          >
            <img
              src="/assets/images/Logo_RemenRamen.jpg"
              alt="Logo Remen Ramen"
              className="rounded-circle border"
              width="36"
              height="36"
            />
            <span className="fw-bold">
              Remen Ramen <span className="badge bg-danger ms-1">Kitchen Hub</span>
            </span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navAdmin"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navAdmin">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link active fw-semibold" href="#antrean-live">
                  <i className="bi bi-clock-history me-1"></i>Antrean Pesanan
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white-50" href="#kontrol-stok">
                  <i className="bi bi-box-seam me-1"></i>Kontrol Stok
                </a>
              </li>
            </ul>
            <div className="d-flex align-items-center gap-3">
              <span className="text-white-50 small">
                <i className="bi bi-person-circle text-success me-1"></i>Kasir 01 (Shift Siang)
              </span>
              <button
                type="button"
                onClick={() => onPindahHalaman('katalog')}
                className="btn btn-outline-light btn-sm rounded-pill px-3"
              >
                <i className="bi bi-arrow-left me-1"></i>Ke Layar Pelanggan
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* ================= NAVBAR PELANGGAN ================= */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-3">
        <div className="container">
          <a
            className="navbar-brand d-flex align-items-center gap-2"
            href="#katalog"
            onClick={(e) => {
              e.preventDefault()
              onPindahHalaman('katalog')
            }}
          >
            <img
              src="/assets/images/Logo_RemenRamen.jpg"
              alt="Logo Remen Ramen"
              className="rounded-circle border"
              width="40"
              height="40"
            />
            <span className="navbar-brand-title fs-4 mb-0">Remen Ramen</span>
          </a>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navCustomer"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navCustomer">
            <ul className="navbar-nav align-items-center gap-1 gap-lg-3 mt-3 mt-lg-0">
              <li className="nav-item">
                <button
                  type="button"
                  onClick={() => onPindahHalaman('katalog')}
                  className={`nav-link nav-btn-link ${
                    halamanAktif === 'katalog'
                      ? 'active fw-bold text-danger'
                      : 'fw-semibold text-secondary'
                  }`}
                >
                  <i className="bi bi-book-half me-1"></i>Katalog Menu
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  onClick={() => onPindahHalaman('pesan')}
                  className={`nav-link nav-btn-link ${
                    halamanAktif === 'pesan'
                      ? 'active fw-bold text-danger'
                      : 'fw-semibold text-secondary'
                  }`}
                >
                  <i className="bi bi-qr-code-scan me-1"></i>Pesan di Meja
                </button>
              </li>
              {halamanAktif === 'katalog' && (
                <li className="nav-item ms-lg-2">
                  <button
                    type="button"
                    onClick={() => onPindahHalaman('pesan')}
                    className="btn btn-brand btn-sm shadow-sm"
                  >
                    <i className="bi bi-bag-plus-fill me-1"></i>Pesan Sekarang
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* ================= HERO BANNER & BUKU MENU (KHUSUS HALAMAN KATALOG) ================= */}
      {halamanAktif === 'katalog' && (
        <>
          <header className="hero-banner py-5" id="sambutan">
            <div className="container py-3">
              <div className="row align-items-center gy-4">
                <div className="col-12 col-lg-7 text-center text-lg-start">
                  <span className="badge badge-soft-red px-3 py-2 rounded-pill mb-3">
                    <i className="bi bi-geo-alt-fill me-1"></i>Kedai Resmi Sragen, Jawa Tengah
                  </span>
                  <h1 className="display-5 fw-bold text-dark mb-3">
                    Selamat Datang di{' '}
                    <span style={{ color: 'var(--brand-red)' }}>Remen Ramen!</span>
                  </h1>
                  <p className="lead text-secondary mb-4" style={{ maxWidth: '540px' }}>
                    Nikmati racikan ramen berkuah kaldu gurih dan mie kenyal buatan sendiri khas
                    kedai kami di Sragen. Silakan cek buku menu resmi di bawah ini atau langsung
                    kirimkan pesanan ke dapur kami!
                  </p>
                  <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-2">
                    <button
                      type="button"
                      onClick={() => onPindahHalaman('pesan')}
                      className="btn btn-brand btn-lg shadow-sm"
                    >
                      <i className="bi bi-qr-code me-2"></i>Pesan Sekarang
                    </button>
                    <a href="#buku-menu" className="btn btn-outline-secondary btn-lg">
                      Buku Menu Resmi
                    </a>
                  </div>
                </div>
                <div className="col-12 col-lg-5 text-center">
                  <img
                    src="/assets/images/Logo_RemenRamen.jpg"
                    alt="Logo Kedai Remen Ramen"
                    className="img-fluid rounded-4 shadow-lg border border-3 border-white"
                    style={{ maxWidth: '280px' }}
                  />
                </div>
              </div>
            </div>
          </header>

          <div className="container mt-5">
            <section
              className="card border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-white text-center"
              id="buku-menu"
            >
              <span className="text-danger fw-bold small text-uppercase">Buku Menu Kedai</span>
              <h2 className="h3 fw-bold mb-2">Buku Menu Resmi Kedai</h2>
              <p className="text-muted mx-auto mb-3" style={{ maxWidth: '600px' }}>
                Berikut tampilan buku menu fisik resmi yang tersedia langsung di setiap meja kedai
                Remen Ramen Sragen:
              </p>
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => setTampilBukuMenu(!tampilBukuMenu)}
                  className="btn btn-outline-danger btn-sm rounded-pill px-3"
                >
                  {tampilBukuMenu ? (
                    <>
                      <i className="bi bi-eye-slash me-1"></i>Sembunyikan Buku Menu
                    </>
                  ) : (
                    <>
                      <i className="bi bi-eye me-1"></i>Tampilkan Buku Menu
                    </>
                  )}
                </button>
              </div>
              {tampilBukuMenu && (
                <div className="text-center">
                  <img
                    src="/assets/images/Menu_RemenRamen.png"
                    className="img-fluid rounded-4 shadow border"
                    alt="Buku Menu Resmi Remen Ramen"
                    style={{ maxHeight: '520px' }}
                  />
                  <figcaption className="mt-3 text-muted small fst-italic">
                    Buku menu makan &amp; minum Kedai Remen Ramen Sragen.
                  </figcaption>
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </>
  )
}

export default Header
