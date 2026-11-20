function RingkasanMenu({ totalMenu, onKosongkan, onReset }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 px-4 mb-4 bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
      <p className="mb-0 fw-medium">
        <i className="bi bi-journal-check text-danger me-2"></i>
        Total Menu Terdaftar: <strong className="text-danger">{totalMenu} Menu</strong>
      </p>
      <div>
        {totalMenu > 0 ? (
          <button
            type="button"
            onClick={onKosongkan}
            className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold"
          >
            Kosongkan Daftar
          </button>
        ) : (
          <button
            type="button"
            onClick={onReset}
            className="btn btn-danger btn-sm rounded-pill px-3 fw-semibold"
          >
            Muat Data Awal
          </button>
        )}
      </div>
    </div>
  )
}

export default RingkasanMenu
