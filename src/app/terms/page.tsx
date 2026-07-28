import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24">
        <div className="container-app max-w-3xl">
          <h1 className="heading-2 mb-2">Syarat & Ketentuan</h1>
          <p className="text-sm text-muted-foreground mb-8">Terakhir diperbarui: 25 Mei 2026</p>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">1. Ketentuan Umum</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dengan menggunakan layanan NexaPay (&quot;Platform&quot;), Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. NexaPay adalah platform yang menyediakan layanan top-up game, pembelian voucher digital, pulsa, paket data, token PLN, dan berbagai produk digital lainnya. Platform ini dioperasikan oleh PT NexaPay Digital Indonesia yang berkedudukan di Jakarta, Indonesia.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-3">2. Akun Pengguna</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Untuk menggunakan layanan kami secara penuh, Anda perlu membuat akun dengan informasi yang benar dan akurat. Anda bertanggung jawab penuh atas kerahasiaan akun dan password Anda. Anda setuju untuk segera memberitahu kami jika ada penggunaan tidak sah atas akun Anda. NexaPay tidak bertanggung jawab atas kerugian akibat kelalaian dalam menjaga keamanan akun.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-3">3. Layanan dan Transaksi</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Semua transaksi yang dilakukan melalui NexaPay bersifat final dan tidak dapat dibatalkan setelah pembayaran dikonfirmasi. Harga produk dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu. NexaPay berusaha memproses semua transaksi secepat mungkin, namun waktu pemrosesan dapat bervariasi tergantung pada penyedia layanan pihak ketiga.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-3">4. Pengembalian Dana (Refund)</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pengembalian dana hanya berlaku untuk transaksi yang gagal diproses oleh sistem kami. Jika terjadi kegagalan transaksi, dana akan dikembalikan ke saldo wallet NexaPay atau ke metode pembayaran asal dalam waktu 1x24 jam kerja. Untuk transaksi yang berhasil diproses, pengembalian dana tidak dapat dilakukan.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-3">5. Penggunaan yang Dilarang</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pengguna dilarang menggunakan Platform untuk: (a) aktivitas ilegal atau penipuan, (b) menyalahgunakan promo atau kode diskon, (c) menggunakan bot atau tools otomatis, (d) melakukan transaksi menggunakan kartu kredit curian atau metode pembayaran ilegal, (e) melakukan manipulasi sistem.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-3">6. Perubahan Ketentuan</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                NexaPay berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di Platform. Penggunaan berkelanjutan atas layanan kami setelah perubahan dianggap sebagai persetujuan Anda terhadap ketentuan baru.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-3">7. Hubungi Kami</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami melalui email di <a href="mailto:legal@nexapay.id" className="text-primary hover:underline">legal@nexapay.id</a> atau melalui <Link href="/help" className="text-primary hover:underline">Pusat Bantuan</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
