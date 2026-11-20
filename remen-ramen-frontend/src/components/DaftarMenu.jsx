import KartuMenu from './KartuMenu'

function DaftarMenu({ daftarMenu, onPilihPesan }) {
  const menuUnggulan = daftarMenu.filter((item) => item.unggulan)

  return (
    <>
      {/* Menu Ramen Utama */}
      <section className="mb-5" id="menu-utama">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-danger fw-bold small text-uppercase">Pilihan Unggulan</span>
            <h2 className="fw-bold mb-0">Menu Ramen Utama</h2>
          </div>
          <span className="badge bg-danger fs-6 px-3 py-2 rounded-pill">Serba Rp 15.000</span>
        </div>

        <div className="row g-4">
          {menuUnggulan.map((item) => (
            <KartuMenu key={item.kode} item={item} onPilihPesan={onPilihPesan} />
          ))}
        </div>
      </section>

      {/* Snack & Minuman */}
      <section className="mb-5">
        <h2 className="h4 fw-bold mb-3">Snack &amp; Minuman Segar</h2>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="card card-menu p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="h6 fw-bold mb-1">
                    <i className="bi bi-egg-fried text-danger me-2"></i>Chicken Katsu &amp; Karage
                  </h3>
                  <p className="text-muted small mb-0">
                    Camilan daging fillet krispi pelengkap mangkuk ramen
                  </p>
                </div>
                <span className="badge bg-danger-subtle text-danger fs-6 px-3 py-2 rounded-pill">
                  Rp 7.000
                </span>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="card card-menu p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="h6 fw-bold mb-1">
                    <i className="bi bi-cup-straw text-danger me-2"></i>Aneka Minuman Segar
                  </h3>
                  <p className="text-muted small mb-0">
                    Tea, Lychee Tea, Lemon Tea, Jeruk, Matcha (Es / Hangat)
                  </p>
                </div>
                <span className="badge bg-danger-subtle text-danger fs-6 px-3 py-2 rounded-pill">
                  Rp 3.000 - 5.000
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabel Daftar Menu */}
      <section className="mb-5" id="daftar-harga-lengkap">
        <div className="table-card">
          <div className="p-3 border-bottom bg-white">
            <h2 className="h5 fw-bold mb-0 text-dark">Daftar Seluruh Menu &amp; Kategori Lengkap</h2>
            <small className="text-muted">
              Berikut adalah tabel ringkasan menu yang tersedia hari ini di Remen Ramen:
            </small>
          </div>

          {daftarMenu.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-danger fw-semibold mb-0">Belum ada data Menu</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-secondary small text-uppercase">
                  <tr>
                    <th scope="col" className="ps-3">No</th>
                    <th scope="col">Nama Menu</th>
                    <th scope="col">Kategori</th>
                    <th scope="col">Harga (Rp)</th>
                    <th scope="col">Status Stok</th>
                    <th scope="col" className="text-end pe-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {daftarMenu.map((item, index) => (
                    <tr key={item.kode}>
                      <td className="ps-3">{index + 1}</td>
                      <td className="fw-semibold">{item.nama}</td>
                      <td>{item.kategori}</td>
                      <td>{item.harga.toLocaleString('id-ID')}</td>
                      <td>
                        {item.tersedia ? (
                          <span className="badge bg-success-subtle text-success">Tersedia</span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger">
                            Habis (Sold Out)
                          </span>
                        )}
                      </td>
                      <td className="text-end pe-3">
                        <button
                          type="button"
                          onClick={() => onPilihPesan(item.nama)}
                          className="btn btn-link text-danger fw-semibold text-decoration-none p-0"
                        >
                          &raquo; Pesan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default DaftarMenu
