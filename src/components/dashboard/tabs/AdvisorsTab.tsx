
import AdvisorPerformanceList from '../charts/AdvisorPerformanceList';

interface AdvisorData {
  name: string;
  clients: number;
  conversion: number;
  revenue: number;
}

interface AdvisorsTabProps {
  advisorPerformance: AdvisorData[];
}

const AdvisorsTab = ({ advisorPerformance }: AdvisorsTabProps) => {
  return <AdvisorPerformanceList advisors={advisorPerformance} />;
};

export default AdvisorsTab;
