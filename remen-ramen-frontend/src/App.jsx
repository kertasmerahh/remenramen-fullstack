import { useEffect, useState } from 'react'
import Header from './components/Header'
import RingkasanMenu from './components/RingkasanMenu'
import FormTambahMenu from './components/FormTambahMenu'
import DaftarMenu from './components/DaftarMenu'
import HalamanPesan from './components/HalamanPesan'
import HalamanAdmin from './components/HalamanAdmin'
import Footer from './components/Footer'
import './App.css'

const API_BASE_URL = 'http://localhost:3001'

const STATUS_TO_UI = {
  pending: 'Menunggu Kasir',
  cooking: 'Dimasak',
  ready: 'Siap Antar',
  completed: 'Selesai',
}

function mapOrderToAntrean(order) {
  return {
    id: order.id,
    idAntrean: `#${String(order.id).padStart(3, '0')}`,
    nomorMeja: order.isTakeaway ? 'Takeaway' : order.tableNumber || 'Meja -',
    namaPemesan: order.customerName,
    rincianItem:
      order.itemsSummary && order.itemsSummary.length > 0
        ? order.itemsSummary
        : [`${order.quantity}x ${order.menuName} (Rp ${order.totalPrice.toLocaleString('id-ID')})`],
    levelPedas: order.spiceLevel || 'Level 1',
    catatanDapur: order.kitchenNote || '',
    totalTagihan: order.totalPrice,
    metodeBayar: order.paymentMethod || 'Tunai',
    status: order.status,
    statusPesanan: STATUS_TO_UI[order.status] || 'Menunggu Kasir',
    isTakeaway: order.isTakeaway,
    orderDate: order.orderDate,
  }
}

const DATA_AWAL_MENU = [
  {
    no: 1,
    kode: 'RMN-01',
    nama: 'Tantan Ramen',
    kategori: 'Ramen Kuah',
    harga: 15000,
    tersedia: true,
    unggulan: true,
    tampilStokAdmin: true,
    badge: 'Best Seller',
    badgeClass: 'bg-danger',
    gambar: '/assets/images/Ramen_Tantan.jpg',
    deskripsi:
      'Kuah creamy pedas gurih kental dan pekat khas wijen sangrai dengan taburan daging cincang lezat.',
  },
  {
    no: 2,
    kode: 'RMN-02',
    nama: 'Shoyu Ramen',
    kategori: 'Ramen Kuah',
    harga: 15000,
    tersedia: false,
    unggulan: true,
    tampilStokAdmin: true,
    badge: 'Kuah Bening',
    badgeClass: 'bg-dark',
    gambar: '/assets/images/Ramen_Shoyu.jpg',
    deskripsi:
      'Kuah kaldu ayam bening yang gurih, segar, dan menenangkan dengan racikan shoyu Jepang istimewa.',
  },
  {
    no: 3,
    kode: 'RMN-03',
    nama: 'Abura Soba',
    kategori: 'Dry Ramen',
    harga: 15000,
    tersedia: true,
    unggulan: true,
    tampilStokAdmin: true,
    badge: 'Dry Ramen',
    badgeClass: 'bg-warning text-dark',
    gambar: '/assets/images/Ramen_AburaSoba.jpg',
    deskripsi:
      'Ramen kering gurih tanpa kuah berpadu minyak bumbu pedas rahasia dengan 3 pilihan level kepedasan.',
  },
  {
    no: 4,
    kode: 'SNK-01',
    nama: 'Katsu',
    kategori: 'Snack Pendamping',
    harga: 7000,
    tersedia: true,
    unggulan: false,
    tampilStokAdmin: false,
  },
  {
    no: 5,
    kode: 'SNK-02',
    nama: 'Karage',
    kategori: 'Snack Pendamping',
    harga: 7000,
    tersedia: true,
    unggulan: false,
    tampilStokAdmin: false,
  },
  {
    no: 6,
    kode: 'MNM-01',
    nama: 'Tea (Hot / Ice)',
    kategori: 'Minuman Segar',
    harga: 3000,
    tersedia: true,
    unggulan: false,
    tampilStokAdmin: false,
  },
  {
    no: 7,
    kode: 'MNM-02',
    nama: 'Lychee Tea (Hot / Ice)',
    kategori: 'Minuman Segar',
    harga: 4000,
    tersedia: true,
    unggulan: false,
    tampilStokAdmin: false,
  },
  {
    no: 8,
    kode: 'MNM-03',
    nama: 'Lemon Tea (Hot / Ice)',
    kategori: 'Minuman Segar',
    harga: 5000,
    tersedia: true,
    unggulan: false,
    tampilStokAdmin: false,
  },
  {
    no: 9,
    kode: 'MNM-04',
    nama: 'Jeruk (Hot / Ice)',
    kategori: 'Minuman Segar',
    harga: 5000,
    tersedia: true,
    unggulan: false,
    tampilStokAdmin: false,
  },
  {
    no: 10,
    kode: 'MNM-05',
    nama: 'Matcha (Hot / Ice)',
    kategori: 'Minuman Segar',
    harga: 5000,
    tersedia: true,
    unggulan: false,
    tampilStokAdmin: false,
  },
]

const DATA_AWAL_ANTREAN = [
  {
    idAntrean: '#001',
    nomorMeja: 'Meja 04',
    namaPemesan: 'Budi Santoso',
    rincianItem: [
      '1x Tantan Ramen (Rp 15.000)',
      '1x Chicken Katsu (+Rp 7.000)',
      '1x Es Teh Manis (+Rp 3.000)',
    ],
    levelPedas: 'Level 2',
    catatanDapur: 'Daun bawang dibanyakin',
    totalTagihan: 25000,
    metodeBayar: 'Tunai',
    statusPesanan: 'Dimasak',
  },
  {
    idAntrean: '#002',
    nomorMeja: 'Meja 02',
    namaPemesan: 'Siti Rahma',
    rincianItem: ['2x Abura Soba (Rp 30.000)', '2x Matcha Ice (+Rp 10.000)'],
    levelPedas: 'Level 3 & 1',
    catatanDapur: 'Kuah dipisah',
    totalTagihan: 40000,
    metodeBayar: 'QRIS Lunas',
    statusPesanan: 'Siap Antar',
  },
  {
    idAntrean: '#003',
    nomorMeja: 'Meja 07',
    namaPemesan: 'Mas Agus',
    rincianItem: ['1x Tantan Ramen (Rp 15.000)', '1x Lemon Tea (+Rp 5.000)'],
    levelPedas: 'Level 0',
    catatanDapur: '',
    totalTagihan: 20000,
    metodeBayar: 'Belum Bayar',
    statusPesanan: 'Menunggu Kasir',
  },
]

function App() {
  const [halamanAktif, setHalamanAktif] = useState('katalog') // 'katalog' | 'pesan' | 'admin'
  const [menuTerpilihAwal, setMenuTerpilihAwal] = useState('')
  const [daftarMenu, setDaftarMenu] = useState(DATA_AWAL_MENU)
  const [daftarAntrean, setDaftarAntrean] = useState([])

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`)
        if (!res.ok) throw new Error('Gagal memuat antrean pesanan dari server.')
        const data = await res.json()
        setDaftarAntrean(data.map(mapOrderToAntrean))
      } catch (err) {
        console.error(err)
      }
    }
    fetchOrders()
  }, [])

  // Handler Katalog & Menu
  const tambahMenu = (menuBaru) => {
    setDaftarMenu([...daftarMenu, menuBaru])
  }

  const kosongkanMenu = () => {
    setDaftarMenu([])
  }

  const resetMenu = () => {
    setDaftarMenu(DATA_AWAL_MENU)
  }

  const handlePilihPesan = (namaMenu) => {
    const ramenUtama = ['Tantan Ramen', 'Shoyu Ramen', 'Abura Soba']
    if (ramenUtama.includes(namaMenu)) {
      setMenuTerpilihAwal(namaMenu)
    } else {
      setMenuTerpilihAwal('')
    }
    setHalamanAktif('pesan')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePindahHalaman = (halamanTujuan) => {
    setHalamanAktif(halamanTujuan)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handler Pemesanan & Admin (Terintegrasi dengan Backend NestJS)
  const tambahPesanan = async (payloadOrder) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadOrder),
    })

    const data = await res.json()
    if (!res.ok) {
      const pesan = Array.isArray(data.message) ? data.message.join(', ') : data.message
      throw new Error(pesan || 'Gagal mengirim pesanan ke server.')
    }

    const antreanBaru = mapOrderToAntrean(data)
    setDaftarAntrean((prev) => [antreanBaru, ...prev])
    return antreanBaru
  }

  const updateStatusAntrean = async (orderId) => {
    const target = daftarAntrean.find((item) => item.id === orderId)
    if (!target) return

    let nextStatus = 'completed'
    if (target.status === 'pending') nextStatus = 'cooking'
    else if (target.status === 'cooking') nextStatus = 'ready'

    const payload = {
      status: nextStatus,
      ...(target.status === 'pending' && target.metodeBayar === 'Belum Bayar'
        ? { paymentMethod: 'Tunai' }
        : {}),
    }

    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      throw new Error('Gagal memperbarui status pesanan.')
    }

    const updated = mapOrderToAntrean(await res.json())
    setDaftarAntrean((prev) => prev.map((item) => (item.id === orderId ? updated : item)))
    return updated
  }

  const hapusAntrean = async (orderId) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      throw new Error('Gagal menghapus pesanan.')
    }

    setDaftarAntrean((prev) => prev.filter((item) => item.id !== orderId))
  }

  const toggleStokMenu = (kodeMenu) => {
    setDaftarMenu(
      daftarMenu.map((item) =>
        item.kode === kodeMenu ? { ...item, tersedia: !item.tersedia } : item
      )
    )
  }

  return (
    <div className={halamanAktif === 'admin' ? 'bg-admin-wrapper' : 'd-flex flex-column min-vh-100'}>
      <Header halamanAktif={halamanAktif} onPindahHalaman={handlePindahHalaman} />

      {halamanAktif === 'katalog' && (
        <main className="container my-5">
          <DaftarMenu daftarMenu={daftarMenu} onPilihPesan={handlePilihPesan} />

          <RingkasanMenu
            totalMenu={daftarMenu.length}
            onKosongkan={kosongkanMenu}
            onReset={resetMenu}
          />

          <FormTambahMenu onTambah={tambahMenu} />
        </main>
      )}

      {halamanAktif === 'pesan' && (
        <HalamanPesan
          menuTerpilihAwal={menuTerpilihAwal}
          jumlahAntreanSaatIni={daftarAntrean.length}
          onTambahPesanan={tambahPesanan}
          onPindahHalaman={handlePindahHalaman}
        />
      )}

      {halamanAktif === 'admin' && (
        <HalamanAdmin
          daftarMenu={daftarMenu}
          daftarAntrean={daftarAntrean}
          onUpdateStatusAntrean={updateStatusAntrean}
          onHapusAntrean={hapusAntrean}
          onToggleStokMenu={toggleStokMenu}
        />
      )}

      {halamanAktif !== 'admin' && <Footer onPindahHalaman={handlePindahHalaman} />}
    </div>
  )
}

export default App
