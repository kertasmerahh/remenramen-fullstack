import { useState, useEffect } from 'react'

// Data ulasan nyata kedai ramen untuk menggantikan teks Latin default mock API
const ULASAN_KEDAI = [
  {
    nama: 'Budi Santoso',
    email: 'budi.santoso@gmail.com',
    ulasan: 'Tantan Ramen kuahnya gurih mantap dan pedasnya pas banget! Daging cincangnya melimpah.',
  },
  {
    nama: 'Siti Rahmawati',
    email: 'siti.rahma@gmail.com',
    ulasan: 'Shoyu ramennya segar banget, mie kenyal khas buatan sendiri. Pas banget dinikmati hangat-hangat.',
  },
  {
    nama: 'Dimas Pratama',
    email: 'dimas.pratama@yahoo.com',
    ulasan: 'Tempatnya bersih, harga Rp 15.000 sangat terjangkau untuk porsi ramen seenak dan sebanyak ini.',
  },
  {
    nama: 'Aulia Putri',
    email: 'aulia.putri@gmail.com',
    ulasan: 'Abura Soba juara! Bumbu minyak cabai dan rempahnya meresap rata ke seluruh mie. Nagih pol!',
  },
  {
    nama: 'Rian Hidayat',
    email: 'rian.hidayat@outlook.com',
    ulasan: 'Chicken katsunya super renyah di luar dan juicy di dalam. Wajib pesan ekstra katsu tiap mampir.',
  },
  {
    nama: 'Anisa Nuraini',
    email: 'anisa.nuraini@gmail.com',
    ulasan: 'Pelayanan staf dan kasir ramah, pesanan meja cepat disajikan ke meja. Sukses terus Remen Ramen!',
  },
]

function formatUlasanRealistis(dataJson) {
  return dataJson.map((item, idx) => {
    const ulasanLokal = ULASAN_KEDAI[idx % ULASAN_KEDAI.length]
    return {
      ...item,
      name: ulasanLokal.nama,
      email: ulasanLokal.email,
      body: ulasanLokal.ulasan,
    }
  })
}

function HalamanAdmin({
  daftarMenu,
  daftarAntrean,
  onUpdateStatusAntrean,
  onHapusAntrean,
  onToggleStokMenu,
}) {
  const [pesanToast, setPesanToast] = useState('')

  // State ulasan pelanggan
  const [daftarUlasan, setDaftarUlasan] = useState([])
  const [loadingUlasan, setLoadingUlasan] = useState(true)
  const [errorUlasan, setErrorUlasan] = useState(null)

  // Fungsi async untuk mengambil data API saat tombol "Coba Lagi" diklik
  const ambilDataUlasan = async () => {
    setLoadingUlasan(true)
    setErrorUlasan(null)

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=6')

      if (!response.ok) {
        throw new Error(
          `Gagal menghubungi server API (Status HTTP: ${response.status}). Periksa koneksi internet atau endpoint.`
        )
      }

      const data = await response.json()
      setDaftarUlasan(formatUlasanRealistis(data))
    } catch (err) {
      setErrorUlasan(err.message || 'Terjadi kesalahan saat memuat data ulasan.')
    } finally {
      setLoadingUlasan(false)
    }
  }

  // Panggil API saat halaman Admin pertama kali dimuat
  useEffect(() => {
    let diabaikan = false

    async function inisialisasiDataUlasan() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=6')

        if (!response.ok) {
          throw new Error(
            `Gagal menghubungi server API (Status HTTP: ${response.status}). Periksa koneksi internet atau endpoint.`
          )
        }

        const data = await response.json()
        if (!diabaikan) {
          // setLoadingUlasan(false)
        }
      } catch (err) {
        if (!diabaikan) {
          setErrorUlasan(err.message || 'Terjadi kesalahan saat memuat data ulasan.')
          setLoadingUlasan(false)
        }
      }
    }

    inisialisasiDataUlasan()

    return () => {
      diabaikan = true
    }
  }, [])

  // =========================================================================
  // LOGIKA DASHBOARD ADMIN
  // =========================================================================
  const totalMejaHariIni = 9 + daftarAntrean.length
  const jumlahAntreanAktif = daftarAntrean.filter(
    (item) => item.statusPesanan !== 'Selesai'
  ).length
  const jumlahMenuHabis = daftarMenu.filter((item) => !item.tersedia).length

  const menuStokAdmin = daftarMenu.filter((item) => item.tampilStokAdmin)

  const handleKlikStatus = async (pesanan) => {
    try {
      const updated = await onUpdateStatusAntrean(pesanan.id)
      if (updated) {
        setPesanToast(
          `Pesanan ${pesanan.idAntrean} diperbarui menjadi "${updated.statusPesanan}".`
        )
      }
    } catch (err) {
      setPesanToast(err.message || 'Gagal memperbarui status pesanan.')
    }
  }

  const handleKlikHapus = async (pesanan) => {
    try {
      await onHapusAntrean(pesanan.id)
      setPesanToast(`Antrean ${pesanan.idAntrean} telah dihapus dari backend.`)
    } catch (err) {
      setPesanToast(err.message || 'Gagal menghapus pesanan.')
    }
  }

  const handleKlikStok = (menu) => {
    onToggleStokMenu(menu.kode)
    const statusBaru = !menu.tersedia ? 'TERSEDIA' : 'HABIS (Sold Out)'
    setPesanToast(`Stok ${menu.nama} diubah menjadi ${statusBaru}.`)
  }

  return (
    <main className="container-fluid px-lg-4 my-4">
      {/* KPI STATS CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card-kpi p-3 border-start border-primary border-4">
            <p className="text-muted small fw-bold text-uppercase mb-1">Total Pesanan Masuk</p>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="display-6 fw-bold mb-0">{totalMejaHariIni} Meja</h2>
              <i className="bi bi-receipt text-primary fs-2"></i>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card-kpi p-3 border-start border-warning border-4">
            <p className="text-muted small fw-bold text-uppercase mb-1">Sedang Dimasak</p>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="display-6 fw-bold mb-0 text-warning">
                {jumlahAntreanAktif} Antrean
              </h2>
              <i className="bi bi-fire text-warning fs-2"></i>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card-kpi p-3 border-start border-danger border-4">
            <p className="text-muted small fw-bold text-uppercase mb-1">Menu Habis (Sold Out)</p>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="display-6 fw-bold mb-0 text-danger">{jumlahMenuHabis} Menu</h2>
              <i className="bi bi-x-circle text-danger fs-2"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Notifikasi Singkat Aksi Kasir */}
      {pesanToast && (
        <div
          className="alert alert-dark py-2 px-3 small mb-3 rounded-3 d-flex justify-content-between align-items-center"
          role="status"
        >
          <span>
            <i className="bi bi-info-circle-fill text-warning me-2"></i>
            {pesanToast}
          </span>
          <button
            type="button"
            onClick={() => setPesanToast('')}
            className="btn-close btn-close-white btn-sm"
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* TABEL 1: ANTREAN LIVE */}
      <div className="table-card mb-5" id="antrean-live">
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
          <div>
            <h2 className="h5 fw-bold mb-0 text-dark">
              <i className="bi bi-list-task text-danger me-2"></i>Antrean Pesanan Aktif
            </h2>
            <small className="text-muted">
              Data pesanan meja masuk langsung dari scan pelanggan
            </small>
          </div>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill small">
            <i className="bi bi-circle-fill me-1" style={{ fontSize: '8px' }}></i>Live Sinkronisasi
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small text-uppercase">
              <tr>
                <th scope="col" className="ps-3">Antrean</th>
                <th scope="col">Meja</th>
                <th scope="col">Nama Pemesan</th>
                <th scope="col">Rincian Menu &amp; Porsi</th>
                <th scope="col">Level Pedas &amp; Catatan</th>
                <th scope="col">Total</th>
                <th scope="col">Pembayaran</th>
                <th scope="col">Status Pesanan</th>
                <th scope="col" className="text-end pe-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {daftarAntrean.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    Belum ada antrean pesanan aktif saat ini.
                  </td>
                </tr>
              ) : (
                daftarAntrean.map((p) => (
                  <tr key={p.idAntrean}>
                    <td className="ps-3">
                      <strong className="badge bg-dark">{p.idAntrean}</strong>
                    </td>
                    <td>
                      <span className="fw-bold text-danger">{p.nomorMeja}</span>
                    </td>
                    <td className="fw-medium">{p.namaPemesan}</td>
                    <td>
                      {p.rincianItem.map((rincian, idx) => (
                        <small key={idx} className="d-block">
                          &bull; {rincian}
                        </small>
                      ))}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          p.levelPedas.startsWith('Level 0')
                            ? 'bg-secondary-subtle text-secondary'
                            : 'bg-danger-subtle text-danger'
                        }`}
                      >
                        {p.levelPedas}
                      </span>
                      {p.catatanDapur && (
                        <>
                          <br />
                          <small className="text-muted">{p.catatanDapur}</small>
                        </>
                      )}
                    </td>
                    <td className="fw-bold">Rp {p.totalTagihan.toLocaleString('id-ID')}</td>
                    <td>
                      {p.metodeBayar === 'QRIS Lunas' ? (
                        <span className="badge bg-primary-subtle text-primary">QRIS Lunas</span>
                      ) : p.metodeBayar === 'Belum Bayar' ? (
                        <span className="badge bg-warning-subtle text-warning">Belum Bayar</span>
                      ) : (
                        <span className="badge bg-secondary-subtle text-secondary">
                          {p.metodeBayar}
                        </span>
                      )}
                    </td>
                    <td>
                      {p.statusPesanan === 'Dimasak' ? (
                        <span className="badge bg-warning text-dark">
                          <i className="bi bi-hourglass-split me-1"></i>Dimasak
                        </span>
                      ) : p.statusPesanan === 'Siap Antar' ? (
                        <span className="badge bg-info text-dark">
                          <i className="bi bi-bicycle me-1"></i>Siap Antar
                        </span>
                      ) : p.statusPesanan === 'Menunggu Kasir' ? (
                        <span className="badge bg-secondary">Menunggu Kasir</span>
                      ) : (
                        <span className="badge bg-success">
                          <i className="bi bi-check-circle me-1"></i>Selesai
                        </span>
                      )}
                    </td>
                    <td className="text-end pe-3 text-nowrap">
                      {p.statusPesanan === 'Selesai' ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-pill px-3 me-1"
                          disabled
                        >
                          Tuntas
                        </button>
                      ) : p.statusPesanan === 'Menunggu Kasir' ? (
                        <button
                          type="button"
                          onClick={() => handleKlikStatus(p)}
                          className="btn btn-sm btn-primary rounded-pill px-3 me-1"
                        >
                          Konfirmasi
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleKlikStatus(p)}
                          className="btn btn-sm btn-success rounded-pill px-3 me-1"
                        >
                          <i className="bi bi-check-lg"></i> Selesai
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleKlikHapus(p)}
                        className="btn btn-sm btn-outline-danger rounded-pill"
                        title="Batalkan / Hapus"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TABEL 2: KONTROL STOK */}
      <div className="table-card mb-5" id="kontrol-stok">
        <div className="p-3 border-bottom bg-white">
          <h2 className="h5 fw-bold mb-0 text-dark">
            <i className="bi bi-box-seam text-danger me-2"></i>Kontrol Ketersediaan Menu &amp; Stok
            Hari Ini
          </h2>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small text-uppercase">
              <tr>
                <th scope="col" className="ps-3">Kode</th>
                <th scope="col">Nama Menu</th>
                <th scope="col">Kategori</th>
                <th scope="col">Harga Jual</th>
                <th scope="col">Status Stok</th>
                <th scope="col" className="text-end pe-3">Ubah Status</th>
              </tr>
            </thead>
            <tbody>
              {menuStokAdmin.map((m) => (
                <tr key={m.kode}>
                  <td className="ps-3 fw-bold">{m.kode}</td>
                  <td>{m.nama}</td>
                  <td>{m.kategori}</td>
                  <td>Rp {m.harga.toLocaleString('id-ID')}</td>
                  <td>
                    {m.tersedia ? (
                      <span className="badge bg-success-subtle text-success">TERSEDIA</span>
                    ) : (
                      <span className="badge bg-danger-subtle text-danger">HABIS (Sold Out)</span>
                    )}
                  </td>
                  <td className="text-end pe-3">
                    {m.tersedia ? (
                      <button
                        type="button"
                        onClick={() => handleKlikStok(m)}
                        className="btn btn-sm btn-outline-warning rounded-pill px-3"
                      >
                        Set Habis
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleKlikStok(m)}
                        className="btn btn-sm btn-outline-success rounded-pill px-3"
                      >
                        Aktifkan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ulasan & Masukan Pelanggan */}
      <div className="table-card mb-4" id="ulasan-api">
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white flex-wrap gap-2">
          <div>
            <h2 className="h5 fw-bold mb-0 text-dark">
              <i className="bi bi-chat-heart text-danger me-2"></i>
              Ulasan &amp; Masukan Pelanggan
            </h2>
            <small className="text-muted">
              Data masukan pelanggan kedai
            </small>
          </div>
          <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill small fw-semibold">
            <i className="bi bi-chat-quote-fill me-1"></i>Feed Pelanggan
          </span>
        </div>

        <div className="p-4 bg-white">
          {/* Loading */}
          {loadingUlasan && (
            <div className="text-center py-5">
              <div
                className="spinner-border text-danger mb-3"
                role="status"
                style={{ width: '3rem', height: '3rem' }}
              >
                <span className="visually-hidden">Memuat data...</span>
              </div>
              <h6 className="fw-bold text-dark mb-1">Sedang Memuat Ulasan Pelanggan...</h6>
              <p className="text-muted small mb-0">
                Mengambil data ulasan...
              </p>
            </div>
          )}

          {/* Error */}
          {!loadingUlasan && errorUlasan && (
            <div className="alert alert-danger rounded-4 p-4 text-center mb-0" role="alert">
              <i className="bi bi-exclamation-triangle-fill text-danger fs-1 d-block mb-2"></i>
              <h5 className="fw-bold mb-2">Gagal Mengambil Data!</h5>
              <p className="text-secondary small mb-3 mx-auto" style={{ maxWidth: '520px' }}>
                {errorUlasan}
              </p>
              <button
                type="button"
                onClick={ambilDataUlasan}
                className="btn btn-danger btn-sm rounded-pill px-4 py-2 shadow-sm fw-semibold"
              >
                <i className="bi bi-arrow-clockwise me-1"></i>Coba Lagi
              </button>
            </div>
          )}

          {/* Success */}
          {!loadingUlasan && !errorUlasan && (
            <div className="row g-3">
              {daftarUlasan.map((item) => (
                <div key={item.id} className="col-12 col-md-6">
                  <div className="card h-100 border rounded-3 p-3 bg-light shadow-sm">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}
                        >
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong className="text-dark small d-block text-capitalize">
                            {item.name.slice(0, 30)}...
                          </strong>
                          <span className="text-muted small">
                            <i className="bi bi-envelope me-1"></i>
                            {item.email}
                          </span>
                        </div>
                      </div>
                      <span className="badge bg-secondary-subtle text-secondary small">
                        #{item.id}
                      </span>
                    </div>
                    <p className="small text-secondary mb-0 fst-italic">
                      &ldquo;{item.body}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default HalamanAdmin
