import TrackClient from './TrackClient';

export const metadata = {
  title: 'Lacak Status Transaksi — NexaPay',
  description: 'Cek status proses pembayaran dan top up game kamu secara real-time dengan nomor Invoice ID.',
};

export default function TrackPage() {
  return <TrackClient />;
}
