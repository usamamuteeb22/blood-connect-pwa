
interface ImpactCardProps {
  impactLives: number;
  totalDonations: number;
}

const ImpactCard = ({ impactLives, totalDonations }: ImpactCardProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold text-blood">{impactLives}</p>
        <p className="text-sm text-gray-500">Lives impacted</p>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-2xl font-semibold">{totalDonations}</p>
        <p className="text-sm text-gray-500">Total donations</p>
      </div>
    </div>
  );
};

export default ImpactCard;
