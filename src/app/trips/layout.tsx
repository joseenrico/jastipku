import { MapTransitionProvider } from '@/components/trips/map';

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MapTransitionProvider>
      {children}
    </MapTransitionProvider>
  );
}
