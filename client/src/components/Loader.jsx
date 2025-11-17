export default function Loader({ size = "md", fullScreen = false }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4",
  };

  const spinner = (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-primary border-t-transparent`}
      data-testid="loader-spinner"
    />
  );

  if (fullScreen) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background" data-testid="loader-fullscreen">
        {spinner}
      </div>
    );
  }

  return spinner;
}
