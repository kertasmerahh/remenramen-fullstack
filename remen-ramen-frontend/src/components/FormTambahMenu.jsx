import { useState } from 'react'

function FormTambahMenu({ onTambah }) {
  const [nama, setNama] = useState('')
  const [kategori, setKategori] = useState('Ramen Kuah')
  const [harga, setHarga] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nama.trim() || !harga) return

    const menuBaru = {
      no: Date.now(),
      kode: 'MNU-' + String(Date.now()).slice(-3),
      nama: nama.trim(),
      kategori: kategori,
      harga: Number(harga),
      tersedia: true,
      unggulan: false,
      tampilStokAdmin: true,
    }

    onTambah(menuBaru)

    setNama('')
    setKategori('Ramen Kuah')
    setHarga('')
  }

  return (
    <section className="table-card p-4 mb-5 bg-white">
      <h2 className="form-section-title mb-3">
        <i className="bi bi-plus-square-fill me-2"></i>Tambah Menu Kedai Baru
      </h2>
      <form onSubmit={handleSubmit} className="row g-3 align-items-end">
        <div className="col-12 col-md-5">
          <label htmlFor="nama" className="form-label fw-semibold small mb-1">
            Nama Menu
          </label>
          <input
            id="nama"
            type="text"
            className="form-control"
            placeholder="Contoh: Curry Ramen"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>

        <div className="col-12 col-md-3">
          <label htmlFor="kategori" className="form-label fw-semibold small mb-1">
            Kategori
          </label>
          <select
            id="kategori"
            className="form-select"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          >
            <option value="Ramen Kuah">Ramen Kuah</option>
            <option value="Dry Ramen">Dry Ramen</option>
            <option value="Snack Pendamping">Snack Pendamping</option>
            <option value="Minuman Segar">Minuman Segar</option>
          </select>
        </div>

        <div className="col-12 col-md-2">
          <label htmlFor="harga" className="form-label fw-semibold small mb-1">
            Harga (Rp)
          </label>
          <input
            id="harga"
            type="number"
            className="form-control"
            placeholder="15000"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            required
          />
        </div>

        <div className="col-12 col-md-2 d-grid">
          <button type="submit" className="btn btn-brand">
            <i className="bi bi-plus-lg me-1"></i>Tambah
          </button>
        </div>
      </form>
    </section>
  )
}

export default FormTambahMenu
