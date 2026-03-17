const calculate1RepMax = ({
  weight,
  reps,
  rir,
}: {
  weight: number;
  reps: number;
  rir: number;
}) => {
  return parseFloat(`${(weight * (1 + (reps + rir) / 30)).toFixed(2)}`);
};

const maxValues = ({ values }: { values: number[] }) => {
  return Math.min.apply(null, values);
};

export { calculate1RepMax, maxValues };
