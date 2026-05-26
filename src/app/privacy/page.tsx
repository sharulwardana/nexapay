import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 tablet:pt-24 pb-24">
        <div className="container-app max-w-3xl">
          <h1 className="heading-2 mb-2">Kebijakan Privasi</h1>
          <p className="text-sm text-muted-foreground mb-8">Terakhir diperbarui: 25 Mei 2026</p>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">1. Informasi yang Kami Kumpulkan</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kami mengumpulkan informasi yang Anda berikan secara langsung saat mendaftar atau menggunakan layanan kami, termasuk: nama, alamat email, nomor telepon, informasi pembayaran, dan data transaksi. Kami juga mengumpulkan data secara otomatis seperti alamat IP, tipe browser, perangkat yang digunakan, dan aktivitas penggunaan Platform.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-3">2. Penggunaan Informasi</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Informasi yang kami kumpulkan digunakan untuk: (a) memproses transaksi dan pesanan, (b) mengirim notifikasi dan update terkait transaksi, (c) meningkatkan layanan dan pengalaman pengguna, (d) mengirim informasi promosi (dengan persetujuan), (e) mencegah penipuan dan aktivitas ilegal, (f) memenuhi kewajiban hukum.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-3">3. Keamanan Data</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                NexaPay menggunakan enkripsi SSL/TLS 256-bit, tokenisasi data kartu, dan standar keamanan PCI DSS untuk melindungi data sensitif. Kami menerapkan pembatasan akses ketat dan melakukan audit keamanan rutin untuk memastikan data Anda aman.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-3">4. Berbagi Data dengan Pihak Ketiga</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kami tidak menjual data pribadi Anda. Data hanya dibagikan dengan: (a) penyedia layanan pembayaran untuk memproses transaksi, (b) penyedia game/produk digital untuk mengirim item, (c) otoritas hukum jika diwajibkan oleh hukum. Semua mitra pihak ketiga kami terikat oleh perjanjian kerahasiaan data.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-3">5. Hak Pengguna</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Anda berhak untuk: (a) mengakses dan mengunduh data pribadi Anda, (b) memperbarui atau mengoreksi data yang tidak akurat, (c) meminta penghapusan akun dan data, (d) menolak pengiriman materi promosi. Untuk menjalankan hak-hak ini, silakan hubungi <a href="mailto:privacy@nexapay.id" className="text-primary hover:underline">privacy@nexapay.id</a>.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-3">6. Cookies</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kami menggunakan cookies dan teknologi serupa untuk meningkatkan pengalaman pengguna, menganalisis trafik, dan personalisasi konten. Anda dapat mengontrol pengaturan cookies melalui browser Anda.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-3">7. Kontak</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Jika ada pertanyaan mengenai kebijakan privasi ini, silakan hubungi Data Protection Officer kami melalui <a href="mailto:privacy@nexapay.id" className="text-primary hover:underline">privacy@nexapay.id</a> atau <Link href="/contact" className="text-primary hover:underline">halaman kontak</Link>.
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
