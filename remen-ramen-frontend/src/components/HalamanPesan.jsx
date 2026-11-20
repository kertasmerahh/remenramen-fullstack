import { useState } from 'react'

function HalamanPesan({
  menuTerpilihAwal,
  jumlahAntreanSaatIni,
  onTambahPesanan,
  onPindahHalaman,
}) {
  const [namaPemesan, setNamaPemesan] = useState('')
  const [nomorMeja, setNomorMeja] = useState('')
  const [varianRamen, setVarianRamen] = useState(menuTerpilihAwal || '')
  const [jumlahPorsi, setJumlahPorsi] = useState(1)
  const [levelPedas, setLevelPedas] = useState('Level 1 (Sedang)')
  const [daftarSnack, setDaftarSnack] = useState([])
  const [pilihanMinuman, setPilihanMinuman] = useState('Tanpa Minuman')
  const [suhuMinuman, setSuhuMinuman] = useState('Dingin (Es)')
  const [catatanKoki, setCatatanKoki] = useState('')
  const [metodeBayar, setMetodeBayar] = useState('Tunai')

  const [pesanError, setPesanError] = useState([])
  const [infoSukses, setInfoSukses] = useState(null)

  const handleToggleSnack = (namaSnack) => {
    if (daftarSnack.includes(namaSnack)) {
      setDaftarSnack(daftarSnack.filter((item) => item !== namaSnack))
    } else {
      setDaftarSnack([...daftarSnack, namaSnack])
    }
  }

  const hitungTotalPesananForm = () => {
    const hargaRamen = 15000
    const hargaSnack = 7000
    let totalHarga = 0
    const rincianItem = []

    if (varianRamen && jumlahPorsi > 0) {
      const subtotalRamen = hargaRamen * jumlahPorsi
      totalHarga += subtotalRamen
      rincianItem.push(
        `${jumlahPorsi}x ${varianRamen} (Rp ${subtotalRamen.toLocaleString('id-ID')})`
      )
    }

    daftarSnack.forEach((snack) => {
      totalHarga += hargaSnack
      rincianItem.push(`1x ${snack} (+Rp ${hargaSnack.toLocaleString('id-ID')})`)
    })

    if (pilihanMinuman && pilihanMinuman !== 'Tanpa Minuman') {
      let hargaMinuman = 0
      if (pilihanMinuman.includes('3K')) hargaMinuman = 3000
      else if (pilihanMinuman.includes('4K')) hargaMinuman = 4000
      else if (pilihanMinuman.includes('5K')) hargaMinuman = 5000

      totalHarga += hargaMinuman
      const namaBersih = pilihanMinuman.replace(/\s*\(\d+K\)/, '')
      rincianItem.push(
        `1x ${namaBersih} ${suhuMinuman} (+Rp ${hargaMinuman.toLocaleString('id-ID')})`
      )
    }

    return { totalHarga, rincianItem }
  }

  const handleReset = () => {
    setNamaPemesan('')
    setNomorMeja('')
    setVarianRamen('')
    setJumlahPorsi(1)
    setLevelPedas('Level 1 (Sedang)')
    setDaftarSnack([])
    setPilihanMinuman('Tanpa Minuman')
    setSuhuMinuman('Dingin (Es)')
    setCatatanKoki('')
    setMetodeBayar('Tunai')
    setPesanError([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = []
    if (!namaPemesan.trim()) {
      errors.push('Nama Pemesan wajib diisi.')
    }
    if (!nomorMeja || Number(nomorMeja) < 1 || Number(nomorMeja) > 25) {
      errors.push('Nomor Meja wajib diisi dengan nomor meja yang valid (1 - 25).')
    }
    if (!varianRamen) {
      errors.push('Silakan pilih Varian Ramen terlebih dahulu.')
    }
    if (Number(jumlahPorsi) < 1) {
      errors.push('Jumlah porsi ramen minimal 1 porsi.')
    }

    if (errors.length > 0) {
      setPesanError(errors)
      setInfoSukses(null)
      return
    }

    setPesanError([])
    const hasilHitung = hitungTotalPesananForm()
    const labelMeja =
      'Meja ' + (String(nomorMeja).length === 1 ? '0' + nomorMeja : nomorMeja)

    const payloadOrder = {
      customerName: namaPemesan.trim(),
      menuName: varianRamen,
      quantity: Number(jumlahPorsi),
      totalPrice: hasilHitung.totalHarga,
      isTakeaway: false,
      status: 'pending',
      orderDate: new Date().toISOString(),
      tableNumber: labelMeja,
      itemsSummary: hasilHitung.rincianItem,
      spiceLevel: levelPedas,
      kitchenNote: catatanKoki.trim(),
      paymentMethod: metodeBayar,
    }

    try {
      const pesananBaru = await onTambahPesanan(payloadOrder)
      setInfoSukses(pesananBaru)
      handleReset()
    } catch (err) {
      setPesanError([err.message || 'Gagal mengirim pesanan ke backend.'])
      setInfoSukses(null)
    }
  }

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="form-card p-4 p-md-5">
            <div className="text-center mb-4">
              <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-bold mb-2">
                Meja &bull; Self Order
              </span>
              <h1 className="h3 fw-bold mb-1">Formulir Pemesanan Meja</h1>
              <p className="text-muted small">
                Pesanan Anda langsung masuk ke antrean masak dapur Remen Ramen
              </p>
            </div>

            {/* Notifikasi Validasi Error */}
            {pesanError.length > 0 && (
              <div className="alert alert-danger rounded-3 mb-4" role="alert">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <strong className="d-block mb-1">
                      <i className="bi bi-exclamation-circle-fill me-1"></i>Mohon lengkapi data
                      berikut:
                    </strong>
                    <ul className="mb-0 small ps-3">
                      {pesanError.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPesanError([])}
                    className="btn-close"
                    aria-label="Close"
                  ></button>
                </div>
              </div>
            )}

            {/* Notifikasi Pesanan Berhasil */}
            {infoSukses && (
              <div className="alert alert-success rounded-3 mb-4" role="alert">
                <h6 className="fw-bold mb-1">
                  <i className="bi bi-check-circle-fill me-1"></i>Pesanan Berhasil Dikirim ke Dapur!
                  ({infoSukses.idAntrean})
                </h6>
                <p className="small mb-2">
                  Pemesan: <strong>{infoSukses.namaPemesan}</strong> (
                  <strong>{infoSukses.nomorMeja}</strong>) &bull; Total Tagihan:{' '}
                  <strong>Rp {infoSukses.totalTagihan.toLocaleString('id-ID')}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => onPindahHalaman('admin')}
                  className="btn btn-sm btn-success rounded-pill px-3"
                >
                  Lihat Antrean di Dashboard Kasir &rarr;
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* 1. DATA PEMESAN */}
              <div className="mb-4">
                <h2 className="form-section-title">
                  <i className="bi bi-person-fill me-2"></i>1. Informasi Meja &amp; Pemesan
                </h2>
                <div className="row g-3">
                  <div className="col-12 col-md-7">
                    <label htmlFor="nama_pemesan" className="form-label fw-semibold">
                      Nama Pemesan <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nama_pemesan"
                      placeholder="Contoh: Budi Santoso"
                      value={namaPemesan}
                      onChange={(e) => setNamaPemesan(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-5">
                    <label htmlFor="nomor_meja" className="form-label fw-semibold">
                      Nomor Meja <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="nomor_meja"
                      min="1"
                      max="25"
                      placeholder="Contoh: 04"
                      value={nomorMeja}
                      onChange={(e) => setNomorMeja(e.target.value)}
                      required
                    />
                    <div className="form-text small">Cek stiker angka pada meja Anda.</div>
                  </div>
                </div>
              </div>

              {/* 2. PILIHAN RAMEN */}
              <div className="mb-4">
                <h2 className="form-section-title">
                  <i className="bi bi-fire me-2"></i>2. Pilihan Menu Ramen (Rp 15.000)
                </h2>
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-8">
                    <label htmlFor="menu_ramen" className="form-label fw-semibold">
                      Varian Ramen <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="menu_ramen"
                      value={varianRamen}
                      onChange={(e) => setVarianRamen(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        -- Pilih Ramen --
                      </option>
                      <option value="Tantan Ramen">
                        Tantan Ramen (Kuah Creamy Pedas) - Rp 15.000
                      </option>
                      <option value="Shoyu Ramen">
                        Shoyu Ramen (Kuah Kaldu Segar) - Rp 15.000
                      </option>
                      <option value="Abura Soba">
                        Abura Soba (Dry Ramen Gurih) - Rp 15.000
                      </option>
                    </select>
                  </div>
                  <div className="col-12 col-md-4">
                    <label htmlFor="jumlah_porsi" className="form-label fw-semibold">
                      Jumlah Porsi <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="jumlah_porsi"
                      min="1"
                      max="10"
                      value={jumlahPorsi}
                      onChange={(e) => setJumlahPorsi(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                {/* Level Pedas */}
                <label className="form-label fw-semibold d-block mb-2">Tingkat Kepedasan:</label>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    { id: 'lvl0', val: 'Level 0 (Tanpa Pedas)', label: 'Level 0 (Tanpa Pedas)', merah: false },
                    { id: 'lvl1', val: 'Level 1 (Sedang)', label: 'Level 1 (Sedang)', merah: false },
                    { id: 'lvl2', val: 'Level 2', label: 'Level 2 (Favorit)', merah: true },
                    { id: 'lvl3', val: 'Level 3 (Ekstra Pedas)', label: 'Level 3 (Ekstra Pedas)', merah: true },
                  ].map((lvl) => (
                    <div
                      key={lvl.id}
                      className="form-check form-check-inline border rounded-pill px-3 py-2 bg-light"
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="level_pedas"
                        id={lvl.id}
                        value={lvl.val}
                        checked={levelPedas === lvl.val}
                        onChange={(e) => setLevelPedas(e.target.value)}
                      />
                      <label
                        className={`form-check-label small fw-semibold ${
                          lvl.merah ? 'text-danger' : ''
                        }`}
                        htmlFor={lvl.id}
                      >
                        {lvl.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. SNACK */}
              <div className="mb-4">
                <h2 className="form-section-title">
                  <i className="bi bi-plus-circle-fill me-2"></i>3. Tambahan Snack (+Rp 7.000 /
                  porsi)
                </h2>
                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <div className="form-check border rounded-3 p-3 bg-light">
                      <input
                        className="form-check-input ms-0 me-2"
                        type="checkbox"
                        id="katsu"
                        checked={daftarSnack.includes('Chicken Katsu')}
                        onChange={() => handleToggleSnack('Chicken Katsu')}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="katsu">
                        Chicken Katsu (+Rp 7.000)
                      </label>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-check border rounded-3 p-3 bg-light">
                      <input
                        className="form-check-input ms-0 me-2"
                        type="checkbox"
                        id="karage"
                        checked={daftarSnack.includes('Chicken Karage')}
                        onChange={() => handleToggleSnack('Chicken Karage')}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="karage">
                        Chicken Karage (+Rp 7.000)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. MINUMAN */}
              <div className="mb-4">
                <h2 className="form-section-title">
                  <i className="bi bi-cup-straw me-2"></i>4. Pilihan Minuman Segar
                </h2>
                <div className="row g-3">
                  <div className="col-12 col-md-7">
                    <label htmlFor="pilihan_minuman" className="form-label fw-semibold">
                      Pilih Minuman:
                    </label>
                    <select
                      className="form-select"
                      id="pilihan_minuman"
                      value={pilihanMinuman}
                      onChange={(e) => setPilihanMinuman(e.target.value)}
                    >
                      <option value="Tanpa Minuman">-- Tanpa Minuman --</option>
                      <option value="Es Teh Manis (3K)">Tea - Rp 3.000</option>
                      <option value="Lychee Tea (4K)">Lychee Tea - Rp 4.000</option>
                      <option value="Lemon Tea (5K)">Lemon Tea - Rp 5.000</option>
                      <option value="Jeruk (5K)">Jeruk - Rp 5.000</option>
                      <option value="Matcha (5K)">Matcha - Rp 5.000</option>
                    </select>
                  </div>

                  {pilihanMinuman !== 'Tanpa Minuman' && (
                    <div className="col-12 col-md-5">
                      <label className="form-label fw-semibold d-block">Suhu Minuman:</label>
                      <div className="d-flex gap-2 mt-1">
                        <div className="form-check border rounded-3 px-3 py-2 bg-light flex-grow-1">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="suhu_minuman"
                            id="es"
                            value="Dingin (Es)"
                            checked={suhuMinuman === 'Dingin (Es)'}
                            onChange={(e) => setSuhuMinuman(e.target.value)}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="es">
                            Dingin (Es)
                          </label>
                        </div>
                        <div className="form-check border rounded-3 px-3 py-2 bg-light flex-grow-1">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="suhu_minuman"
                            id="hangat"
                            value="Hangat"
                            checked={suhuMinuman === 'Hangat'}
                            onChange={(e) => setSuhuMinuman(e.target.value)}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="hangat">
                            Hangat
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. CATATAN & PEMBAYARAN */}
              <div className="mb-4">
                <h2 className="form-section-title">
                  <i className="bi bi-receipt me-2"></i>5. Catatan Koki &amp; Pembayaran
                </h2>
                <div className="mb-3">
                  <label htmlFor="catatan_koki" className="form-label fw-semibold">
                    Catatan Khusus Koki Dapur:
                  </label>
                  <textarea
                    className="form-control"
                    id="catatan_koki"
                    rows="2"
                    placeholder="Misal: Kuah dipisah, jangan pakai daun bawang, atau alergi wijen..."
                    value={catatanKoki}
                    onChange={(e) => setCatatanKoki(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="metode_pembayaran" className="form-label fw-semibold">
                    Metode Pembayaran <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="metode_pembayaran"
                    value={metodeBayar}
                    onChange={(e) => setMetodeBayar(e.target.value)}
                    required
                  >
                    <option value="Tunai">Bayar Tunai / Cash di Kasir</option>
                    <option value="QRIS Lunas">Bayar Non-Tunai (QRIS / E-Wallet)</option>
                  </select>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-end pt-3 border-top">
                <button type="button" onClick={handleReset} className="btn btn-light px-4">
                  Reset Form
                </button>
                <button type="submit" className="btn btn-submit-order shadow">
                  <i className="bi bi-send-fill me-2"></i>Kirim Pesanan ke Dapur
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default HalamanPesan
