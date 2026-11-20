function KartuMenu({ item, onPilihPesan }) {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card card-menu h-100">
        <div className="position-relative">
          <img
            src={item.gambar}
            className="card-img-top card-menu-img"
            alt={item.nama}
          />
          {item.badge && (
            <span
              className={`position-absolute top-0 end-0 m-3 badge ${item.badgeClass} rounded-pill px-3 py-2 shadow-sm`}
            >
              {item.badge}
            </span>
          )}
        </div>
        <div className="card-body p-4 d-flex flex-column">
          <h3 className="h5 fw-bold mb-1">
            {item.no}. {item.nama}
          </h3>
          <p className="text-danger fw-bold fs-5 mb-2">
            Rp {item.harga.toLocaleString('id-ID')}
          </p>
          <p className="text-muted small flex-grow-1">{item.deskripsi}</p>
          <button
            type="button"
            onClick={() => onPilihPesan(item.nama)}
            className="btn btn-outline-danger w-100 fw-semibold rounded-pill mt-3"
          >
            <i className="bi bi-cart-plus me-1"></i>Pesan {item.nama}
          </button>
        </div>
      </div>
    </div>
  )
}

export default KartuMenu
