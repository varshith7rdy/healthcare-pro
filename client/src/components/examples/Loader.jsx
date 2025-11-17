import Loader from '../Loader';

export default function LoaderExample() {
  return (
    <div className="flex items-center justify-center gap-8 p-12">
      <Loader size="sm" />
      <Loader size="md" />
      <Loader size="lg" />
      <Loader size="xl" />
    </div>
  );
}
