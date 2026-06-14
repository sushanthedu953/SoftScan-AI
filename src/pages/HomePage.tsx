import Hero from '../components/Hero';
import DemoSection from '../components/DemoSection';
import ChatSection from '../components/ChatSection';
import FeaturesGrid from '../components/FeaturesGrid';
import ExportCard from '../components/ExportCard';
import HistoryBootstrap from '../components/HistoryBootstrap';

export default function HomePage() {
  return (
    <>
      <HistoryBootstrap />
      <Hero />
      <DemoSection />
      <ChatSection />
      <FeaturesGrid />
      <ExportCard />
    </>
  );
}
